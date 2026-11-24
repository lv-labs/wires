import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import core from '../packages/circuit-core/index.mjs';
import {createEngine} from './engine_node_runtime.mjs';
const {falstad,adapter,geometry}=core;
const require=createRequire(import.meta.url);
assert.equal(typeof require('../packages/circuit-core').falstad.importText,'function');
const parse=(text)=>{
  const result=falstad.importText(text);assert.ok(result.document,JSON.stringify(result.diagnostics));
  core.document.validate(result.document);return result.document;
};
const divider=`$ 1 0.000005 10 50 5 50
v 0 96 0 0 0 0 40 5 0 0 0.5
r 0 0 96 0 0 1000
r 96 0 96 96 0 1000
w 96 96 0 96 0`;
const document=parse(divider),compiled=adapter.compile(document);
assert.equal(document.simulation.timeStep,5e-6);
assert.equal(compiled.nets.length,3);
assert.equal(document.electrical.components.filter(c=>c.kind==='ground').length,1);
for(const map of [document.layout.components,document.layout.junctions])for(const p of Object.values(map)){
  assert.equal(p.x%50,0);assert.equal(p.y%50,0);
}
const session=adapter.createSession(createEngine());session.loadDocument(document);
let frame=session.step(10);
assert.ok(Math.abs(frame.pinVoltages.c4.a-2.5)<1e-10);
assert.ok(Math.abs(frame.componentCurrents.c3-.0025)<1e-10);
assert.ok(Math.abs(frame.componentCurrents.c2+.0025)<1e-10);
// Post coincidence connects; crossings and posts touching wire interiors do not.
const crossing=parse('r 0 0 96 0 0 1000\nr 48 -48 48 48 0 1000\nw 0 0 96 0 0');
assert.equal(adapter.compile(crossing).nets.length,3);
const touching=parse('r 0 0 96 0 0 1000\nr 48 0 48 96 0 1000\nw 0 0 96 0 0');
assert.equal(adapter.compile(touching).nets.length,3);
const annotated=parse(String.raw`r 0 0 128 0 0 1000
x 2 24 160 32 0 12 Input %2B\nBias
x 40 24 160 32 6 16 Q\s\q\sA\pB\\nLow`);
assert.equal(adapter.compile(annotated).nets.length,2);
assert.deepEqual(annotated.layout.drawings.map(({text,overline})=>({text,overline})),[
  {text:'Input +\nBias',overline:undefined},
  {text:'Q = A+B\nLow',overline:true},
]);
const xmlAnnotation=parse(String.raw`<cir><x x="40 24 160 32" f="2" si="16" te="Q = A+B\nLow"/></cir>`);
assert.deepEqual(xmlAnnotation.layout.drawings[0],{...annotated.layout.drawings[1],id:'d2'});
const shapesText=parse('$ 0 .000005 10 50 5\nb 128 64 0 0 0\n423 0 0 96 64 0');
const shapesXml=parse('<cir><b x="128 64 0 0"/><Line x="0 0 96 64"/></cir>');
assert.deepEqual(shapesText.layout.drawings,shapesXml.layout.drawings);
assert.deepEqual(shapesXml.layout.drawings.map(d=>[d.kind,d.strokeStyle]),[['box','dashed'],['line','solid']]);
assert.deepEqual(shapesXml.electrical,{components:[],junctions:[],wires:[]});
assert.deepEqual(parse('$ 1 5.0E-6 10 50 5.0').electrical.components,[]);
// A translated, off-grid record keeps the same compact span and straight leads.
const centered=parse('r 1 0 129 0 0 1000');
assert.equal(centered.layout.components.c1.x,200);
assert.deepEqual(centered.electrical.wires.map(w=>geometry.route(centered,w)),[
  [{x:100,y:0},{x:0,y:0}],
  [{x:300,y:0},{x:400,y:0}],
]);
const coincidentAfterSnap=parse('r 0 0 128 0 0 1000\nr 1 0 129 0 0 1000');
assert.equal(adapter.compile(coincidentAfterSnap).nets.length,4);
// Diagonal parts rotate to a native axis and leave both pins in that direction.
for(const [x,y] of [[48,48],[48,-48],[-48,48],[-48,-48],[16,128],[128,16]]){
  const doc=parse(`r 0 0 ${x} ${y} 0 1000`);
  const center=doc.layout.components.c1;
  for(const wire of doc.electrical.wires){
    const [pin,turn,post]=geometry.route(doc,wire);
    const axis=pin.x===center.x?'y':'x';
    const across=axis==='x'?'y':'x';
    assert.equal(turn[across],pin[across]);
    assert.ok((turn[axis]-pin[axis])*(pin[axis]-center[axis])>0);
    if(post)assert.equal(turn[axis],post[axis]);
  }
}
const rail=parse('R 0 0 0 -32 0 0 40 5 0 0 .5\nr 0 0 96 0 0 1000\ng 96 0 96 32 0');
assert.equal(rail.electrical.components.filter(c=>c.kind==='ground').length,1);
session.loadDocument(rail);assert.equal(session.step(10).pinVoltages.c2.a,5);
const routedNet=parse(`<cir>
  <R x="0 0 0 -32"/>
  <rw x="0 0 96 64">0,0;0,64;96,64</rw>
  <ln x="96 64 144 64" te="A + B"/>
  <ln x="256 64 304 64" te="A + B"/>
  <r x="256 64 256 128" r="1000"/>
  <g x="256 128 256 160"/>
  <r x="0 64 0 128" r="1000"/>
  <g x="0 128 0 160"/>
  <o en="3" f="x2"><p v="0"/></o>
</cir>`);
const routedWire=routedNet.electrical.wires.find(w=>w.from.kind==='junction'&&w.to.kind==='junction');
const [routeStart,routeCorner,routeEnd]=geometry.route(routedNet,routedWire);
assert.deepEqual(routeCorner,{x:routeStart.x,y:routeEnd.y});
const routedScope=geometry.scopeChannels(routedNet).channels;
assert.equal(routedScope.length,1);
session.loadDocument(routedNet);
const routedFrame=session.step(10,core.signals.create().setChannels(routedScope));
const [connectedLoad,isolatedLoad]=routedNet.electrical.components.filter(c=>c.kind==='resistor');
assert.ok(Math.abs(routedFrame.componentCurrents[connectedLoad.id]-.005)<1e-10);
assert.equal(routedFrame.componentCurrents[isolatedLoad.id],0);
assert.equal(routedFrame.sampleBatch.values[routedScope[0].id].at(-1),5);

