import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const requests=JSON.parse(fs.readFileSync('sources/asset-requests.json','utf8'));
const report=[];
for(const r of requests){const local=['sources/media/'+r.id+'.'+r.ext,'C:/git/jdr-runeterra/sources/original-assets/'+r.id+'.'+r.ext,'C:/git/jdr-runeterra/sources/reference/'+r.id+'.'+r.ext].find(p=>fs.existsSync(p));if(!local){report.push({...r,status:'missing'});continue;}fs.mkdirSync(path.dirname(r.output),{recursive:true});if(r.mime.startsWith('image/')){if(!fs.existsSync(r.output)||fs.statSync(local).mtimeMs>fs.statSync(r.output).mtimeMs)await sharp(local,{limitInputPixels:300000000}).webp({quality:90}).toFile(r.output);const m=await sharp(r.output).metadata();report.push({...r,status:'local',width:m.width,height:m.height});}else{if(!fs.existsSync(r.output))fs.copyFileSync(local,r.output);report.push({...r,status:'local'});}}
fs.writeFileSync('sources/asset-status.json',JSON.stringify(report,null,2));console.log('Assets',report.length,'missing',report.filter(x=>x.status==='missing').length);
