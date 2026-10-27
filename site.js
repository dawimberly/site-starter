(() => {
  const config = JSON.parse(document.getElementById('tracking-config')?.textContent || '{}');
  let allowed = false;
  const validTag = /^G-[A-Z0-9]+$|^AW-\d+$/;
  if (config.enabled && Array.isArray(config.hosts) && config.hosts.includes(location.hostname) && validTag.test(config.googleTagId || '')) {
    const box = document.createElement('div'); box.className = 'consent';
    box.textContent = 'Allow optional analytics? ';
    const accept = document.createElement('button'); accept.textContent = 'Allow';
    const reject = document.createElement('button'); reject.textContent = 'Decline';
    box.append(accept,reject); document.body.append(box);
    accept.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'denied'});
      const script=document.createElement('script'); script.async=true; script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(config.googleTagId);
      document.head.append(script); window.gtag('js',new Date()); window.gtag('config',config.googleTagId); allowed=true; box.remove();
    });
    reject.addEventListener('click',()=>box.remove());
  }
  const form=document.getElementById('lead-form');
  if(!form) return;
  const status=document.getElementById('form-status');
  let submissionId=crypto.randomUUID();
  form.addEventListener('submit',async event=>{
    event.preventDefault(); const button=form.querySelector('button[type="submit"]'); button.disabled=true; status.textContent='Sending.';
    const data=Object.fromEntries(new FormData(form)); data.submissionId=submissionId;
    try {
      const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await response.json();
      if(!response.ok || result.ok!==true || result.discarded) throw new Error('Could not send your message. Please use another contact option.');
      status.textContent='Your message was accepted. Thank you.';
      if(allowed && /^AW-\d+\/[A-Za-z0-9_-]+$/.test(config.conversionId||'')) window.gtag('event','conversion',{send_to:config.conversionId,transaction_id:submissionId});
      form.reset(); submissionId=crypto.randomUUID();
    } catch { status.textContent='Could not confirm delivery. Please try again or use another contact option.'; }
    finally {button.disabled=false;}
  });
})();
