import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import core from '../packages/circuit-core/index.mjs';
import {createEngine} from './engine_node_runtime.mjs';
const root=new URL('../engine/upstream/src/com/lushprojects/circuitjs1/public/',import.meta.url);
const menu=readFileSync(new URL('setuplist.txt',root),'utf8').split('+Basics\n')[1].split('\n-')[0];
const names=menu.trim().split('\n').map(line=>line.replace(/^>/,'').split(' ')[0]);
assert.equal(names.length,10);
// Independent XML fixtures for the pinned legacy Basics examples, using the
// upstream dumpXml attribute vocabulary. Current Falstad exports these as XML.
function asXml(text) {
  const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
  let rootAttributes={},nodes=[];
  for(const raw of text.trim().split(/\r?\n/)) {
    const [type,...t]=raw.split(/\s+/);const n=(i,fallback)=>t[i]===undefined?fallback:Number(t[i]);
    if(type==='$'){rootAttributes={f:t[0],ts:t[1]};continue;}
    const attrs={x:t.slice(0,4).join(' '),f:t[4]};let tag=type;
    if(type==='w'){}
    else if(type==='r')attrs.r=t[5];
    else if(type==='v')Object.assign(attrs,{wf:t[5],fr:t[6],maxv:t[7],bias:n(8,0),phaseShift:n(9,0),dutyCycle:n(10,.5)});
    else if(type==='172'){tag='VarRail';Object.assign(attrs,{wf:7,fr:t[6],maxv:t[7],bias:n(8,0),st:t.slice(11).join(' ')});}
    else if(type==='174'){tag='pt';Object.assign(attrs,{ma:t[5],po:t[6],sl:t.slice(7).join(' ')});}
    else if(type==='s'||type==='S'){
      Object.assign(attrs,{p:t[5]==='true'?1:t[5]==='false'?0:n(5),mm:t[6]});
      if(type==='S')Object.assign(attrs,{li:n(7,0),th:n(8,2)});
    }
    else if(type==='c')Object.assign(attrs,{c:t[5],vd:t[6],iv:n(7,.001),sr:n(8,0)});
    else if(type==='l')Object.assign(attrs,{l:t[5],i:t[6],ic:n(7,0),isat:n(8,0)});
    else if(type==='i')Object.assign(attrs,{cu:t[5],mv:n(6,0)});
    else if(type==='g')attrs.sy=n(5,0);
    else if(type==='O')attrs.sc=n(5,0);
    else if(['o','h','&','38'].includes(type)){
      tag=type==='&'||type==='38'?'adj':type;
      nodes.push(tag==='o'?'<o en="0"><p v="0" sc="5"/></o>':`<${tag}/>`);continue;
    }
    else assert.fail(`Uncovered Basics XML fixture: ${type}`);
    nodes.push(`<${tag} ${Object.entries(attrs).map(([k,v])=>`${k}="${escape(v)}"`).join(' ')}/>`);
  }
  return `<cir f="${rootAttributes.f}" ts="${rootAttributes.ts}">\n${nodes.join('\n')}\n</cir>`;
}
const session=core.adapter.createSession(createEngine());
for(const name of names) {
  const text=readFileSync(new URL('circuits/'+name,root),'utf8');
  const legacy=core.falstad.importText(text),xml=core.falstad.importText(asXml(text));
  for(const result of [legacy,xml])assert.ok(result.document,`${name}: ${JSON.stringify(result.diagnostics)}`);
  const original=core.adapter.compile(legacy.document).canonical;
  assert.equal(core.adapter.compile(xml.document).canonical,original,`${name}: XML topology/values differ from text`);
  const editing=core.editing.create(xml.document,()=>{},{wireSections:true});editing.replace(xml.document);
  assert.equal(core.adapter.compile(editing.document).canonical,original,`${name}: editor preparation changed topology`);
  session.loadDocument(editing.document);const frame=session.step(100);
  assert.ok(frame.time>0);
  for(const pins of Object.values(frame.pinVoltages))for(const value of Object.values(pins))assert.ok(Number.isFinite(value),name);
  if(name==='ohms.txt') {
    const resistors=editing.document.electrical.components.filter(c=>c.kind==='resistor');
    for(const component of resistors)assert.ok(Math.abs(Math.abs(frame.componentCurrents[component.id])-5/component.parameters.resistance)<1e-10);
  }
  if(name==='potdivide.txt'){
    const pot=editing.document.electrical.components.find(c=>c.kind==='potentiometer');
    assert.ok(Math.abs(frame.pinVoltages[pot.id].wiper-2.5)<1e-9);
  }
  console.log(`Basics import and engine step passed (text + XML): ${name}`);
}
