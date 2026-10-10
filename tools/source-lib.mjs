import fs from 'node:fs';
import crypto from 'node:crypto';
export const MODULE='heritage-de-magnus';
export const id=s=>crypto.createHash('sha256').update(MODULE+':'+s).digest('hex').slice(0,16);
export const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const plain=nodes=>(nodes??[]).map(n=>n.paragraph?(n.paragraph.elements??[]).map(e=>e.textRun?.content??'').join(''):n.table?n.table.tableRows.map(r=>r.tableCells.map(c=>plain(c.content)).join('\t')).join('\n'):n.tableOfContents?plain(n.tableOfContents.content):'').join('\n').replaceAll('\v','\n');
export const nodesOf=d=>[...(d.body?.content??[]),...(d.tabs??[]).flatMap(t=>t.body?.content??[])];
export const textOf=n=>plain([n]).trim();
export const heading=n=>n.paragraph?.paragraphStyle?.namedStyleType??'';
export function html(nodes){return (nodes??[]).map(n=>{
 if(n.table)return '<div class="magnus-table"><table>'+n.table.tableRows.map(r=>'<tr>'+r.tableCells.map(c=>'<td'+(c.tableCellStyle?.columnSpan>1?' colspan="'+c.tableCellStyle.columnSpan+'"':'')+'>'+html(c.content)+'</td>').join('')+'</tr>').join('')+'</table></div>';
 if(n.tableOfContents)return html(n.tableOfContents.content);
 if(!n.paragraph)return '';
 const p=n.paragraph,t=textOf(n);if(!t)return '';
 const runs=p.elements.map(e=>{if(!e.textRun)return '';let v=esc(e.textRun.content).replace(/[\n\v]/g,'<br>');const s=e.textRun.textStyle??{};
 if(s.bold)v='<strong>'+v+'</strong>';if(s.italic)v='<em>'+v+'</em>';if(s.underline&&!s.link)v='<u>'+v+'</u>';if(s.strikethrough)v='<s>'+v+'</s>';
 const color=s.foregroundColor?.color?.rgbColor;if(color&&color.red>0.5&&color.green<0.4)v='<span class="magnus-source-warning">'+v+'</span>';
 if(s.link?.url)v='<a href="'+esc(s.link.url)+'" target="_blank" rel="noopener">'+v+'</a>';return v;}).join('');
 const h=heading(n).match(/HEADING_([1-6])/);const tag=h?'h'+Math.min(4,Number(h[1])+1):'p';return '<'+tag+(p.bullet?' class="magnus-source-bullet"':'')+'>'+runs+'</'+tag+'>';
 }).join('');}
