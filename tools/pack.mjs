import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let ClassicLevel;try{({ClassicLevel}=require('classic-level'));}catch{({ClassicLevel}=require((process.env.FOUNDRY_PATH||'C:/FoundryVTT-Node-14.360')+'/node_modules/classic-level'));}
const manifest=JSON.parse(fs.readFileSync('module.json'));
const collections={Actor:'actors',Item:'items',JournalEntry:'journal',Scene:'scenes',RollTable:'tables',Playlist:'playlists',Macro:'macros',Adventure:'adventures'};
const children={Actor:['items','effects'],Item:['effects'],JournalEntry:['pages'],Scene:['tokens','walls','lights','sounds','notes','templates','tiles','drawings','regions'],RollTable:['results'],Playlist:['sounds']};
const lookup=new Map(manifest.packs.filter(p=>p.type!=='Adventure').flatMap(p=>JSON.parse(fs.readFileSync('content/'+p.name+'.json')).documents.map(d=>[p.type+'.'+d._id,`Compendium.${manifest.id}.${p.name}.${p.type}.${d._id}`])));
function links(v){if(typeof v==='string'){if(lookup.has(v))return lookup.get(v);return v.replace(/@UUID\[((?:Actor|Item|JournalEntry|Scene|RollTable|Playlist|Macro)\.\w{16})([^\]]*)\]/g,(m,root,tail)=>lookup.has(root)?`@UUID[${lookup.get(root)}${tail}]`:m);}if(Array.isArray(v))return v.map(links);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,links(x)]));return v;}
for(const p of manifest.packs){const input=JSON.parse(fs.readFileSync('content/'+p.name+'.json')); const db=new ClassicLevel(p.path,{valueEncoding:'json'});await db.open();await db.clear();const ops=[];
for(const d of input.documents){const s=p.type==='Adventure'?structuredClone(d):links(d),c=collections[p.type];for(const key of children[p.type]??[])if(Array.isArray(s[key])){for(const e of s[key])ops.push({type:'put',key:`!${c}.${key}!${s._id}.${e._id}`,value:e});s[key]=s[key].map(e=>e._id);}ops.push({type:'put',key:`!${c}!${s._id}`,value:s});}for(const f of input.folders)ops.push({type:'put',key:'!folders!'+f._id,value:f});await db.batch(ops);await db.close();console.log(p.name,input.documents.length);}
