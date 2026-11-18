import assert from 'node:assert/strict';
import {catalog, editing, adapter, geometry, document as documents} from '../packages/circuit-core/index.mjs';
import {hasSlider, sliderField, clampSliderValue} from '../apps/simulator/src/editor/componentSliders.ts';
import {propertyNumber, normaliseSpdtSettings, spdtPositionLabels} from '../apps/simulator/src/editor/componentPropertyFields.ts';
import {coverageCircuit} from './falstad_coverage_fixtures.mjs';
import {outputFamilyCircuit} from './output_family_fixtures.mjs';
import {createEngine} from './engine_node_runtime.mjs';
import {createTypeScriptLoader, React, renderToStaticMarkup} from './typescript_module.mjs';

for (const kind of ['photoresistor','thermistor']) {
  const doc=coverageCircuit(kind), part=doc.electrical.components.find(c=>c.id==='part');
  assert.ok(hasSlider(part));
  assert.equal(sliderField(part),'position');
  assert.equal(clampSliderValue(kind,'position',-1),0);
  assert.equal(clampSliderValue(kind,'position',2),1);
  const initial=adapter.compile(doc);
  part.parameters.label='Room + 25 °C & Δ\\sensor';
  const labelled=adapter.compile(doc);
  assert.equal(labelled.text,initial.text,'Editor labels cannot change native model records');
  assert.equal(adapter.fromProjection(JSON.parse(labelled.canonical),doc.id).canonical,labelled.canonical);
  const model=editing.create(doc), before=model.document;
  model.execute({type:'setParameters',componentId:'part',parameters:{label:'Window',position:0.9}});
  const after=model.document;
  model.undo();assert.deepEqual(model.document,before);
  model.redo();assert.deepEqual(model.document,after);
  const restored=JSON.parse(JSON.stringify(after));documents.validate(restored);
  assert.equal(restored.electrical.components.find(c=>c.id==='part').parameters.label,'Window');

  const session=adapter.createSession(createEngine());session.loadDocument(doc);
  let previousTime=session.step(2).time, previousResistance=Infinity;
  for (const position of [0,0.25,0.5,0.75,1]) {
    part.parameters.position=position;
    session.updateProjection(JSON.parse(adapter.compile(doc).canonical),doc.id);
    const frame=session.step(2), measured=frame.componentMeasurements.part;
    assert.ok(frame.time>previousTime,'Sensor adjustments preserve advancing simulation time');
    previousTime=frame.time;
    let expected;
    if (kind==='photoresistor') {
      const lux=10000*position+0.1;
      assert.equal(measured.lux,lux);
      expected=Math.round((10000-lux+1)*10);
    } else {
      const {minTemperature:min,maxTemperature:max,resistance25:r25,resistance50:r50}=part.parameters;
      const temperature=Math.round(min+position*(max-min));
      assert.equal(measured.temperature,temperature);
      const beta=(Math.log(r25)-Math.log(r50))/(1/298.15-1/323.15);
      expected=Math.round(r25*Math.exp(beta*(1/(temperature+273.15)-1/298.15)));
    }
    assert.equal(measured.resistance,expected);
    assert.ok(measured.resistance<previousResistance,'Moving toward more light/heat decreases resistance');
    previousResistance=measured.resistance;
    assert.ok(Math.abs(Math.abs(frame.componentCurrents.part)-5/(1000+expected))<1e-10);
  }
}