export function sections(nodes,predicate){let out=[],current={name:'Présentation',start:0,nodes:[]};for(const n of nodes){if(predicate(n)&&textOf(n)){if(current.nodes.length)out.push(current);current={name:textOf(n).replace(/\s*:\s*(?:\[.*)?$/,'').trim(),start:n.startIndex??0,nodes:[]};}current.nodes.push(n);}if(current.nodes.length)out.push(current);return out;}
export function splitPages(nodes,max=7500){let parts=[],a=[],size=0;for(const n of nodes){const len=textOf(n).length;if(a.length&&(size+len>max||heading(n).startsWith('HEADING_')&&size>400)){parts.push(a);a=[];size=0;}a.push(n);size+=len;}if(a.length)parts.push(a);return parts;}
export const inventory=()=>JSON.parse(fs.readFileSync('sources/drive/inventory.json','utf8'));
export function ancestry(f,inv){let a=[];for(let i=0;f&&i<20;i++,f=inv.find(x=>x.id===f.parent))a.unshift(f.title);return a.join('/');}
export const readDoc=file=>JSON.parse(fs.readFileSync(file,'utf8'));
export const attrs={FORCE:'force','AGILITÉ':'agility',ENDURANCE:'endurance',CONCENTRATION:'concentration',PERCEPTION:'perception','RÉFLEXES':'reflexes','DEXTÉRITÉ':'dexterity','DISCRÉTION':'stealth',CHARISME:'charisma',PERSUASION:'persuasion',INTIMIDATION:'intimidation',MENTAL:'mental'};
export function statsFrom(nodes){const result={attributes:{},specials:[],actions:[],inventory:[]};const text=plain(nodes);const hp=text.match(/\bPV\s*:\s*(\d+)(?:\s*\/\s*(\d+))?/i);if(hp)result.hp={base:Number(hp[1]),baseMax:Number(hp[2]??hp[1])};
 const resist=text.match(/(?:ARM?[-/]R?M|AR-MR|ARM-MR)\s*:\s*(\d+)\s*[-/]\s*(\d+)/i);if(resist){result.armor=Number(resist[1]);result.rm=Number(resist[2]);}else{for(const [re,key] of [[/\bARM?\s*:\s*(\d+)/i,'armor'],[/\bR[M]?\s*:\s*(\d+)/i,'rm']]){const m=text.match(re);if(m)result[key]=Number(m[1]);}}
 const walk=nodes=>{for(const n of nodes){if(!n.table)continue;for(const r of n.table.tableRows){const cells=r.tableCells.map(c=>plain(c.content));for(let c=0;c<cells.length-1;c++){const labels=cells[c].split('\n').map(x=>x.trim()).filter(Boolean),values=cells[c+1].split('\n').map(x=>x.trim()).filter(Boolean);if(labels.length===values.length&&values.every(v=>/^\d+(?:\/\d+)?$/.test(v))){for(let j=0;j<labels.length;j++){const label=labels[j].replace(/\s*:\s*$/,'').trim(),key=attrs[label.toUpperCase()];if(key)result.attributes[key]={base:Number(values[j].split('/')[0]),bonus:0};else if(!/TÊTE|TORSE|MAINS|JAMBES|PIEDS|PV|ARM|RM/i.test(label))result.specials.push({name:label,value:Number(values[j].split('/')[0])});}}}for(const cell of r.tableCells)walk(cell.content);}}};walk(nodes);
 for(const [label,key] of Object.entries(attrs)){const m=text.match(new RegExp('(?:^|\\n)'+label+'\\s*:\\s*(\\d+)','i'));if(m&&!result.attributes[key])result.attributes[key]={base:Number(m[1]),bonus:0};}
 // Scenario profiles also occur inside a surrounding table. Their extracted text
 // retains tab-delimited cells even when the original table is embedded in prose.
 const cells=text.split('\t');for(let i=0;i<cells.length-1;i++){const labels=cells[i].split('\n').map(x=>x.trim()).filter(Boolean),values=cells[i+1].split('\n').map(x=>x.trim()).filter(Boolean);if(labels.length!==values.length||!values.every(v=>/^\d+(?:\/\d+)?$/.test(v)))continue;for(let j=0;j<labels.length;j++){const label=labels[j].replace(/\s*:\s*$/,'').trim(),key=attrs[label.toUpperCase()];if(key)result.attributes[key]??={base:Number(values[j].split('/')[0]),bonus:0};else if(!/TÊTE|TORSE|MAINS|JAMBES|PIEDS|PV|ARM|RM/i.test(label)&&!result.specials.some(s=>s.name===label))result.specials.push({name:label,value:Number(values[j].split('/')[0])});}}
 const sequence=Object.keys(attrs).map(label=>label+'\\s*:\\s*').join('');const dense=text.match(new RegExp(sequence+'((?:\\d+(?:/\\d+)?\\s+){11}\\d+(?:/\\d+)?)','i'));if(dense){const values=dense[1].trim().split(/\s+/);Object.values(attrs).forEach((key,i)=>result.attributes[key]??={base:Number(values[i].split('/')[0]),bonus:0});}
 const firstLine=text.trim().split('\n')[0],descriptor=firstLine.match(/\(([^)]*)\)/)?.[1];if(descriptor){for(const part of descriptor.split(/\s*-\s*/)){const m=part.match(/^(.+?)\s*(?:\/|\s)\s*(\d{1,3})$/);if(m&&!/lvl|niveau|ans/i.test(m[1])&&!result.specials.some(s=>s.name===m[1].trim()))result.specials.push({name:m[1].trim(),value:Number(m[2])});}}
 return result;}
