import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adapter, catalog, editing, falstad, geometry } from '../packages/circuit-core/index.mjs';
import { createEngine } from './engine_node_runtime.mjs';

const kinds = [
  'relayCoil', 'relayContact', 'timeDelayRelay', 'motorProtectionSwitch',
  'npnDarlington', 'pnpDarlington', 'unijunction', 'opampReal', 'comparator', 'ota', 'optocoupler',
  'customLogic', 'sram', 'rom', 'busTransceiver',
];
const session = adapter.createSession(createEngine());
const near = (actual, wanted, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - wanted) < tolerance, `${actual} != ${wanted}`);

function fixture(dt = 5e-6) {
  const document = editing.empty();
  document.simulation.timeStep = dt;
  function add(id, kind, parameters = {}) {
    const component = {id, kind, modelVersion: 1, parameters: {...catalog.definitions[kind].parameters, ...parameters}};
    document.electrical.components.push(component);
    document.layout.components[id] = {x: 1000 * document.electrical.components.length, y: 0, rotation: 0, mirror: false};
    return component;
  }
  function wire(from, fromPin, to, toPin) {
    const id = `w${document.electrical.wires.length + 1}`;
    document.electrical.wires.push({id, from: {kind:'pin', componentId:from, pinId:fromPin}, to: {kind:'pin', componentId:to, pinId:toPin}});
    document.layout.wires[id] = {bends: []};
  }
  const ground = (id,pin) => wire(id,pin,'g','g');
  function rail(id,voltage,target,pin) {
    const part = add(id,'voltageRail',{waveform:{kind:'dc',voltage}});
    wire(id,'p',target,pin);
    return part;
  }
  function resistor(id,resistance,from,fromPin,to,toPin) {
    add(id,'resistor',{resistance});
    wire(from,fromPin,id,'a');
    wire(id,'b',to,toPin);
  }
  add('g','ground');
  return {document, add, wire, ground, rail, resistor};
}

for (const kind of kinds) {
  const editor = editing.create(editing.empty());
  const id = editor.addComponent(kind,0,0);
  editing.validate(JSON.parse(JSON.stringify(editor.document)));
  session.loadDocument(editor.document);
  assert.ok(Object.values(session.step(10).pinVoltages[id]).every(Number.isFinite), kind);
}

const routeEditor = editing.create(editing.empty());
routeEditor.addComponent('resistor',0,0);
const start = {x:-250,y:0}, end = {x:250,y:0};
const routed = geometry.routedWireLeg(routeEditor.document,start,end);
assert.ok(routed.length > 1);
assert.deepEqual(routed.at(-1),end);
assert.ok(routed.some(point=>point.y!==0));
const legs = [start,...routed];
for (let i=1;i<legs.length;i++)
  assert.ok(legs[i].x===legs[i-1].x||legs[i].y===legs[i-1].y,'routed wire stays orthogonal');

for (const mode of [0,1,2,3]) {
  const {document,add,ground,rail,resistor} = fixture(1e-5);
  add('coil','relayCoil',{mode,label:'K 1'});
  const source = rail('drive',5,'coil','a');
  ground('coil','b');
  add('no','relayContact',{label:'K 1'});
  const nc = add('nc','relayContact',{label:'K 1',normallyClosed:true,initialPosition:0});
  for (const id of ['no','nc']) {
    rail(`r${id}`,5,id,'a');
    resistor(`rload${id}`,1000,id,'b','g','g');
  }
  session.loadDocument(document);
  assert.equal(session.step(2).componentMeasurements.no.closed,false);
  const picked = session.step(1500);
  assert.equal(picked.componentMeasurements.coil.energized,true);
  assert.equal(picked.componentMeasurements.no.closed,true);
  assert.equal(picked.componentMeasurements.nc.closed,false);
  near(picked.pinVoltages.no.b,5*1000/1000.05);

  // Renaming and reconnecting a contact leaves the coil's current and state intact.
  nc.parameters.label='unlinked';
  session.updateProjection(JSON.parse(adapter.compile(document).canonical),document.id);
  assert.equal(session.step(1).componentMeasurements.nc.closed,true);
  nc.parameters.label='K 1';
  source.parameters.waveform.voltage=0;
  session.updateProjection(JSON.parse(adapter.compile(document).canonical),document.id);
  const released=session.step(7000);
  assert.equal(released.componentMeasurements.no.closed,mode===3);
  if(mode===3) {
    source.parameters.waveform.voltage=5;
    session.updateProjection(JSON.parse(adapter.compile(document).canonical),document.id);
    assert.equal(session.step(1500).componentMeasurements.no.closed,false);
  }
}