for(const [legacy,xml] of [
  ['T 0 32 64 32 4 4 2 0 0 .99 0','<T x="0 32 64 32" f="4" in="4" ra="2" co=".99"/>'],
  ['169 0 32 64 32 2 4 2 0 0 0 .99','<tt x="0 32 64 32" f="2" in="4" ra="2"/>'],
  ['z 0 0 96 0 1 .805904783 5.6','<z x="0 0 96 0"/>'],
  ['162 0 0 96 0 1 2.1024259 .3 .8 .1 .02','<LED x="0 0 96 0" mo="old-default-led" cr=".3" cg=".8" cb=".1" mbc=".02"/>'],
  ['159 0 0 96 0 2 20 1e10 2.5','<as x="0 0 96 0"/>'],
  ['160 0 0 96 0 5 12 1e9 3','<as2 x="0 0 96 0" f="5" ron="12" roff="1e9" th="3"/>'],
  ['182 0 0 96 0 0 .5 1.66 3.33 5 0','<Schmitt x="0 0 96 0"/>'],
  ['183 0 0 96 0 0 .3 1.2 2.8 4 .1','<InvertingSchmitt x="0 0 96 0" slr=".3" lt="1.2" ut="2.8" lon="4" loff=".1"/>'],
  ['209 0 0 96 0 2 .00001 .001 .001 1','<pc x="0 0 96 0" f="2"/>'],
  ['209 0 0 96 0 6 .00001 .001 .001 0 1','<pc x="0 0 96 0" f="2"/>'],
  ['370 0 0 96 0 3 1 2','<Ammeter x="0 0 96 0" me="1" sc="2"/>'],
  [String.raw`368 0 0 96 0 1 1 Input\s\p\sBias`,'<TestPoint x="0 0 96 0" me="1" lb="Input + Bias"/>'],
  ['m 0 0 96 0 0 100 16000 5e-9 1e-8 1e-10','<m x="0 0 96 0" do="5e-9"/>'],
  ['155 0 32 64 32 8193 3.3 3.3','<DFlipFlop x="0 32 64 32" f="1" hv="3.3" v1="3.3"/>'],
  ['156 0 32 64 32 4100 5','<JKFlipFlop x="0 32 64 32" f="4100" v3="5"/>'],
  ['193 0 32 64 32 3072 0','<TFlipFlop x="0 32 64 32" f="3072"/>'],
  ['419 0 32 64 32 2048 4 2','<dd x="0 32 64 32" f="2048" bc="4" dm="2"/>'],
  ['S 0 0 96 0 0 0 false 0 false 0','<S x="0 0 96 0"/>'],
  ['R 0 0 -32 0 0 1 40 -.1 .5','<R x="0 0 -32 0" wf="1" maxv="-.1" bias=".5"/>'],
  ['175 0 0 96 0 0','<TunnelDiode x="0 0 96 0"/>'],
  ['176 0 0 96 0 1 .805904783 -.4 4e-12','<Varactor x="0 0 96 0" ca="-.4"/>'],
  ['181 0 0 96 0 0 300 .5 6 .04 .04','<Lamp x="0 0 96 0" np=".5" nv="6" wa=".04" co=".04"/>'],
  ['187 0 0 96 0 0 1000 1e9 1000 .001','<SparkGap x="0 0 96 0"/>'],
  ['173 0 0 96 0 2 93 680','<Triode x="0 0 96 0"/>'],
  ['177 0 0 0 128 1 0 0 .012 .006 75','<SCR x="0 0 0 128" tr=".012" ho=".006" gr="75"/>'],
  ['203 0 0 96 0 0 400 1e8 29 .012','<Diac x="0 0 96 0" ron="400" bd="29" hc=".012"/>'],
  ['206 0 0 96 16 0 .011 .008 100 true','<Triac x="0 0 96 16" ti=".011" hi=".008" st="true"/>'],
]){
  const a=parse(`$ 0 .000005 10 50 5\n${legacy}`),b=parse(`<cir>${xml}</cir>`);
  assert.deepEqual(a.electrical.components,b.electrical.components);
  assert.deepEqual(a.layout,b.layout);
  assert.equal(adapter.compile(a).canonical,adapter.compile(b).canonical);
}

const sourceAndLoad=`R 0 32 0 -16 0 0 40 5 0 0 .5
g 0 64 0 96 0
r 64 32 64 64 0 1000
g 64 64 64 96 0`;
const transformerRecord=flags=>`T 0 32 64 64 ${flags} 4 2 0 0 .99 0`;
const transformer=parse(`${transformerRecord(0)}\n${sourceAndLoad}`);
const transformerId=transformer.electrical.components[0].id;
const transformerLoad=transformer.electrical.components.find(c=>c.kind==='resistor').id;
const nativeTransformer=createEngine();
nativeTransformer.load(`${transformerRecord(0)}\n${sourceAndLoad}`,5e-6);
const expectedTransformer=nativeTransformer.step(80).elements[0].voltages[1];
assert.ok(expectedTransformer>1);
session.loadDocument(transformer);
assert.ok(Math.abs(session.step(80).pinVoltages[transformerLoad].a-expectedTransformer)<1e-8);
const reversed=parse(`${transformerRecord(4)}\n${sourceAndLoad}`);
const reversedLoad=reversed.electrical.components.find(c=>c.kind==='resistor').id;
session.loadDocument(reversed);
assert.ok(Math.abs(session.step(80).pinVoltages[reversedLoad].a+expectedTransformer)<1e-8);
const primary=transformer.electrical.components[0];
core.editing.replaceParameters(transformer,transformerId,{...primary.parameters,reverseSecondary:true});
assert.equal(adapter.compile(transformer).canonical,adapter.compile(reversed).canonical);

const momentaryText=parse('$ 0 .000005 10 50 5\nL 0 0 -32 0 0 0 true 5 0');
const momentaryXml=parse('<cir><L x="0 0 -32 0" mm="true"/></cir>');
assert.deepEqual(momentaryText.electrical,momentaryXml.electrical);
const momentaryControl=momentaryText.electrical.components[0];
assert.equal(core.catalog.momentary(momentaryControl),true);
const pressed=core.editing.momentaryDocument(momentaryText,momentaryControl.id);
assert.equal(momentaryControl.parameters.state,0);
assert.equal(pressed.electrical.components[0].parameters.state,1);
const momentaryPin=Object.keys(core.catalog.componentPins(momentaryControl))[0];
session.loadDocument(momentaryText);
assert.equal(session.step(10).pinVoltages[momentaryControl.id][momentaryPin],0);
session.loadDocument(pressed);
assert.equal(session.step(10).pinVoltages[momentaryControl.id][momentaryPin],5);
const ternaryMomentary=parse('L 0 0 -32 0 1 2 true 5 0');
assert.equal(core.catalog.switchPositionCount(ternaryMomentary.electrical.components[0]),3);
assert.equal(core.editing.momentaryDocument(ternaryMomentary,'c1').electrical.components[0].parameters.state,0);

