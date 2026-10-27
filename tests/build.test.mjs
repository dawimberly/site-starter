import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

test('static build renders escaped values, phone-only primary link and launch guard',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'starter-')); const file=path.join(dir,'client.json');
 try {
  const c=JSON.parse(await readFile('client.json','utf8')); Object.assign(c,{name:'Real & Co',headline:'Help',description:'Helpful services',about:'A real practice',privacyText:'Client reviewed privacy policy.',url:'https://sample.test/',noindex:false,phone:'+1 (210) 555-0100',services:[{title:'Repair',description:'Help'}]});
  c.labels.phone='Call now'; await writeFile(file,JSON.stringify(c));
  execFileSync(process.execPath,['scripts/build.mjs','--config',file]);
  const html=await readFile('dist/index.html','utf8');
  assert.match(html,/Real &amp; Co/); assert.match(html,/class="button" href="tel:\+12105550100">Call now/); assert.match(html,/<link rel="canonical" href="https:\/\/sample.test\/">/);
  assert.equal(spawnSync(process.execPath,['scripts/check-launch.mjs','--launch','--config',file]).status,0);
  c.noindex=true; await writeFile(file,JSON.stringify(c)); execFileSync(process.execPath,['scripts/build.mjs','--config',file]);
  assert.notEqual(spawnSync(process.execPath,['scripts/check-launch.mjs','--launch','--config',file]).status,0);
 } finally {await rm(dir,{recursive:true,force:true});}
});
