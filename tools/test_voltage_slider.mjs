import {sliderField, setProperty, clampSliderValue, sliderPosition, sliderVoltage} from '../apps/simulator/src/editor/componentSliders.ts';
import {editing as CircuitEditorModel, adapter as CircuitDocumentAdapter, protocol as CircuitRevisionProtocol, simulation as CircuitSimulation} from '../packages/circuit-core/index.mjs';
import assert from 'node:assert/strict';
import {createEngine} from './engine_node_runtime.mjs';
import {outputFamilyCircuit} from './output_family_fixtures.mjs';
const tick=()=>new Promise(r=>setImmediate(r));
// Exercise the actual property mapping used by React, including nested waveform
// fields and safe potentiometer endpoints, before checking native live edits.
const parameters={voltage:2,position:.5,waveform:{amplitude:1}};
assert.equal(sliderField({kind:'variableVoltage'}),'voltage');
assert.equal(sliderField({kind:'potentiometer'}),'position');
assert.equal(sliderField({kind:'voltageSource',field:'waveform.amplitude'}),'waveform.amplitude');
assert.throws(()=>sliderField({kind:'resistor'}),/Missing slider property/);
setProperty(parameters,'waveform.amplitude',3);
assert.equal(parameters.waveform.amplitude,3);assert.equal(parameters.voltage,2);
assert.equal(clampSliderValue('potentiometer','position',0),.001);
assert.equal(clampSliderValue('potentiometer','position',1),.999);
assert.equal(clampSliderValue('potentiometer','position',.4),.4);
assert.equal(clampSliderValue('variableVoltage','voltage',-5),-5);
let id=0;
// Real native source + RC load: repeated slider steps advance physics immediately,
// preserve epoch and follow the continuous capacitor recurrence without resetting.
const d=outputFamilyCircuit('variableVoltage'),M=CircuitEditorModel,A=CircuitDocumentAdapter;
d.electrical.components.push({id:'cap',reference:'C',kind:'capacitor',modelVersion:1,parameters:{capacitance:1e-6,initialVoltage:0,integration:'backwardEuler'}});
d.electrical.wires=d.electrical.wires.filter(w=>!(w.from.componentId==='load'&&w.from.pinId==='b'));
d.electrical.wires.push({id:'rc',from:{kind:'pin',componentId:'load',pinId:'b'},to:{kind:'pin',componentId:'cap',pinId:'a'}},{id:'cg',from:{kind:'pin',componentId:'cap',pinId:'b'},to:{kind:'pin',componentId:'g',pinId:'g'}});
let updates=0,workerCount=0;const timers=new Map();
function workerFactory(options){workerCount++;const protocol=CircuitRevisionProtocol.create(A.createSession(createEngine()));let requestId=0,state={documentId:null,circuitRevision:0,runEpoch:0};
 const send=(operation,extra={})=>{const reply=protocol.handle({protocolVersion:1,sessionId:options.sessionId,requestId:++requestId,operation,base:state,...extra});state=reply.state;if(!reply.ok)throw new Error(reply.error.message);return reply.result;};
 return {ready:Promise.resolve(send('initialize')),terminate(){},async request(op,args){if(op==='setVariableVoltage')updates++;return send(op,args);}};
}
const sim=CircuitSimulation.create({workerFactory,batchSteps:1,scheduleTask:(fn,delay)=>{timers.set(++id,{fn,delay});return id;},cancelTask:key=>timers.delete(key)});
async function solve(){assert.equal(timers.size,1);const [key,t]=timers.entries().next().value;timers.delete(key);t.fn();await tick();}
await sim.setDocument(d);await solve();let f=sim.getState().frame,time=f.time,charge=f.pinVoltages.cap.a;const epoch=f.runEpoch;
for(let i=0;i<50;i++){
 const next=structuredClone(d),voltage=(i%10)/2;next.electrical.components[0].parameters.voltage=voltage;
 const pending=sim.setDocument(next),during=sim.getState();assert.equal(during.frame,null);assert.equal(CircuitSimulation.presentationFrame(during).time,time);await pending;
 assert.equal([...timers.values()][0].delay,0,'Live changes must prompt a solve before the next drag event');await solve();f=sim.getState().frame;
 const expected=(charge+voltage*.01)/1.01;assert.ok(Math.abs(f.pinVoltages.cap.a-expected)<1e-12);assert.ok(Math.abs(f.time-time-d.simulation.timeStep)<1e-14);assert.equal(f.runEpoch,epoch);charge=f.pinVoltages.cap.a;time=f.time;
}
assert.equal(workerCount,1);assert.equal(updates,50);await sim.pause();const next=structuredClone(d);next.electrical.components[0].parameters.voltage=4.9;await sim.setDocument(next);assert.equal(timers.size,0);assert.equal(sim.getState().runRequested,false);
const state=sim.getState();for(const status of ['error','loading','disposed'])assert.equal(CircuitSimulation.presentationFrame({...state,status}),null);assert.equal(CircuitSimulation.presentationFrame({...state,accepted:{...state.accepted,runEpoch:999}}),null);sim.dispose();
console.log('Voltage slider checks passed: React property mapping, nested fields, safe pot endpoints, continuous native RC charge/time across 50 edits, prompt solves and safe presentation frames.');

// Endpoint order controls slider direction; native engine bounds remain sorted.
for(const [left,right] of [[0,-5],[-5,0],[5,-5],[-5,5]]) {
  for(const t of [0,.25,.5,.75,1]) {
    const voltage=sliderVoltage(t,left,right);
    assert.equal(sliderPosition(voltage,left,right),t);
    const doc=outputFamilyCircuit('variableVoltage',{minVoltage:left,maxVoltage:right,voltage});
    const session=A.createSession(createEngine());session.loadDocument(doc);
    assert.ok(Math.abs(session.step(2).pinVoltages.part.p-voltage)<1e-12);
    const end=t<.5?right:left;session.setVariableVoltage('part',end);
    assert.ok(Math.abs(session.step(2).pinVoltages.part.p-end)<1e-12);
  }
}
const model=M.create(outputFamilyCircuit('variableVoltage'),()=>{});
model.execute({type:'setParameters',componentId:'part',parameters:{minVoltage:0,maxVoltage:-5}});
assert.equal(model.document.electrical.components[0].parameters.voltage,0);
model.execute({type:'setParameters',componentId:'part',parameters:{voltage:-3}});
model.execute({type:'setParameters',componentId:'part',parameters:{minVoltage:2,maxVoltage:4}});
assert.equal(model.document.electrical.components[0].parameters.voltage,2);
model.undo();assert.equal(model.document.electrical.components[0].parameters.voltage,-3);
model.redo();assert.equal(model.document.electrical.components[0].parameters.voltage,2);
assert.throws(()=>M.validate(outputFamilyCircuit('variableVoltage',{minVoltage:0,maxVoltage:0,voltage:0})));
assert.throws(()=>M.validate(outputFamilyCircuit('variableVoltage',{minVoltage:0,maxVoltage:-5,voltage:1})));
console.log('Descending voltage ranges passed: normalized slider positions, all endpoints/midpoints, native live updates, reset-to-left and undo/redo.');