// The native divide-by-two example feeds Qn back to D and scopes clock and Q.
const dividerByTwo=parse(readFileSync(new URL('../engine/upstream/src/com/lushprojects/circuitjs1/public/circuits/divideby2.txt',import.meta.url),'utf8'));
const dividerChannels=geometry.scopeChannels(dividerByTwo).channels;
assert.equal(dividerChannels.length,2);
session.loadDocument(dividerByTwo);
const digitalTraces=core.signals.create().setChannels(dividerChannels);
const previousLevels=[0,0],risingEdges=[0,0];
for(let block=0;block<10;block++){
  const {sampleBatch}=session.step(1000,digitalTraces);
  dividerChannels.forEach(({id},index)=>{
    for(const sample of sampleBatch.values[id]){
      if(sample>2.5&&previousLevels[index]<=2.5)risingEdges[index]++;
      previousLevels[index]=sample;
    }
  });
}
assert.ok(risingEdges[0]>=4);
assert.ok(Math.abs(risingEdges[0]-2*risingEdges[1])<=1);
// Polarity and layout for every orthogonal direction, including reverse records.
for(const [x,y] of [[96,0],[-96,0],[0,96],[0,-96]]){
  const doc=parse(`v 0 0 ${x} ${y} 0 0 40 5 0 0 .5\nr ${x} ${y} 0 0 0 1000`);
  const p=geometry.pin(doc,{kind:'pin',componentId:'c1',pinId:'p'});
  const n=geometry.pin(doc,{kind:'pin',componentId:'c1',pinId:'n'});
  assert.ok((p.x-n.x)*x+(p.y-n.y)*y>0);
  session.loadDocument(doc);assert.equal(session.step(10).pinVoltages.c1.p,5);
}
// Check native op-amp posts for all directions, small/large and swapped polarity.
for(const [x,y] of [[128,0],[-128,0],[0,128],[0,-128]])for(const flags of [0,1,2,3]){
  const doc=parse(`a 0 0 ${x} ${y} ${flags} 15 -15`);
  const component=doc.electrical.components[0],offset=flags&2?8:16;
  const minus=doc.electrical.wires.find(w=>w.from.pinId==='minus');
  const legacy=doc.layout.junctions[minus.to.junctionId];
  const visual=geometry.pin(doc,minus.from),pose=doc.layout.components[component.id];
  assert.ok((legacy.x)* (visual.x-pose.x)+(legacy.y)*(visual.y-pose.y)>0);
  assert.ok(Math.hypot(legacy.x,legacy.y)>0&&offset>0);
  const [,next]=geometry.route(doc,minus);
  const axis=x?'x':'y',across=x?'y':'x';
  assert.equal(next[across],visual[across]);
  assert.ok((next[axis]-visual[axis])*(visual[axis]-pose[axis])>0);
}
// The transistor posts are perpendicular to the original handle, including flips.
for(const [x,y] of [[64,0],[-64,0],[0,64],[0,-64]])for(const polarity of [1,-1])for(const flipped of [0,1]){
  const doc=parse(`t 0 0 ${x} ${y} ${flipped} ${polarity} 0 0 120 default`);
  const transistor=doc.electrical.components[0];
  assert.equal(transistor.kind,polarity===1?'npn':'pnp');
  const collector=doc.electrical.wires.find(w=>w.from.pinId==='collector');
  const across=x?'y':'x',side=(x?-1:1)*polarity*(flipped?-1:1);
  assert.equal(Math.sign(geometry.pin(doc,collector.from)[across]),side);
  assert.equal(Math.sign(geometry.pin(doc,collector.to)[across]),side);
}
// Falstad's FET post ordering survives rotations, source/drain flips, and body leads.
for(const [x,y] of [[64,0],[-64,0],[0,64],[0,-64]])for(const flags of [0,1,8,9,96,97,104,105]){
  const doc=parse(`f 0 0 ${x} ${y} ${flags}`);
  const fet=doc.electrical.components[0];
  assert.equal(fet.kind,flags&1?'pmos':'nmos');
  assert.equal(fet.parameters.threshold,1.5);
  assert.equal(fet.parameters.beta,.02);
  const sourceLead=doc.electrical.wires.find(w=>w.from.pinId==='source');
  const across=x?'y':'x',side=(x?1:-1)*(flags&8?-1:1);
  assert.equal(Math.sign(geometry.pin(doc,sourceLead.from)[across]),side);
  assert.equal(Math.sign(geometry.pin(doc,sourceLead.to)[across]),side);
  const bodyLead=doc.electrical.wires.find(w=>w.from.pinId==='body');
  assert.equal(Boolean(bodyLead),Boolean(flags&64));
  if(bodyLead)assert.equal(geometry.pin(doc,bodyLead.to)[across],0);
}
for(const flags of [0,1,2,4,16,32,96,100,112,224]){
  const doc=parse(`<cir><f x="0 0 64 0" f="${flags}"/></cir>`);
  const {parameters}=doc.electrical.components[0];
  assert.equal(parameters.bodyDiode,!!(flags&32));
  assert.equal(parameters.bodyTerminal,!!(flags&64));
  assert.equal(parameters.digitalSymbol,!!(flags&4));
  assert.equal(parameters.showBulk,!(flags&16));
  assert.equal(parameters.showBodyDiode,!!(flags&128));
  assert.equal(doc.electrical.wires.some(w=>w.from.pinId==='body'),!!(flags&64)&&!(flags&20));
}
const jfetDefaults=parse('<cir><j x="0 0 64 0" f="1"/></cir>').electrical.components[0];
assert.equal(jfetDefaults.kind,'pjfet');
assert.deepEqual(jfetDefaults.parameters,{threshold:-4,beta:.00125});