const load=createTypeScriptLoader();
for (const kind of ['voltmeter','ammeter']) {
  const doc=outputFamilyCircuit(kind,{mode:1}), part=doc.electrical.components.find(c=>c.id==='part');
  doc.electrical.components.find(c=>c.kind==='voltageRail').parameters.waveform={kind:'sine',amplitude:5,frequency:1000,offset:0};
  const baseline=adapter.compile(doc);
  const session=adapter.createSession(createEngine()), control=adapter.createSession(createEngine());
  session.loadDocument(doc);control.loadDocument(doc);session.step(350);control.step(350);
  const {Symbol:Meter}=load(new URL(`../packages/circuit-symbols/src/${kind}.tsx`,import.meta.url));
  for (const scale of [0,1,2,3]) for (const circleSymbol of [false,true]) {
    Object.assign(part.parameters,{scale,circleSymbol});
    const compiled=adapter.compile(doc);
    assert.equal(compiled.text,baseline.text,'Meter presentation must not change native model records');
    assert.equal(adapter.fromProjection(JSON.parse(compiled.canonical),doc.id).canonical,compiled.canonical);
    session.updateProjection(JSON.parse(compiled.canonical),doc.id);
    const actual=session.step(7), expected=control.step(7);
    assert.equal(actual.time,expected.time);
    assert.deepEqual(actual.componentMeasurements.part,expected.componentMeasurements.part,'Display changes retain accumulated RMS statistics');
    assert.equal(actual.componentCurrents.part,expected.componentCurrents.part);
    for (const rotation of [0,90,180,270]) for (const mirror of [false,true]) {
      const drawing=renderToStaticMarkup(React.createElement(Meter,{parameters:part.parameters,pose:{rotation,mirror}}));
      assert.equal(drawing.includes('<circle'),circleSymbol);
      assert.doesNotMatch(drawing,/NaN/);
      if (!circleSymbol && kind==='ammeter') assert.match(drawing,/M-12-10L12 0-12 10Z/);
      if (!circleSymbol && kind==='voltmeter') assert.match(drawing,/M-100 0L-25 0/);
    }
  }
  const model=editing.create(doc), before=model.document;
  model.execute({type:'setParameters',componentId:'part',parameters:{scale:2,circleSymbol:false}});
  const after=model.document;model.undo();assert.deepEqual(model.document,before);model.redo();assert.deepEqual(model.document,after);
  documents.validate(JSON.parse(JSON.stringify(after)));
  for (const bad of [{scale:-1},{scale:4},{scale:1.5},{circleSymbol:'yes'}])
    assert.throws(()=>adapter.compile(outputFamilyCircuit(kind,bad)));
}
console.log('Meter display options passed: scales/styles, save/undo, projection invariance, rotated/mirrored symbols and preserved live RMS/current/time.');
const {Symbol:Fuse}=load(new URL('../packages/circuit-symbols/src/fuse.tsx',import.meta.url));
const fuseDoc=coverageCircuit('fuse'), fuse=fuseDoc.electrical.components.find(c=>c.id==='part');
const plain=adapter.compile(fuseDoc);
const drawings=[];
for (const iecSymbol of [false,true]) {
  fuse.parameters.iecSymbol=iecSymbol;
  const compiled=adapter.compile(fuseDoc);
  assert.equal(compiled.text,plain.text,'Fuse style is electrically inert');
  assert.equal(adapter.fromProjection(JSON.parse(compiled.canonical),fuseDoc.id).canonical,compiled.canonical);
  const session=adapter.createSession(createEngine());session.loadDocument(fuseDoc);
  const frame=session.step(20);
  assert.equal(frame.componentMeasurements.part.blown,false);
  drawings.push(renderToStaticMarkup(React.createElement(Fuse,{parameters:fuse.parameters,measured:{blown:false}})));
  const blown=renderToStaticMarkup(React.createElement(Fuse,{parameters:fuse.parameters,measured:{blown:true}}));
  assert.doesNotMatch(blown,/M-16-6|M-8 0C/,'Blown fuse has an open body in both styles');
}
assert.notEqual(drawings[0],drawings[1]);
assert.match(drawings[0],/M-8 0C/);
assert.match(drawings[1],/M-16-6/);
assert.throws(()=>adapter.compile(coverageCircuit('fuse',{iecSymbol:'yes'})));
assert.throws(()=>adapter.compile(coverageCircuit('thermistor',{label:'x'.repeat(81)})));

