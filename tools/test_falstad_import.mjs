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
const rail=parse('R 0 0 0 -32 0 0 40 5 0 0 .5\nr 0 0 96 0 0 1000\ng 96 0 96 32 0');
assert.equal(rail.electrical.components.filter(c=>c.kind==='ground').length,1);
session.loadDocument(rail);assert.equal(session.step(10).pinVoltages.c2.a,5);
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
// Real upstream inverting amplifier: compare actual engine results to imported graph, rather
// than asserting only on a synthetic document or the importer's own output.
const directory=new URL('../engine/upstream/src/com/lushprojects/circuitjs1/public/circuits/',import.meta.url);
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
const xmlDefaults=parse(`<cir><r x='0 0 96 0'/><c x='0 96 96 96'/><l x='0 192 96 192'/><a x='0 288 128 288' f='4'/></cir>`);
assert.equal(xmlDefaults.electrical.components[0].parameters.resistance,100);
assert.equal(xmlDefaults.electrical.components[1].parameters.initialVoltage,.001);
assert.equal(xmlDefaults.electrical.components[2].parameters.inductance,1);
assert.equal(xmlDefaults.electrical.components[3].parameters.gain,100000,'XML gain is independent of legacy LOWGAIN flag');
const xmlPhase=parse(`<cir><R x='0 0 0 96' wf='1' f='2' phaseShift='0.25'/></cir>`);
assert.equal(xmlPhase.electrical.components[0].parameters.waveform.phase,.25);
const xmlPulse=parse(`<cir><R x='0 0 0 96' wf='5'/></cir>`);
assert.equal(xmlPulse.electrical.components[0].parameters.waveform.dutyCycle,.5,'XML pulse default differs from old text');
const xmlWarnings=falstad.importText(`<cir>\n<r x='0 0 96 0'/>\n<o en='0'><p v='0' sc='5'/></o>\n</cir>`);
assert.ok(xmlWarnings.document);assert.equal(xmlWarnings.diagnostics[0].line,3);
for(const text of [
  '<cir><r x="0 0 96 0"></cir>', '<cir><r x="0 0 96 0"/></cir><cir/>',
  '<!DOCTYPE cir SYSTEM "file:///etc/passwd"><cir/>', '<cir><r x="0 0 96 0" r="1" r="2"/></cir>',
  '<cir><r x="0 0 96 0" r="&unknown;"/></cir>', '<cir><r x="0 0 96 0" mystery="1"/></cir>',
  '<cir><VCVS x="0 0 96 0" ex="a &gt; b"/></cir>', '<cir><v x="0 0 96 0" riseTime="1"/></cir>',
  '<cir><r x="0 0 96 0" f="4294967296"/></cir>', '<cir><r x="0 0 96 0" r="NaN"/></cir>',
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