for(const [type,flags,drive] of [
  ['f',32,[4,0,2]], ['f',33,[-4,-2,0]],
  ['f',104,[4,0,2,0]], ['f',105,[-4,-2,0,0]],
  ['j',0,[.4,0,2]], ['j',1,[-.4,0,-2]],
]){
  const [threshold,beta]=type==='f'?[1.5,.02]:[-4,.00125];
  const side=flags&8?-16:16;
  const posts=[[0,0],[64,side],[64,-side],[64,0]];
  const rails=drive.map((v,i)=>`R ${posts[i].join(' ')} ${posts[i][0]-48} ${posts[i][1]} 0 0 40 ${v} 0 0 .5`);
  const records=[`${type} 0 0 64 0 ${flags} ${threshold} ${beta}`,...rails];
  const legacy=parse(['$ 1 .000005 10 50 5',...records,'o 0 64 0 3 5 .1'].join('\n'));
  const xml=parse(`<cir f="1">
    <${type} x="0 0 64 0" f="${flags}" vt="${threshold}" be="${beta}"/>
    ${drive.map((v,i)=>`<R x="${posts[i].join(' ')} ${posts[i][0]-48} ${posts[i][1]}" maxv="${v}"/>`).join('\n')}
    <o en="0" f="x3"><p v="0"/><p v="3"/></o>
  </cir>`);
  assert.equal(adapter.compile(legacy).canonical,adapter.compile(xml).canonical);
  const nativeFet=createEngine();nativeFet.load(records.join('\n'),5e-6);
  const expected=nativeFet.step(80).elements[0];
  const channels=core.geometry.scopeChannels(xml).channels;
  session.loadDocument(xml);
  const actual=session.step(80,core.signals.create().setChannels(channels));
  const pinVoltages=actual.pinVoltages[xml.electrical.components[0].id];
  for(const [i,pin] of ['gate','source','drain','body'].slice(0,drive.length).entries()){
    assert.ok(Math.abs(pinVoltages[pin]-expected.voltages[i])<1e-9);
  }
  const [voltage,current]=channels.map(channel=>actual.sampleBatch.values[channel.id].at(-1));
  assert.ok(Math.abs(voltage-(expected.voltages[2]-expected.voltages[1]))<1e-9);
  assert.ok(Math.abs(current-expected.current)<1e-9);
}
for(const [type,tag,kind] of [
  [150,'And','andGate'],[151,'Nand','nandGate'],[152,'Or','orGate'],
  [153,'Nor','norGate'],[154,'Xor','xorGate'],[431,'Xnor','xnorGate'],
]){
  const xml=parse(`<cir><${tag} x="0 0 96 0"/></cir>`);
  assert.equal(xml.electrical.components[0].kind,kind);
  assert.equal(adapter.compile(xml).canonical,adapter.compile(parse(`$ 0 .000005 10 50 5\n${type} 0 0 96 0 0 2 0`)).canonical);
}
for(const [x,y] of [[64,0],[-64,0],[0,64],[0,-64]])for(const flags of [0,1])for(const count of [2,3,4]){
  const doc=parse(`150 0 0 ${x} ${y} ${flags} ${count} 0`);
  const across=x?'y':'x',along=x?'x':'y';
  const inputLeads=doc.electrical.wires.filter(w=>w.from.pinId!=='out');
  const posts=inputLeads.map(lead=>geometry.pin(doc,lead.to)[across]);
  const pins=inputLeads.map(lead=>geometry.pin(doc,lead.from)[across]);
  assert.deepEqual(posts.map(n=>Math.sign(n)||0),pins.map(n=>Math.sign(n)||0));
  assert.equal(posts.includes(0),count%2===1);
  assert.equal(Math.sign(geometry.pin(doc,doc.electrical.wires.at(-1).to)[along]),Math.sign(x||y));
}
const wideGate=parse('150 0 0 512 0 1 8 0');
const wideGateInputs=wideGate.electrical.wires.filter(w=>w.from.pinId!=='out');
assert.equal(new Set(wideGateInputs.map(w=>geometry.pin(wideGate,w.to).y)).size,8);
const gateRecords=`150 0 0 64 0 6 3 3.3 3.3 .00002
R 0 16 -48 16 0 0 40 5 0 0 .5
R 0 0 -48 0 0 0 40 5 0 0 .5
R 0 -16 -48 -16 0 0 40 5 0 0 .5`;
const delayedGate=parse(`<cir f="1">
<And x="0 0 64 0" f="6" in="3" hi="3.3" o="3.3" pd=".00002"/>
<R x="0 16 -48 16"/><R x="0 0 -48 0"/><R x="0 -16 -48 -16"/>
</cir>`);
assert.equal(adapter.compile(delayedGate).canonical,adapter.compile(parse('$ 1 .000005 10 50 5\n'+gateRecords)).canonical);
const restoredGate=adapter.fromProjection(JSON.parse(adapter.compile(delayedGate).canonical),delayedGate.id);
assert.equal(JSON.parse(restoredGate.canonical).devices[0].parameters.initialOutputVoltage,3.3);
const nativeGate=createEngine();nativeGate.load(gateRecords,5e-6);
session.loadDocument(delayedGate);
for(const [count,expected] of [[1,3.3],[10,0]]){
  const frame=session.step(count);
  const nativeFrame=nativeGate.step(count);
  const voltage=frame.pinVoltages.c2.out;
  assert.equal(voltage,expected);
  assert.equal(voltage,nativeFrame.elements[0].voltages[3]);
}
for(const polarity of [1,-1]){
  const flag=polarity===1?0:1;
  const xml=parse(`<cir>
    <t x="0 0 64 0" f="${flag}" pn="${polarity}" be="120" mo="default"/>
    <r x="-96 0 0 0" r="100000"/>
    <R x="-96 0 -144 0" maxv="${3.3*polarity}"/>
    <r x="64 -80 64 -16" r="1000"/>
    <R x="64 -80 64 -128" maxv="${5*polarity}"/>
    <g x="64 16 64 48"/>
  </cir>`);
  const records=[
    `t 0 0 64 0 ${flag} ${polarity} 0 0 120`,
    'r -96 0 0 0 0 100000',
    `R -96 0 -144 0 0 0 40 ${3.3*polarity} 0 0 .5`,
    'r 64 -80 64 -16 0 1000',
    `R 64 -80 64 -128 0 0 40 ${5*polarity} 0 0 .5`,
    'g 64 16 64 48 0',
  ];
  assert.equal(adapter.compile(xml).canonical,adapter.compile(parse('$ 1 0.000005 10 50 5\n'+records.join('\n'))).canonical);
  const transistor=xml.electrical.components[0];
  // The headless legacy entry point accepts unflipped records. Reflect the PNP
  // fixture so its unflipped collector and emitter still meet the same nets.
  const nativeRecords=polarity===1?records:records.map(record=>{
    const fields=record.split(' ');
    fields[2]=-Number(fields[2]);fields[4]=-Number(fields[4]);
    if(fields[0]==='t')fields[5]=0;
    return fields.join(' ');
  });
  const engine=createEngine();engine.load(nativeRecords.join('\n'),5e-6);
  const expected=engine.step(100).elements[0].voltages;
  session.loadDocument(xml);const voltages=session.step(100).pinVoltages[transistor.id];
  for(const [i,pin] of ['base','collector','emitter'].entries())assert.ok(Math.abs(voltages[pin]-expected[i])<1e-9);
}
const caps=parse('c 0 0 96 0 2 .000001 4\nl 0 96 96 96 0 .1 3 .2 0');
assert.equal(caps.electrical.components[0].parameters.initialVoltage,.001);
assert.equal(caps.electrical.components[0].parameters.integration,'backwardEuler');
assert.equal(caps.electrical.components[1].parameters.initialCurrent,.2);
const diode=parse('d 0 0 96 0 1 .7').electrical.components[0];
assert.equal(diode.parameters.model.emissionCoefficient,2);
assert.ok(Math.abs(diode.parameters.model.saturationCurrent*Math.expm1(.7/(2*.025865))-1)<1e-12);
const cosine=parse('R 0 0 0 -32 2 1 50 5 0 0 .5');
assert.equal(cosine.electrical.components[0].parameters.waveform.phase,Math.PI/2);
const pulse=parse('v 0 0 96 0 0 5 50 5 0 0 .5');
assert.equal(pulse.electrical.components[0].parameters.waveform.dutyCycle,1/(2*Math.PI));
for(const text of ['','r 0 0 96 0 0 nope','r 0 0 96 0 0 -1','w 0 0 96 0 0','r 0 0 96 0 4 1000','r 0 0 96 0 4294967296 1000','d 0 0 96 0 2 Unknown','c 0 0 96 0 4 .001 0 0 10','l 0 0 96 0 0 .1 0 0 1','v 0 0 96 0 0 6 40 5','r 0 0 96 0 0 1000\n999 0 0 96 0 0','<cir>\n</cir>','$ 65 .00001 10 50 5\nr 0 0 96 0 0 1000']){
  const result=falstad.importText(text);assert.equal(result.document,null,text);assert.ok(result.diagnostics.some(d=>d.severity==='error'));
}
const warned=falstad.importText('r 0 0 96 0 0 1000\no 0 64 0 34 5 .1');
assert.ok(warned.document);assert.equal(warned.diagnostics[0].line,2);
const scopeWire=falstad.importText(`$ 1 .000005 10 50 5
v 0 96 0 0 0 0 40 5 0 0 .5
x 32 24 48 24 0 12 Measured lead
w 0 0 64 0 0
w 64 0 128 0 0
r 128 0 128 96 0 1000
w 128 96 0 96 0
o 3 64 0 2 5 .1 0 Lead
o 0 64 0 3 5 .1 0 Source
o 4 64 0 66 5 .1
o 99 64 0 2 5 .1
o 4 64 7 4098 5 .1 1 2 .025 4 0`);
assert.ok(scopeWire.document);
assert.deepEqual(scopeWire.diagnostics.map(d=>d.line),[10,11,12]);
const scopeEditor=core.editing.create(scopeWire.document,()=>{},{wireSections:true});
scopeEditor.replace(scopeWire.document);
const scopeDoc=scopeEditor.document;
const scopeChannels=core.geometry.scopeChannels(scopeDoc);
assert.deepEqual(scopeChannels.unresolved,[]);
assert.equal(scopeChannels.channels.length,4);
assert.equal(scopeDoc.layout.scopes.dock.axis,'horizontal');
assert.equal(scopeDoc.layout.scopes.dock.first.axis,'vertical');
const acquisition=core.signals.create();
const descriptors=acquisition.setChannels(scopeChannels.channels);
assert.ok(descriptors.some(channel=>channel.kind==='current'&&channel.polarity===-1));
session.loadDocument(scopeDoc);
const samples=session.step(10,descriptors).sampleBatch.values;
const [wireV,sourceV,sourceI,resistorV]=scopeChannels.channels;
assert.equal(samples[wireV.id].at(-1),5);
assert.equal(samples[sourceV.id].at(-1),5);
assert.equal(samples[resistorV.id].at(-1),5);
const nativeSource=createEngine();
nativeSource.load('v 0 96 0 0 0 0 40 5 0 0 .5\nr 0 0 0 96 0 1000\ng 0 96 0 128 0',5e-6);
assert.equal(samples[sourceI.id].at(-1),nativeSource.step(10).elements[0].current);
// Real upstream inverting amplifier: compare actual engine results to imported graph, rather
// than asserting only on a synthetic document or the importer's own output.
const directory=new URL('../engine/upstream/src/com/lushprojects/circuitjs1/public/circuits/',import.meta.url);
const bundledCircuit=name=>parse(readFileSync(new URL(name,directory),'utf8'));
const timerFiles=['555square','555saw','555lowduty','555monostable','555pulsemod','555sequencer','555schmitt','555missing','555dutycycle'];
for(const name of timerFiles){
  const circuit=bundledCircuit(name+'.txt');
  assert.ok(circuit.electrical.components.some(c=>c.kind==='timer555'),name);
  session.loadDocument(circuit);
  assert.ok(session.step(100).time>0,name);
  const {channels,unresolved}=geometry.scopeChannels(circuit);
  assert.ok(channels.length,name);
  assert.deepEqual(unresolved,[],name);
}
const square555=bundledCircuit('555square.txt');
const squareTimer=square555.electrical.components.find(c=>c.kind==='timer555');
session.loadDocument(square555);
const squareRises=[],squareFalls=[];
let squareHigh=false;
for(let n=0;n<360;n++){
  const f=session.step(10),high=f.pinVoltages[squareTimer.id].out>5;
  if(high!==squareHigh)(high?squareRises:squareFalls).push(f.time);
  squareHigh=high;
}
assert.ok(Math.abs(squareRises[2]-squareRises[1]-.00418)<.00006,'555 oscillator period');
assert.ok(Math.abs((squareFalls[2]-squareRises[2])/(squareRises[3]-squareRises[2])-.5)<.02,'555 oscillator duty cycle');