{
  const {document,add,ground,rail,resistor} = fixture();
  add('timer','timeDelayRelay',{onDelay:.001,offDelay:.002});
  const power=rail('power',5,'timer','supply');
  ground('timer','return');
  rail('signal',3,'timer','input');
  resistor('load',1000,'timer','out','g','g');
  session.loadDocument(document);
  assert.equal(session.step(100).componentMeasurements.timer.closed,false);
  assert.equal(session.step(200).componentMeasurements.timer.closed,true);
  power.parameters.waveform.voltage=0;
  session.updateProjection(JSON.parse(adapter.compile(document).canonical),document.id);
  assert.equal(session.step(100).componentMeasurements.timer.closed,true);
  assert.equal(session.step(400).componentMeasurements.timer.closed,false);
}

{
  const {document,add,rail,resistor} = fixture();
  add('protection','motorProtectionSwitch',{i2t:.0001,label:'trip'});
  rail('line',5,'protection','in1');
  resistor('load',10,'protection','out1','g','g');
  add('relay','relayContact',{label:'trip',normallyClosed:true});
  rail('aux',5,'relay','a');
  resistor('loadAux',1000,'relay','b','g','g');
  session.loadDocument(document);
  assert.equal(session.step(2).componentMeasurements.relay.closed,true);
  const tripped=session.step(300);
  assert.equal(tripped.componentMeasurements.protection.blown,true);
  assert.equal(tripped.componentMeasurements.relay.closed,false);
}

for (const [kind,sign] of [['npnDarlington',1],['pnpDarlington',-1]]) {
  const {document,add,wire,rail,resistor}=fixture();
  add('pair',kind);
  rail('vcc',5*sign,'load','a');
  rail('bias',1.7*sign,'rb','a');
  add('load','resistor',{resistance:1000});
  add('rb','resistor',{resistance:10000});
  resistor('emitter',10,'pair','emitter','g','g');
  wire('load','b','pair','collector');
  wire('rb','b','pair','base');
  session.loadDocument(document);
  const on=session.step(20);
  assert.ok(Math.abs(on.pinVoltages.pair.collector)<2,kind);
}

for (const modelType of [0,1,2]) {
  const {document,add,wire,rail,resistor}=fixture(1e-6);
  add('amp','opampReal',{modelType});
  rail('plus',12,'amp','positiveSupply');
  rail('minus',-12,'amp','negativeSupply');
  rail('input',1,'amp','plus');
  wire('amp','out','amp','minus');
  resistor('load',10000,'amp','out','g','g');
  session.loadDocument(document);
  near(session.step(2000).pinVoltages.amp.out,1,.05);
}

for (const minus of [0,2]) {
  const {document,add,rail,resistor}=fixture();
  add('cmp','comparator');
  rail('minus',minus,'cmp','minus');
  rail('plus',1,'cmp','plus');
  rail('pull',5,'load','a');
  add('load','resistor',{resistance:1000});
  resistor('pin',1,'load','b','cmp','out');
  session.loadDocument(document);
  const output=session.step(50).pinVoltages.cmp.out;
  assert.ok(minus===0?output>4.9:output<.2,`comparator output: ${output}`);
}

for (const drive of [0,5]) {
  const {document,add,ground,rail,resistor}=fixture();
  add('opto','optocoupler');
  add('driveR','resistor',{resistance:1000});
  rail('drive',drive,'driveR','a');
  resistor('input',1,'driveR','b','opto','anode');
  ground('opto','cathode');
  ground('opto','emitter');
  rail('pull',5,'pullup','a');
  add('pullup','resistor',{resistance:10000});
  resistor('output',1,'pullup','b','opto','collector');
  session.loadDocument(document);
  const output=session.step(100).pinVoltages.opto.collector;
  assert.ok(drive===0?output>4.9:output<2,`optocoupler output: ${output}`);
}

{
  const {document,add,rail,resistor}=fixture();
  add('logic','customLogic',{modelName:'Copy or release',inputLabels:'EN,A',outputLabels:'Q',rules:'1a=a\n0?=_'});
  const enable=rail('enable',5,'logic','I0'), input=rail('input',5,'logic','I1');
  rail('pullup',3,'pull','a');
  add('pull','resistor',{resistance:1000});
  resistor('out',1,'pull','b','logic','Q0');
  session.loadDocument(document);
  near(session.step(10).pinVoltages.logic.Q0,5,.01);
  input.parameters.waveform.voltage=0;
  session.updateProjection(JSON.parse(adapter.compile(document).canonical),document.id);
  near(session.step(10).pinVoltages.logic.Q0,0,.01);
  enable.parameters.waveform.voltage=0;
  session.updateProjection(JSON.parse(adapter.compile(document).canonical),document.id);
  near(session.step(10).pinVoltages.logic.Q0,3,.01);
}

