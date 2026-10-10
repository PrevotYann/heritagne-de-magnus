import fs from 'node:fs';import {extractTree}from '../scripts/translation.mjs';
import {demoFor}from './translation-demo.mjs';
import {compendiumLinks}from './compendium-links.mjs';
const manifest=JSON.parse(fs.readFileSync('module.json'));fs.mkdirSync('translations/templates',{recursive:true});fs.mkdirSync('examples/heritage-de-magnus-en/translations',{recursive:true});
const links=compendiumLinks(manifest);
for(const p of manifest.packs){const source=JSON.parse(fs.readFileSync('content/'+p.name+'.json')).documents;const docs=p.type==='Adventure'?source:links(source);const fields=new Set(docs.flatMap(d=>Object.keys(extractTree(d))));const mapping=Object.fromEntries([...fields].map(f=>[f,{path:f,converter:['name','navName','caption','description'].includes(f)?'magnus-text':'magnus-tree'}]));const data={label:p.label,mapping,entries:Object.fromEntries(docs.map(d=>[d._id,extractTree(d)]))};fs.writeFileSync('translations/templates/heritage-de-magnus.'+p.name+'.json',JSON.stringify(data,null,2));
const demo=demoFor(p,docs,mapping);
fs.writeFileSync('examples/heritage-de-magnus-en/translations/heritage-de-magnus.'+p.name+'.json',JSON.stringify(demo,null,2));}