const mono555=bundledCircuit('555monostable.txt');
const monoTimer=mono555.electrical.components.find(c=>c.kind==='timer555');
const trigger555=mono555.electrical.components.find(c=>c.kind==='logicInput');
session.loadDocument(mono555);
assert.ok(session.step(100).pinVoltages[monoTimer.id].out<.1);
session.setContact(trigger555.id,'state',0);
const triggered=session.step(10);
assert.ok(triggered.pinVoltages[monoTimer.id].out>4.9);
session.setContact(trigger555.id,'state',1);
frame=session.step(10);
while(frame.pinVoltages[monoTimer.id].out>2&&frame.time<.015)frame=session.step(10);
assert.ok(Math.abs(frame.time-triggered.time-.01099)<.0002,'555 monostable pulse width');
assert.ok(frame.pinVoltages[monoTimer.id].out<.1);

const switchedReset=parse(readFileSync(new URL('555monostable.txt',directory),'utf8')
  .replace('w 336 112 336 176 0','L 336 176 384 176 0 1 false 5 0'));
const reset555=switchedReset.electrical.components.filter(c=>c.kind==='logicInput').at(-1);
session.loadDocument(switchedReset);
session.step(100);
session.setContact(trigger555.id,'state',0);
assert.ok(session.step(10).pinVoltages[monoTimer.id].out>4.9);
session.setContact(trigger555.id,'state',1);
session.setContact(reset555.id,'state',0);
assert.ok(session.step(10).pinVoltages[monoTimer.id].out<.1,'Active-low reset overrides the latched pulse');

const timerXml=parse('<cir><Timer x="64 96 128 96" f="6157" v5="4.75"/></cir>');
const timerText=parse('$ 0 .000005 10 50 5\n165 64 96 128 96 6157 4.75');
assert.equal(adapter.compile(timerXml).canonical,adapter.compile(timerText).canonical);
const xmlTimer=timerXml.electrical.components[0];
assert.deepEqual(xmlTimer.parameters,{resetPin:true,groundPin:true,pinNumbers:true,initialOutputVoltage:4.75});
assert.equal(timerXml.layout.components[xmlTimer.id].rotation,270);
assert.equal(Object.keys(core.catalog.componentPins(parse('<cir><Timer x="64 96 128 96"/></cir>').electrical.components[0])).length,6);
assert.equal(Object.keys(core.catalog.componentPins(parse('165 64 96 128 96 2 0').electrical.components[0])).length,7);

const placed555=core.editing.create(core.editing.empty());
placed555.addComponent('timer555',0,0);
const placedTimer=placed555.document.electrical.components[0];
assert.equal(Object.keys(core.catalog.componentPins(placedTimer)).length,8);
const editor555=core.editing.create(mono555,()=>{},{wireSections:true});
editor555.execute({type:'setParameters',componentId:monoTimer.id,parameters:{groundPin:false}});
const edited555=editor555.document;
core.document.validate(edited555);
session.loadDocument(mono555);
session.step(100);
session.setContact(trigger555.id,'state',0);
session.step(10);
session.setContact(trigger555.id,'state',1);
const editedProjection=JSON.parse(adapter.compile(edited555).canonical);
session.updateProjection(editedProjection,edited555.id);
assert.ok(session.step(10).pinVoltages[monoTimer.id].out>4.9,'Removing explicit ground preserves the running timer output');
assert.equal(session.reset().time,0);
assert.ok(session.step(10).pinVoltages[monoTimer.id].out<.1);
const seeded555=parse(readFileSync(new URL('555monostable.txt',directory),'utf8')
  .replace('165 208 144 320 144 4 0','165 208 144 320 144 0 5'));
session.loadDocument(seeded555);
assert.ok(session.step(10).pinVoltages[monoTimer.id].out>4.9,'The timer starts in its saved high output state');

const relayFiles=['relay','relayand','relayor','relayxor','relaymux','relayff','relaytff','relayosc','relayctr'];
for(const name of relayFiles){
  const circuit=bundledCircuit(name+'.txt');
  session.loadDocument(circuit);
  const readings=session.step(100).componentMeasurements;
  for(const relay of circuit.electrical.components.filter(c=>c.kind==='relay')){
    assert.ok(Number.isFinite(readings[relay.id].coilCurrent),name);
    assert.equal(Object.keys(core.catalog.componentPins(relay)).length,3*relay.parameters.poleCount+2,name);
  }
  assert.deepEqual(geometry.scopeChannels(circuit).unresolved,[],name);
}

const relayOsc=bundledCircuit('relayosc.txt');
const oscillator=relayOsc.electrical.components.find(c=>c.kind==='relay');
session.loadDocument(relayOsc);
const onEdges=[];
let previousPosition=oscillator.parameters.initialPosition,intermediateStart;
for(let i=0;i<530;i++){
  const f=session.step(100), {position,coilCurrent}=f.componentMeasurements[oscillator.id];
  if(position===previousPosition)continue;
  if(position===2)intermediateStart=f.time;
  if(position===1){
    assert.ok(Math.abs(f.time-intermediateStart-.005)<.00051,'Relay waits for its travel time');
    assert.ok(Math.abs(coilCurrent)>=oscillator.parameters.onCurrent,'Pickup current reached');
    onEdges.push(f.time);
  }
  previousPosition=position;
}
assert.equal(onEdges.length,3);
assert.ok(Math.abs(onEdges[2]-onEdges[1]-.083)<.001,'Relay oscillator period');

const relayFlipFlop=bundledCircuit('relayff.txt');
const flipRelays=relayFlipFlop.electrical.components.filter(c=>c.kind==='relay');
const flipPushButtons=relayFlipFlop.electrical.components.filter(c=>c.kind==='pushSwitch');
const relayPositions=f=>flipRelays.map(c=>f.componentMeasurements[c.id].position);
session.loadDocument(relayFlipFlop);
assert.deepEqual(relayPositions(session.step(300)),[0,1]);
session.setContact(flipPushButtons[1].id,'normallyClosed',true);
session.step(75);
session.setContact(flipPushButtons[1].id,'normallyClosed',false);
assert.deepEqual(relayPositions(session.step(1000)),[1,0],'The relay flip-flop latches after the push button is released');

const relayEditor=core.editing.create(relayFlipFlop);
relayEditor.execute({type:'setParameters',componentId:flipRelays[0].id,parameters:{poleCount:2}});
const relayEdited=relayEditor.document;
const relayEditedCompiled=adapter.compile(relayEdited);
session.updateProjection(JSON.parse(relayEditedCompiled.canonical),relayEdited.id);
frame=session.step(20);
assert.deepEqual(relayPositions(frame),[1,0],'Pole edits retain relay position');
assert.ok(Math.abs(frame.componentMeasurements[flipRelays[0].id].coilCurrent)>.24,'Pole edits retain energized coil current');

