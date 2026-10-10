import {extractTree}from '../scripts/translation.mjs';
export function demoFor(pack,docs,mapping){const chosen=(pack.type==='JournalEntry'?docs.find(d=>d.pages?.length>1):pack.type==='Actor'?docs.find(d=>d.items?.length):pack.type==='Item'?docs.find(d=>d.system?.variants?.length):null)??docs[0];const entry=extractTree(chosen);entry.name='[EN] '+chosen.name;
function journal(j,t){if(j.pages?.length>1){t.pages[j.pages[0]._id].name='[EN] First page';t.pages[j.pages[1]._id].name='[EN] Second page';if(j.pages[0].text?.content)t.pages[j.pages[0]._id].text.content='<p>[EN] Translation example.</p>'+j.pages[0].text.content;}}
function actor(a,t){if(a.items?.length){t.items[a.items[0]._id].name='[EN] Embedded item';if(a.items[0].system.description)t.items[a.items[0]._id].system.description='<p>[EN] Equipment description.</p>'+a.items[0].system.description;}}
function item(i,t){if(i.system?.variants?.length)t.system.variants[i.system.variants[0].id].label='[EN] Variant';}
function table(t,tr){if(t.results?.length)tr.results[t.results[0]._id].name='[EN] Table result';}
journal(chosen,entry);actor(chosen,entry);item(chosen,entry);table(chosen,entry);
if(pack.type==='Adventure'){entry.caption='The legacy of Magnus';entry.description='<p>[EN] A journey across Freljord.</p>'+chosen.description;const j=chosen.journal.find(j=>j.pages.length>1);journal(j,entry.journal[j._id]);const a=chosen.actors.find(a=>a.items.length);entry.actors[a._id].name='[EN] '+a.name;actor(a,entry.actors[a._id]);const i=chosen.items.find(i=>i.system.variants?.length);if(i)item(i,entry.items[i._id]);const t=chosen.tables[0];table(t,entry.tables[t._id]);}
return {label:pack.label,mapping,entries:{[chosen._id]:entry}};}
