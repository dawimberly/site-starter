import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import handler from '../api/leads.js';

const original = await readFile(new URL('../client.json',import.meta.url),'utf8');
const oldEnv={...process.env}; const oldFetch=globalThis.fetch;
after(async()=>{ await writeFile(new URL('../client.json',import.meta.url),original); process.env=oldEnv; globalThis.fetch=oldFetch; });
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(x){this.body=x;return this}};}
const body={name:'Jane Doe',email:'jane@example.org',phone:'',message:'Please contact me about a project.',company:'',submissionId:'123e4567-e89b-42d3-a456-426614174000'};
test('lead endpoint fails closed then accepts email-only lead only after provider acceptance',async()=>{
 const c=JSON.parse(original); c.leadForm.enabled=true; await writeFile(new URL('../client.json',import.meta.url),JSON.stringify(c));
 delete process.env.LEAD_TO_EMAIL; process.env.LEAD_FROM_EMAIL='test@example.org'; process.env.RESEND_API_KEY='test';
 let res=response(); await handler({method:'POST',body},res); assert.equal(res.code,503);
 process.env.LEAD_TO_EMAIL='owner@example.org';
 globalThis.fetch=async()=>({ok:false,json:async()=>({message:'failed'})});
 res=response(); await handler({method:'POST',body},res); assert.equal(res.code,502); assert.equal(res.body.ok,false);
 let sent; globalThis.fetch=async(_url,opts)=>{sent=JSON.parse(opts.body);return {ok:true,json:async()=>({id:'provider-id'})}};
 res=response(); await handler({method:'POST',body},res); assert.equal(res.code,200); assert.equal(res.body.ok,true); assert.equal(sent.reply_to,body.email);
 res=response(); await handler({method:'POST',body:{...body,company:'spam'}},res); assert.equal(res.code,400);
});