const xmlRelay=parse(`<cir>
  <rlm nm="custom coil" in=".1" ron=".08" rof="200000" on=".025" of=".016" coR="50" sw=".008" cs="2" po="4" sb="0" pd="1"/>
  <rl x="176 96 176 240" mo="custom coil" f="8" i="-.018" ip="2"/>
</cir>`);
const equivalentRelay=parse('$ 0 .000005 10 50 5\n178 176 96 176 240 25 4 .1 -.018 .08 200000 .025 50 .016 .008 2');
assert.equal(adapter.compile(xmlRelay).canonical,adapter.compile(equivalentRelay).canonical);
const xmlRelayComponent=xmlRelay.electrical.components[0];
assert.equal(xmlRelayComponent.parameters.coilStyle,2);
assert.equal(xmlRelayComponent.parameters.showBox,false);
assert.deepEqual(xmlRelay.layout.components[xmlRelayComponent.id],{x:550,y:550,rotation:270,mirror:true});
assert.equal(parse('<cir><rl x="0 0 96 0" mo="default-3-poles"/></cir>').electrical.components[0].parameters.poleCount,3);
assert.ok(falstad.importText('<cir><rl x="0 0 96 0" mo="missing"/></cir>').diagnostics.some(d=>d.message.includes('Unknown relay model')));
const shortRelay=parse('178 0 0 96 0 0 1 .2 0 .05 1000000 .02 20').electrical.components[0];
assert.equal(shortRelay.parameters.switchingTime,0);
assert.equal(shortRelay.parameters.offCurrent,shortRelay.parameters.onCurrent);
const placedRelay=core.editing.create(core.editing.empty());
placedRelay.addComponent('relay',0,0);
assert.equal(placedRelay.document.electrical.components[0].parameters.poleCount,1);

const scrCircuit=bundledCircuit('scr.txt');
session.loadDocument(JSON.parse(JSON.stringify(scrCircuit)));
session.setSwitch('c4',true);
assert.ok(Math.abs(session.step(10).componentCurrents.c2)<1e-5);
session.setSwitch('c5',true);
assert.ok(Math.abs(session.step(20).componentCurrents.c2)>.03);
session.setSwitch('c5',false);
assert.ok(Math.abs(session.step(20).componentCurrents.c2)>.03);
session.setSwitch('c4',false);
assert.ok(Math.abs(session.step(20).componentCurrents.c2)<1e-6);

const dimmer=bundledCircuit('triacdimmer.txt');
const dimmerProjection=JSON.parse(adapter.compile(dimmer).canonical);
const triac=dimmerProjection.devices.find(device=>device.kind==='triac');
const diac=dimmerProjection.devices.find(device=>device.kind==='diac');
assert.equal(triac.pins.gate,diac.pins.b);
assert.ok(dimmerProjection.nets.find(net=>net.key===triac.pins.mt1)?.ground);
session.loadDocument(dimmer);
const positiveHalfCycle=session.step(1000);
assert.ok(positiveHalfCycle.componentCurrents.c10>1);
assert.ok(Math.abs(positiveHalfCycle.pinVoltages[triac.id].mt2)<1);
session.step(1000);
const negativeHalfCycle=session.step(1000);
assert.ok(negativeHalfCycle.componentCurrents.c10<-.5);
assert.ok(Math.abs(negativeHalfCycle.pinVoltages[triac.id].mt2)<1);

const savedTriacState=falstad.importText('<cir><Triac x="0 0 96 16" st="true"/></cir>');
assert.ok(savedTriacState.document);
assert.ok(savedTriacState.diagnostics.some(diagnostic=>diagnostic.code==='RESET_STATE'));
const invalidTriacState=falstad.importText('<cir>\n<Triac x="0 0 96 16" st="invalid"/>\n</cir>');
assert.equal(invalidTriacState.document,null);
assert.ok(invalidTriacState.diagnostics.some(diagnostic=>diagnostic.line===2&&/Invalid TRIAC state/.test(diagnostic.message)));
for(const [x,y] of [[128,0],[-128,0],[0,128],[0,-128]]){
  const line=parse(`171 0 0 ${x} ${y} 0 .001 75 48 0`);
  const across=x?'y':'x';
  for(const [signal,returnPin] of [['left','leftReturn'],['right','rightReturn']]){
    const terminal=pinId=>line.electrical.wires.find(w=>w.from.pinId===pinId);
    const a=terminal(signal),b=terminal(returnPin);
    assert.equal(geometry.pin(line,a.to)[across],0);
    assert.ok(geometry.pin(line,b.to)[across]>0);
    assert.ok(geometry.pin(line,b.from)[across]>geometry.pin(line,a.from)[across]);
  }
}
const bundledLine=parse(readFileSync(new URL('tl.txt',directory),'utf8'));
const xmlLine=parse(`<cir f="1" ts="5e-12">
  <tl x="176 240 496 240" de="3e-8" im="75" wi="80"/>
  <w x="176 240 128 240"/><w x="128 320 176 320"/>
  <w x="496 240 544 240"/><w x="496 320 544 320"/>
  <r x="544 240 544 320" r="75"/>
  <v x="128 320 128 240" wf="1" fr="40000000" maxv="5"/>
</cir>`);
assert.equal(adapter.compile(xmlLine).canonical,adapter.compile(bundledLine).canonical);
const nativeLine=createEngine();
nativeLine.load(`171 0 32 64 32 0 3e-8 75 32 0
r 64 32 64 64 0 75
v 0 64 0 32 0 1 40000000 5 0 0 .5`,5e-12);
session.loadDocument(xmlLine);
const beforeArrival=6000;
const elapsed=1200;
for(const steps of [beforeArrival,elapsed]){
  const actual=session.step(steps).pinVoltages.c2;
  const expected=nativeLine.step(steps).elements[0].voltages;
  assert.ok(Math.abs(actual.right-expected[3])<1e-8);
  if(steps===beforeArrival)assert.ok(Math.abs(actual.right)<1e-8);
  else assert.ok(Math.abs(actual.right)>1);
}

const highPass=parse(readFileSync(new URL('filt-hipass.txt',directory),'utf8'));
const sweep=highPass.electrical.components.find(c=>c.kind==='sweepSource');
assert.deepEqual(sweep.parameters,{minFrequency:20,maxFrequency:1000,amplitude:5,sweepTime:.1,logarithmic:true,bidirectional:true});
const highPassChannels=core.geometry.scopeChannels(highPass).channels;
const scopeSampler=core.signals.create();
const highPassTraces=scopeSampler.setChannels(highPassChannels);
assert.deepEqual(highPassChannels.map(c=>c.label),['in · A/C sweep voltage','out · Output marker voltage']);
const nativeHighPass=createEngine();
nativeHighPass.load(`c 240 160 400 160 0 .00001 .001 .001
r 400 160 400 288 0 35
g 400 288 400 320 0
170 240 32 240 64 3 20 1000 5 .1
w 240 32 240 160 0`,5e-6);
session.loadDocument(highPass);
const highPassFrame=session.step(1200,highPassTraces);
const highPassReference=nativeHighPass.step(1200);
for(const [i,nativeIndex] of [3,1].entries()){
  const samples=highPassFrame.sampleBatch.values[highPassChannels[i].id];
  assert.ok(Math.abs(samples.at(-1)-highPassReference.elements[nativeIndex].voltages[0])<1e-9);
}
assert.ok(highPassFrame.componentMeasurements[sweep.id].frequency>20);