{
  const {document,add,rail,resistor}=fixture();
  add('rom','rom',{addressBits:2,dataBits:2,contents:'0: 0 1 2 3',lsbFirst:true});
  const a0=rail('a0',0,'rom','A0'), a1=rail('a1',0,'rom','A1');
  const enable=rail('enable',0,'rom','enable');
  for(let bit=0;bit<2;bit++)resistor(`load${bit}`,1000,'rom',`D${bit}`,'g','g');
  session.loadDocument(document);
  for(let word=0;word<4;word++){
    a0.parameters.waveform.voltage=(word&1)*5;
    a1.parameters.waveform.voltage=(word>>1)*5;
    session.updateProjection(JSON.parse(adapter.compile(document).canonical),document.id);
    const pins=session.step(4).pinVoltages.rom;
    for(let bit=0;bit<2;bit++)near(pins[`D${bit}`],((word>>bit)&1)*5,.01);
  }
  enable.parameters.waveform.voltage=5;
  session.updateProjection(JSON.parse(adapter.compile(document).canonical),document.id);
  near(session.step(4).pinVoltages.rom.D0,0);
}

for (const reloadOnReset of [false,true]) {
  const {document,add,rail,resistor}=fixture();
  add('ram','sram',{addressBits:2,dataBits:2,contents:'0: 1',reloadOnReset});
  rail('a0',0,'ram','A0');
  rail('a1',0,'ram','A1');
  const we=rail('we',0,'ram','write');
  rail('oe',0,'ram','enable');
  add('drive','voltageRail',{waveform:{kind:'dc',voltage:5}});
  resistor('write1',200,'drive','p','ram','D1');
  resistor('load',1000,'ram','D0','g','g');
  session.loadDocument(document);
  session.step(10);
  we.parameters.waveform.voltage=5;
  session.updateProjection(JSON.parse(adapter.compile(document).canonical),document.id);
  const read=session.step(10).pinVoltages.ram;
  assert.ok(read.D0<.01&&read.D1>4.9);
  session.reset();
  const reset=session.step(10).pinVoltages.ram;
  if(reloadOnReset) assert.ok(reset.D0>4.9&&reset.D1<.05);
  else assert.ok(reset.D0<.01&&reset.D1>4.9);
}

for (const forward of [false,true]) {
  const {document,add,rail,resistor}=fixture();
  add('chip','busTransceiver',{dataBits:2});
  rail('enable',0,'chip','enable');
  rail('direction',forward?5:0,'chip','direction');
  rail('data',5,'chip',forward?'A0':'B0');
  const out=forward?'B0':'A0';
  resistor('load',1000,'chip',out,'g','g');
  near(session.loadDocument(document).time,0);
  near(session.step(10).pinVoltages.chip[out],5*1000/1001,.001);
}

function imported(text) {
  const result=falstad.importText(text);
  assert.ok(result.document,JSON.stringify(result.diagnostics));
  return result.document;
}
for (const [text,xml] of [
  ['425 64 96 128 96 0 Q1 .2 0 .02 20 .015 .005 0 0 0','<RelayCoil x="64 96 128 96" lb="Q1"/>'],
  ['426 64 96 128 96 6 Q1 .05 1000000 0','<RelayContact x="64 96 128 96" f="6" lb="Q1"/>'],
  ['414 64 96 128 96 0 .01 0 1 10000000','<TimeDelayRelay x="64 96 128 96" ond=".01"/>'],
  ['400 64 96 128 96 0 0_-1_0_0_100 0_-1_0_0_100 -1','<dar x="64 96 128 96" pnp="-1"/>'],
  ['409 64 96 128 96 2 .6 0 .0231 0','<OpAmpReal x="64 96 128 96" f="2"/>'],
  ['402 64 96 192 96 0 0_0_40_-9_0_0_.5 0_0_40_9_0_0_.5','<OTA x="64 96 192 96"/>'],
]) {
  const a=imported(text).electrical.components[0], b=imported(`<cir>${xml}</cir>`).electrical.components[0];
  assert.equal(a.kind,b.kind);
  assert.deepEqual(a.parameters,b.parameters);
}
const upstream = new URL('../engine/upstream/src/com/lushprojects/circuitjs1/public/circuits/', import.meta.url);
for (const file of ['relays.txt','latchingrelay.txt','motorprotect.txt','ota-gain.txt','ota-vca.txt','ota-vcf-single.txt','ota-ringmod.txt','ledarray.txt']) {
  const document=imported(readFileSync(new URL(file,upstream),'utf8'));
  session.loadDocument(document);
  assert.ok(session.step(100).time>0,file);
}
// The bundled unijunction example requires adaptive timestepping. At a
// fixed 50 ns, the same circuit still charges and discharges repeatedly.
const ujtText=readFileSync(new URL('ujtosc.txt',upstream),'utf8').replace(/^\$ 65 \S+/,'$ 1 0.00000005');
const oscillator=imported(ujtText);
const emitter=oscillator.electrical.components.find(part=>part.kind==='unijunction').id;
session.loadDocument(oscillator);
let charged=false, drops=0;
for(let i=0;i<100;i++){
  const voltage=session.step(500).pinVoltages[emitter].emitter;
  if(voltage>5)charged=true;
  if(charged&&voltage<2){drops++;charged=false;}
}
assert.ok(drops>=2,'unijunction oscillator repeats at a fixed 50 ns step');

console.log('Routed wires, relays, analog models, custom logic, memory, transceivers and Falstad imports passed.');
