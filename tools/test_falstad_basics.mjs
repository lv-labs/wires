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
  let scopes=0;
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
      if(tag==='o'){
        const [element,speed,value,flags,volts,amps,position,count,element2,value2]=t;
        assert.ok(flags==='3'||flags==='4099'&&count==='2');
        nodes.push(`<o en="${element}" sp="${speed}" f="x3" p="${position??scopes}"><p v="${value}" sc="${volts}"/><p e="${element2??element}" v="${value2??3}" sc="${amps}"/></o>`);
        scopes++;
      }else nodes.push(`<${tag}/>`);
      continue;
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
  const {channels,unresolved}=core.geometry.scopeChannels(editing.document);
  assert.deepEqual(unresolved,[]);
  assert.deepEqual(channels,core.geometry.scopeChannels(legacy.document).channels,`${name}: XML scope traces differ from text`);
  const acquisition=core.signals.create();
  const traces=acquisition.setChannels(channels);
  session.loadDocument(editing.document);const frame=session.step(100,traces);
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
  if(name==='lrc.txt'){
    assert.equal(channels.length,6);
    const workspace=editing.document.layout.scopes;
    assert.equal(workspace.open,true);
    assert.equal(Object.keys(workspace.panes).length,3);
    for(const [id,pane] of Object.entries(workspace.panes)){
      assert.ok(Math.abs(pane.timeDivision-.01)<1e-12);
      assert.equal(channels.filter(trace=>workspace.assignments[trace.id]===id).length,2);
    }
    assert.deepEqual(workspace,legacy.document.layout.scopes);
    const reopened=core.editing.create(core.document.validate(JSON.parse(JSON.stringify(editing.document))),()=>{},{wireSections:true});
    reopened.replace(reopened.document);
    assert.deepEqual(reopened.document.layout.scopes,workspace);
    assert.deepEqual(core.geometry.scopeChannels(reopened.document).channels,channels);

    // Start both solvers from the imported initial state and sample the native posts.
    const native=createEngine();
    native.load(`r 176 80 384 80 0 10
s 384 80 448 80 0 1 false
w 176 80 176 352 0
c 384 352 176 352 0 0.000015 -10 -10
l 384 80 384 352 0 1 0 0 0
v 448 352 448 80 0 0 40 5 0 0 0.5
r 384 352 448 352 0 100
g 448 352 448 384 0`,5e-6);
    const expected=native.step(100).elements;
    for(const [index,element] of [expected[4],expected[3],expected[0]].entries()){
      const voltage=frame.sampleBatch.values[channels[2*index].id].at(-1);
      const current=frame.sampleBatch.values[channels[2*index+1].id].at(-1);
      assert.ok(Math.abs(voltage-(element.voltages[0]-element.voltages[1]))<1e-8);
      assert.ok(Math.abs(current-element.current)<1e-8);
    }
  }
  console.log(`Basics import and engine step passed (text + XML): ${name}`);
}