const signalText=`$ 1 .000005 10 50 5
170 0 0 0 -48 3 50 4000 3 .2
200 96 0 96 -48 0 1000 40 3
201 192 0 192 -48 0 800 40 3 200
A 288 0 288 -48 0
n 384 0 384 -48 0 1 40 2 .25 0 .5
211 384 0 432 0 0 .01 8000 1`;
const signalXml=`<cir f="1" ts="0.000005">
<sw x="0 0 0 -48" f="3" mi="50" ma="4000" mv="3" sw=".2"/>
<AM x="96 0 96 -48" mv="3"/>
<FM x="192 0 192 -48" mv="3"/>
<A x="288 0 288 -48" wf="1"/>
<R x="384 0 384 -48" wf="6" maxv="2" bias=".25"/>
<aout x="384 0 432 0" du=".01"/>
</cir>`;
const signals=parse(signalXml);
assert.equal(adapter.compile(signals).canonical,adapter.compile(parse(signalText)).canonical);
session.loadDocument(signals);
const noiseTrace={id:'noise',positive:{componentId:'c6',pinId:'p'},negative:null};
const measuredNoise=session.step(200,[noiseTrace]).sampleBatch.values.noise;
assert.ok(measuredNoise.every(value=>value>=-1.75&&value<=2.25));
const recorded=session.readCapture('c7').values;
assert.ok(recorded.length>0&&recorded.every(Number.isFinite));
assert.equal(falstad.importText('<cir><sw x="0 0 0 48" mi="4000" ma="50"/></cir>').document,null);

const meterText=`$ 1 .000005 10 50 5
R 0 0 0 -48 0 0 40 0 0 0 .5
I 0 0 96 0 0
p 96 0 96 96 2 0 2 10000
g 96 96 96 128 0
o 2 64 0 3 5 .1
o 1 64 0 2 5 .1`;
const meters=parse(`<cir f="1">
<R x="0 0 0 -48" maxv="0"/>
<I x="0 0 96 0"/>
<p x="96 0 96 96" f="2" me="0" sc="2" re="10000"/>
<g x="96 96 96 128"/>
<o en="2" f="x3"><p v="0"/></o>
<o en="1" f="x2" p="1"><p v="0"/></o>
</cir>`);
assert.equal(adapter.compile(meters).canonical,adapter.compile(parse(meterText)).canonical);
assert.deepEqual(meters.electrical.components.find(c=>c.kind==='voltmeter').parameters,{mode:0,scale:2,resistance:10000,showVoltage:false,circleSymbol:true});
const visibleReading=structuredClone(meters);
visibleReading.electrical.components.find(c=>c.kind==='voltmeter').parameters.showVoltage=true;
assert.equal(adapter.compile(meters).canonical,adapter.compile(visibleReading).canonical);
const meterChannels=core.geometry.scopeChannels(meters).channels;
assert.equal(meterChannels.length,2);
session.loadDocument(meters);
const meterSamples=session.step(10,scopeSampler.setChannels(meterChannels)).sampleBatch.values;
assert.equal(meterSamples[meterChannels[0].id].at(-1),5);
assert.equal(meterSamples[meterChannels[1].id].at(-1),0);

const amplifier=readFileSync(new URL('amp-invert.txt',directory),'utf8');
const imported=parse(amplifier);session.loadDocument(imported);frame=session.step(100);
const native=createEngine();
const electrical=amplifier.split(/\r?\n/).filter(line=>line&&!['$','o','h','&'].includes(line.split(' ')[0])).map(line=>{
  // The headless host requires explicit constructor defaults and the gain flag.
  if(line.startsWith('a '))return line.replace(/ 0$/, ' 8 15 -15 1000000 0 0 100000');
  if(line.startsWith('v '))return line+' 0 .5';
  return line;
});
native.load(electrical.join('\n'),5e-6);const expected=native.step(100);
const opamp=imported.electrical.components.find(c=>c.kind==='opamp');
const raw=expected.elements[electrical.findIndex(line=>line.startsWith('a '))];
for(const [i,pin] of ['minus','plus','out'].entries())assert.ok(Math.abs(frame.pinVoltages[opamp.id][pin]-raw.voltages[i])<1e-9);
// Audit all upstream examples: accepted documents must survive editor grid prep.
let accepted=0,compilable=0;
for(const name of readdirSync(directory).filter(name=>name.endsWith('.txt'))){
  const result=falstad.importText(readFileSync(new URL(name,directory),'utf8'));
  if(!result.document)continue;accepted++;
  const snapped=core.geometry.alignGrid(structuredClone(result.document));
  for(const [id,p] of Object.entries(result.document.layout.components))assert.deepEqual(snapped.layout.components[id],p,`${name}: grid changed component ${id}`);
  for(const [id,p] of Object.entries(result.document.layout.junctions))assert.deepEqual(snapped.layout.junctions[id],p,`${name}: grid changed junction ${id}`);
  if(!result.document.electrical.components.length)continue;
  try{
    const before=adapter.compile(result.document).canonical;
    const editor=core.editing.create(result.document,()=>{},{wireSections:true});
    editor.replace(result.document);
    assert.equal(adapter.compile(editor.document).canonical,before,`${name}: opening changed topology`);
    compilable++;
  }catch(error){assert.match(error.message,/Unsupported ideal (capacitor\/source|voltage-source|closed-switch) loop/);}
}
assert.ok(accepted>=50&&compilable>=47);
console.log(`Falstad import: polarity, topology, grid, diagnostics and native amplifier measurements passed; ${accepted} upstream documents converted, ${compilable} compile.`);
// Current Falstad exports XML even for circuits whose bundled copy is legacy text.
const xmlDivider=`<?xml version="1.0"?>
<cir f="1" ts="0.000005">
  <!-- original coordinates, same topology as the legacy divider -->
  <v x="0 96 0 0" f="0" wf="0" maxv="5"/>
  <r x="0 0 96 0" f="0" r="1000"/>
  <r x="96 0 96 96" f="0" r="1000"/>
  <w x="96 96 0 96" f="0"/>
</cir>`;
const xmlDoc=parse(xmlDivider);
assert.equal(adapter.compile(xmlDoc).canonical,compiled.canonical);
session.loadDocument(xmlDoc);assert.ok(Math.abs(session.step(10).pinVoltages.c4.a-2.5)<1e-10);
const xmlAmplifier=parse(`<cir>
<R x="0 16 0 0" wf="0" maxv="1"/>
<a x="96 0 224 0" f="1" ga="100000" ma="15" mi="-15"/>
<w x="0 16 96 -16"/>
<w x="96 16 96 64"/>
<w x="96 64 224 64"/>
<w x="224 64 224 0"/>
</cir>`);
session.loadDocument(xmlAmplifier);assert.ok(Math.abs(session.step(10).pinVoltages.c3.out-100000/100001)<1e-9);
const followerExport=`<cir f="1" ts="0.000005" ic="11.086722712598126" cb="50" pb="50" vr="5" mts="5e-11">
  <a x="192 176 320 176" f="0" ma="15" mi="-15" ga="100000" vd="0.0000329996700032531"/>
  <VarRail x="192 192 144 192" f="0" wf="7" fr="3.3" maxv="5" st="+ Voltage"/>
  <O x="320 176 368 176" f="1" sc="0"/>
  <w x="320 176 320 112" f="0"/>
  <w x="192 112 192 160" f="0"/>
  <w x="192 112 320 112" f="0"/>
</cir>`;
const followerResult=falstad.importText(followerExport);
assert.ok(followerResult.document,JSON.stringify(followerResult.diagnostics));
assert.deepEqual(followerResult.diagnostics.map(({severity,line,code})=>({severity,line,code})),[
  {severity:'warning',line:2,code:'RESET_STATE'},
]);
session.loadDocument(followerResult.document);
assert.ok(Math.abs(session.step(10).pinVoltages.c2.out-3.3*100000/100001)<1e-9);
const xmlDefaults=parse(`<cir><r x='0 0 96 0'/><c x='0 96 96 96'/><l x='0 192 96 192'/><a x='0 288 128 288' f='4'/></cir>`);
assert.equal(xmlDefaults.electrical.components[0].parameters.resistance,100);
assert.equal(xmlDefaults.electrical.components[1].parameters.initialVoltage,.001);
assert.equal(xmlDefaults.electrical.components[2].parameters.inductance,1);
assert.equal(xmlDefaults.electrical.components[3].parameters.gain,100000,'XML gain is independent of legacy LOWGAIN flag');
const xmlPhase=parse(`<cir><R x='0 0 0 96' wf='1' f='2' phaseShift='0.25'/></cir>`);
assert.equal(xmlPhase.electrical.components[0].parameters.waveform.phase,.25);
const xmlPulse=parse(`<cir><R x='0 0 0 96' wf='5'/></cir>`);
assert.equal(xmlPulse.electrical.components[0].parameters.waveform.dutyCycle,.5,'XML pulse default differs from old text');
const xmlWarnings=falstad.importText(`<cir>\n<r x='0 0 96 0'/>\n<o en='99'><p v='0' sc='5'/></o>\n</cir>`);
assert.ok(xmlWarnings.document);assert.equal(xmlWarnings.diagnostics[0].line,3);
const manualScope=parse(`<cir>
  <r x="0 0 96 0"/>
  <o en="0" sp="64" f="x12" md="10" x="Test &amp; measure" triggerMode="2" triggerEdge="1" triggerLevel="1.5">
    <p v="0" f="1" sc="5" ms="0.5" mp="20"/>
  </o>
</cir>`);
const [manualTrace]=manualScope.probes;
assert.equal(manualTrace.label,'Test & measure · Resistor voltage');
assert.equal(manualTrace.coupling,'ac');
assert.equal(manualTrace.scale,.5);
assert.ok(Math.abs(manualTrace.offset-1.01)<1e-12);
assert.deepEqual(Object.values(manualScope.layout.scopes.panes)[0].trigger,{mode:'auto',edge:'falling',level:1.5,source:manualTrace.id});
const sheetScopeXml=`<cir>
  <R x="0 0 0 -16" maxv="5"/>
  <Scope x="-16 144 -128 64" f="0">
    <o en="2" sp="16" f="x2" p="-1">
      <p v="0" sc="5"/>
      <p v="3" sc="0.1"/>
    </o>
  </Scope>
  <r x="0 0 96 0" r="1000"/>
  <g x="96 0 96 16"/>
</cir>`;
const sheetScopeDoc=parse(sheetScopeXml);
const {open,dock,panes,assignments}=sheetScopeDoc.layout.scopes;
const [sheetPaneId]=Object.keys(panes);
const {mode,x,y,width,height,sheetScale}=panes[sheetPaneId];
assert.deepEqual({mode,x,y,width,height,sheetScale},{mode:'sheet',x:-400,y:200,width:350,height:250,sheetScale:.32});
assert.equal(open,false);
assert.equal(dock,null);
assert.equal(sheetScopeDoc.probes.length,1);
const [sheetTrace]=sheetScopeDoc.probes;
assert.ok(sheetScopeDoc.electrical.components.some(c=>c.id===sheetTrace.positive.componentId&&c.kind==='resistor'));
assert.equal(assignments[sheetTrace.id],sheetPaneId);
const sheetEditor=core.editing.create(sheetScopeDoc,()=>{},{wireSections:true});
sheetEditor.replace(sheetScopeDoc);
const sheetChannels=geometry.scopeChannels(sheetEditor.document);
assert.deepEqual(sheetChannels.unresolved,[]);
session.loadDocument(sheetEditor.document);
const sheetSamples=session.step(10,scopeSampler.setChannels(sheetChannels.channels)).sampleBatch.values;
assert.equal(sheetSamples[sheetTrace.id].at(-1),5);

