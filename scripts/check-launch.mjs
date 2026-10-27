import {readFile} from 'node:fs/promises';
const args=process.argv.slice(2), example=args.includes('--example'), launch=args.includes('--launch');
if(example===launch) throw new Error('Choose --example or --launch');
const configAt=args.indexOf('--config'); const file=configAt>=0?args[configAt+1]:'client.json';
const c=JSON.parse(await readFile(file,'utf8')); const html=await readFile('dist/index.html','utf8');
const issues=[];
if(!html.includes('<link rel="canonical"')) issues.push('Missing canonical link');
if(launch){
 if(/Example Business|Replace this|Service one/i.test(JSON.stringify(c))) issues.push('Placeholder text remains');
 if(!(c.email||c.phone||c.sms||c.booking||c.leadForm?.enabled)) issues.push('Missing contact routes');
 if(c.noindex || /noindex/i.test(html)) issues.push('Noindex remains enabled');
 if(/example\.com/i.test(c.url||'')) issues.push('Example canonical remains');
 if(!c.privacyText || /Replace this/i.test(c.privacyText)) issues.push('Privacy policy is not configured');
}
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}else console.log(`Launch check passed (${example?'example':'launch'} mode)`);
