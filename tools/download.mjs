import fs from 'node:fs';
const jobs=JSON.parse(fs.readFileSync('.downloads.json'));
for(const j of jobs){fs.mkdirSync('sources/media',{recursive:true});const r=await fetch(j.url);if(!r.ok)throw Error(j.id+' '+r.status);fs.writeFileSync('sources/media/'+j.id+'.'+j.ext,Buffer.from(await r.arrayBuffer()));console.log(j.id);}
fs.unlinkSync('.downloads.json');