const mixedScopes=parse(sheetScopeXml.replace('</cir>','<o en="2"><p v="0"/></o></cir>')).layout.scopes;
assert.equal(mixedScopes.open,true);
assert.equal(mixedScopes.dock.type,'scope');
assert.equal(mixedScopes.panes[mixedScopes.dock.id].mode,'docked');
assert.equal(mixedScopes.panes[sheetPaneId].mode,'sheet');
const badSheetScope=falstad.importText(sheetScopeXml.replace('-16 144','-128 144'));
assert.ok(badSheetScope.document);
assert.deepEqual(badSheetScope.diagnostics.map(({line,code})=>({line,code})),[{line:3,code:'UNSUPPORTED_SCOPE'}]);

const legacySheetScope=parse(`$ 1 .000005 10 50 5
R 0 0 0 -16 0 0 40 5 0 0 0.5
403 -16 144 -128 64 0 2_16_0_2_5_0.1_-1
r 0 0 96 0 0 1000
g 96 0 96 16 0`);
assert.deepEqual(Object.values(legacySheetScope.layout.scopes.panes),Object.values(panes));
assert.equal(legacySheetScope.probes[0].positive.componentId,'c4');
for(const text of [
  '<cir><r x="0 0 96 0"></cir>', '<cir><r x="0 0 96 0"/></cir><cir/>',
  '<!DOCTYPE cir SYSTEM "file:///etc/passwd"><cir/>', '<cir><r x="0 0 96 0" r="1" r="2"/></cir>',
  '<cir><r x="0 0 96 0" r="&unknown;"/></cir>', '<cir><r x="0 0 96 0" mystery="1"/></cir>',
  '<cir><VCVS x="0 0 96 0" ex="a &gt; b"/></cir>', '<cir><v x="0 0 96 0" riseTime="1"/></cir>',
  '<cir><r x="0 0 96 0" f="4294967296"/></cir>', '<cir><r x="0 0 96 0" r="NaN"/></cir>',
  '<cir><a x="0 0 128 0" vd="NaN"/></cir>',
]) {
  const result=falstad.importText(text);assert.equal(result.document,null,text);
  assert.ok(result.diagnostics.some(d=>d.severity==='error'&&d.code!=='UNSUPPORTED_XML'));
}
const xmlBad=falstad.importText('<cir>\n<r x="0 0 96 0" r="-1"/>\n</cir>');
assert.equal(xmlBad.document,null);
console.log('XML import passed: legacy equivalence, real divider/amplifier readings, XML-specific defaults, diagnostics, entities and malformed input.');
// User's actual current Ohm's Law export: WF_VAR is 7 in upstream VoltageElm.
// Older bundled 172 records use 6; XML must use current constructor semantics.
const currentOhms=`<cir f="1" ts="0.000005" ic="10.20027730826997" cb="50" pb="50" vr="5" mts="5e-11">
  <r x="256 176 256 304" f="0" r="100"/>
  <VarRail x="304 176 304 128" f="0" wf="7" fr="5" maxv="5" st="Voltage"/>
  <g x="256 336 256 352" f="0"/>
  <w x="256 304 256 336" f="1"/>
  <r x="352 176 352 304" f="0" r="1000"/>
  <w x="352 304 352 336" f="1"/>
  <g x="352 336 352 352" f="0"/>
  <w x="304 176 352 176" f="0"/>
  <w x="256 176 304 176" f="0"/>
</cir>`;
const ohms=parse(currentOhms);session.loadDocument(ohms);const ohmsFrame=session.step(100);
for(const [id,expected] of [['c2',.05],['c6',.005]])assert.ok(Math.abs(ohmsFrame.componentCurrents[id]-expected)<1e-12);
assert.ok(falstad.importText('<cir><VarRail x="0 0 0 96"/></cir>').document,'Omitted XML waveform defaults to WF_VAR=7');
assert.equal(falstad.importText('<cir><VarRail x="0 0 0 96" wf="6"/></cir>').document,null,'XML noise waveform must not be treated as variable voltage');
console.log('Actual Ohm’s Law XML export passed: WF_VAR=7, 50 mA and 5 mA.');
