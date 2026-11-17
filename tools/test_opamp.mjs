import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {adapter, catalog} from '../packages/circuit-core/index.mjs';
import {createEngine} from './engine_node_runtime.mjs';

const base=JSON.parse(readFileSync(new URL('../docs/new-simulator/examples/opamp-noninverting.json',import.meta.url),'utf8'));
const session=adapter.createSession(createEngine());
const gain=100000;
const near=(actual,expected,tolerance=1e-10)=>assert.ok(Math.abs(actual-expected)<tolerance,`${actual} != ${expected}`);
assert.deepEqual(catalog.simulationModels.opamp.postOrder,['minus','plus','out']);

// Geometry and authored pin insertion order must not change electrical polarity.
for(const rotation of [0,90,180,270])for(const mirror of [false,true]){
 for(const input of [1,-1,20,-20]){
  const document=structuredClone(base);
  Object.assign(document.layout.components.u1,{rotation,mirror});
  document.electrical.components.find(c=>c.id==='vin').parameters.waveform.voltage=input;
  session.loadDocument(document);
  const frame=session.step(10),out=frame.pinVoltages.u1.out;
  near(frame.pinVoltages.u1.plus,input);
  if(Math.abs(input)===1){
   near(out,input*2*gain/(gain+2));
   near(frame.pinVoltages.u1.minus,out/2);
  }else near(out,input>0?15:-15,.01);
  near(frame.componentCurrents.u1,out*(1/10000+1/20000));
  session.reset();near(session.step(10).pinVoltages.u1.out,out);
 }
}
const inverted=structuredClone(base);
inverted.electrical.wires.find(w=>w.id==='w1').from={kind:'pin',componentId:'g1',pinId:'g'};
inverted.electrical.wires.find(w=>w.id==='w10').to={kind:'pin',componentId:'vin',pinId:'p'};
session.loadDocument(inverted);
near(session.step(10).pinVoltages.u1.out,-gain/(gain+2));
const follower=structuredClone(base);
follower.electrical.wires.find(w=>w.id==='w3').to={kind:'junction',junctionId:'output'};
session.loadDocument(follower);
near(session.step(10).pinVoltages.u1.out,gain/(gain+1));
console.log('Op-amp checks passed: input polarity, feedback, inversion, follower, both output limits, current sign, reset and all orientations.');
