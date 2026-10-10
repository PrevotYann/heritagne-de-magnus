import fs from 'node:fs';
const extract=nodes=>(nodes??[]).map(n=>n.paragraph?(n.paragraph.elements??[]).map(e=>e.textRun?.content??'').join(''):n.table?n.table.tableRows.map(r=>r.tableCells.map(c=>extract(c.content)).join('\t')).join('\n'):n.sectionBreak?'':n.tableOfContents?extract(n.tableOfContents.content):'').join('\n');
fs.mkdirSync('sources/text',{recursive:true});
for(const file of ['sources/drive/adventure.json',...fs.readdirSync('sources/drive/docs').map(f=>'sources/drive/docs/'+f)]) {
 const d=JSON.parse(fs.readFileSync(file,'utf8'));const t=[d.body,...(d.tabs??[]).map(t=>t.body)].filter(Boolean).map(b=>extract(b.content)).join('\n');
 fs.writeFileSync('sources/text/'+d.documentId+'.txt',t);
 console.log(d.title,t.length);
}