const motorDoc=outputFamilyCircuit('threePhaseMotor'), motor=motorDoc.electrical.components.find(c=>c.id==='part');
for (const coupling of [0.5,0.9]) {
  motor.parameters.statorInductance=0.04;motor.parameters.rotorInductance=0.05;
  motor.parameters.mutualInductance=propertyNumber(motor,'mutualInductance',coupling,true);
  assert.ok(Math.abs(propertyNumber(motor,'mutualInductance',motor.parameters.mutualInductance)-coupling)<1e-15);
  const compiled=adapter.compile(motorDoc);
  assert.equal(adapter.fromProjection(JSON.parse(compiled.canonical),motorDoc.id).canonical,compiled.canonical);
  const session=adapter.createSession(createEngine());session.loadDocument(motorDoc);
  assert.ok(Number.isFinite(session.step(100).componentMeasurements.part.speed));
}
console.log('Property controls passed: sensor labels/save/undo, live light/temperature endpoints against native resistance/current, fuse styles/projection invariance, and motor coupling conversions/native solves.');

// Shrinking a switch while its last throw is wired must preserve that wire as a
// junction, choose an available throw and retain exact undo/redo states.
{
  const doc=documents.empty();
  const add=(id,kind,parameters={})=>{
    doc.electrical.components.push({id,kind,modelVersion:1,parameters:{...structuredClone(catalog.definitions[kind].parameters),...parameters}});
    doc.layout.components[id]={x:doc.electrical.components.length*500,y:0,rotation:0,mirror:false};
  };
  const wire=(id,from,fp,to,tp)=>{
    doc.electrical.wires.push({id,from:{kind:'pin',componentId:from,pinId:fp},to:{kind:'pin',componentId:to,pinId:tp}});
    doc.layout.wires[id]={bends:[]};
  };
  add('switch','spdtSwitch',{throwCount:10,position:9});add('supply','voltageRail');
  add('last','resistor');add('first','resistor');add('g','ground');
  wire('drive','supply','p','switch','common');wire('last-wire','switch','throw10','last','a');
  wire('last-return','last','b','g','g');wire('first-wire','switch','a','first','a');wire('first-return','first','b','g','g');
  const model=editing.create(doc), before=model.document;
  const endpoint=geometry.pin(before,{kind:'pin',componentId:'switch',pinId:'throw10'});
  const session=adapter.createSession(createEngine());session.loadDocument(before);
  const initial=session.step(10);assert.equal(initial.pinVoltages.last.a,5);
  const settings=normaliseSpdtSettings({...before.electrical.components[0].parameters,throwCount:2});
  assert.equal(settings.position,0);assert.deepEqual(spdtPositionLabels(settings),['A','B']);
  model.execute({type:'setParameters',componentId:'switch',parameters:settings});
  const after=model.document, loose=after.electrical.wires.find(w=>w.id==='last-wire').from;
  assert.equal(loose.kind,'junction');assert.deepEqual(after.layout.junctions[loose.junctionId],endpoint);
  model.undo();assert.deepEqual(model.document,before);model.redo();assert.deepEqual(model.document,after);
  session.updateProjection(JSON.parse(adapter.compile(after).canonical),after.id);
  const updated=session.step(10);assert.equal(updated.pinVoltages.first.a,5);assert.equal(updated.pinVoltages.last.a,0);
  assert.ok(updated.time>initial.time);
  assert.equal(normaliseSpdtSettings({...settings,throwCount:3,momentary:true}).momentary,false);
  for (const throwCount of [1,11,2.5]) assert.throws(()=>normaliseSpdtSettings({...settings,throwCount}),/whole number/);
}
console.log('Switch panel edits passed: valid throw choices, removed-position reset, momentary rules, preserved wire endpoints, exact undo/redo and live native rerouting.');
