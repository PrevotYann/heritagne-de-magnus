import fs from 'node:fs';
const inv=JSON.parse(fs.readFileSync('sources/drive/inventory.json'));
const ancestry=f=>{const a=[];for(let i=0;f&&i<20;i++,f=inv.find(x=>x.id===f.parent))a.unshift(f.title);return a.join('/');};
for(const name of ['INDEX EFFETS','NOTES PNJ','NOTES LIEUX','NOTES DOC','NOTES LIVRES','NOTES LORE']) {
 const f=inv.find(f=>f.title.startsWith(name));const d=JSON.parse(fs.readFileSync('sources/drive/docs/'+f.id+'.json'));const nodes=d.tabs.flatMap(t=>t.body?.content??[]);let rows=[];
 for(const n of nodes)if(n.paragraph){const t=n.paragraph.elements.map(e=>e.textRun?.content??'').join('').trim();if(t&&(/^[\dLS]+[-.]/.test(t)||(/^[^:]{2,90}:\s*$/.test(t)&&t===t.toUpperCase())))rows.push(t);}
 console.log('\n'+name+'\n'+rows.join('\n'));
}
console.log('\nMEDIA CAMPAGNE\n'+inv.filter(f=>/magnus|grimoire|testament|lettres|messages|plan mj|map mj|map papier|carte.*mj/i.test(ancestry(f))).map(f=>f.id+' '+ancestry(f)).join('\n'));
fs.writeFileSync('sources/drive/paths.json',JSON.stringify(inv.map(f=>({id:f.id,path:ancestry(f)})),null,2));
