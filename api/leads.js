import { readFile } from 'node:fs/promises';

// API acceptance means the email provider accepted the request; inbox delivery is not guaranteed.
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST') return res.status(405).json({ok:false});
  let config; try { config=JSON.parse(await readFile(new URL('../client.json',import.meta.url),'utf8')); } catch { return res.status(503).json({ok:false}); }
  const to=process.env.LEAD_TO_EMAIL?.trim(), from=process.env.LEAD_FROM_EMAIL?.trim(), key=process.env.RESEND_API_KEY?.trim();
  if(!config.leadForm?.enabled || !to || !from || !key) return res.status(503).json({ok:false,message:'Contact form unavailable.'});
  const p=req.body;
  if(!p || typeof p!=='object' || Array.isArray(p)) return res.status(400).json({ok:false});
  const {name,email,phone='',message,company='',submissionId}=p;
  if([name,email,phone,message,company,submissionId].some(v=>typeof v!=='string')) return res.status(400).json({ok:false});
  if(company.trim()) return res.status(400).json({ok:false});
  if(!/^[0-9a-f-]{36}$/i.test(submissionId) || name.trim().length<2 || name.length>120 || email.length>200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length>25 || message.trim().length<5 || message.length>5000) return res.status(400).json({ok:false});
  try {
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`contact-lead/${submissionId}`},body:JSON.stringify({from,to:[to],reply_to:email,subject:`New inquiry for ${String(config.name).replace(/[\r\n]/g,' ').slice(0,100)}`,text:`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`})});
    const body=await response.json();
    if(!response.ok || typeof body.id!=='string') return res.status(502).json({ok:false,message:'Could not deliver message.'});
    return res.status(200).json({ok:true,submissionId});
  } catch { return res.status(502).json({ok:false,message:'Could not deliver message.'}); }
}
