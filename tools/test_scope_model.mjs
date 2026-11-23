import {signals as CircuitScopeModel} from '../packages/circuit-core/index.mjs';
import assert from 'node:assert/strict';
const S=CircuitScopeModel;
const channels=[{id:'in',label:'Vin',positive:{componentId:'v',pinId:'p'},negative:null},{id:'out',label:'Vout',positive:{componentId:'u',pinId:'out'},negative:null}];
const scope=S.create({capacity:5}),descriptors=scope.setChannels(channels);
function frame(sequence,times,values,extra={}){return {sessionId:'session',documentId:'doc',runEpoch:1,circuitRevision:1,frameSequence:sequence,sampleBatch:{channels:descriptors,times,values},...extra};}
assert.ok(scope.append(frame(1,[0,1,2],{in:[0,1,0],out:[0,2,0]})));
assert.equal(scope.count,3);assert.deepEqual(scope.window(10).channels.map(c=>[c.label,c.max]),[['Vin',1],['Vout',2]]);
assert.equal(scope.append(frame(1,[0,1,2],{in:[0,1,0],out:[0,2,0]})),false,'Repeated frame rejected');
assert.equal(scope.append(frame(2,[3,2],{in:[1,2],out:[2,4]})),false,'Unsorted sample batch rejected atomically');
assert.equal(scope.count,3);
assert.ok(scope.append(frame(2,[3,4,5,6],{in:[-1,0,1,0],out:[-2,0,2,0]})));
assert.equal(scope.count,5);assert.deepEqual(scope.window(10).times,[2,3,4,5,6],'Ring buffer bounded');
const wrapped=scope.window(2.5);
assert.deepEqual(wrapped.times,[4,5,6]);
assert.deepEqual(wrapped.channels.map(c=>[c.values,c.min,c.max]),[[[0,1,0],0,1],[[0,2,0],0,2]]);
assert.ok(scope.append(frame(3,[7],{in:[1],out:[2]},{circuitRevision:2})),'Same epoch live revision continues history');
assert.equal(scope.append(frame(4,[8],{in:[1],out:[2]},{circuitRevision:1})),false,'Old revision rejected');
scope.setChannels(channels.map(c=>({...c,label:c.id.toUpperCase()})));assert.equal(scope.count,5,'Renaming channels retains samples');
assert.equal(scope.window(10).channels[0].label,'IN');
assert.ok(scope.append(frame(1,[0],{in:[.2],out:[.4]},{sessionId:'replacement',runEpoch:2,circuitRevision:3})));
assert.equal(scope.count,1,'Replacement/reset clears history');
scope.clear();assert.equal(scope.count,0);assert.equal(scope.append(frame(1,[0],{in:[.2],out:[.4]},{sessionId:'replacement',runEpoch:2,circuitRevision:3})),false,'Clear does not allow duplicate frame replay');
const retargeted=channels.map(c=>c.id==='in'?{...c,positive:{componentId:'v2',pinId:'p'}}:c);scope.setChannels(retargeted);assert.equal(scope.count,0);
assert.equal(scope.append(frame(9,[1],{in:[1],out:[2]})),false,'Old channel target batch rejected');
assert.throws(()=>scope.setChannels([...channels,channels[0]]),/duplicate/);
const xs=Array.from({length:1000},(_,i)=>i/1000),ys=xs.map((x,i)=>i===501?100:0),reduced=S.envelope(xs,ys,0,1,50);
assert.ok(reduced.some(([,y])=>y===100),'Peak retained during pixel decimation');assert.ok(reduced.length<=204);
assert.deepEqual(
  S.envelope([0,1,2,3,4,5,6,10],[0,5,1,-4,0,3,1,0],0,10,1),
  [[0,0],[1,5],[3,-4],[6,1],[10,0]],
  'Envelope keeps extrema in time order and retains single-sample columns'
);
assert.equal(S.autoScale([{min:-.5,max:1.5}]),.5);assert.equal(S.color('in'),S.color('in'));
console.log('Scope model checks passed: synchronized channels, bounded history, epoch/revision/sequence/target gating, rename/clear, peak envelopes and voltage scale.');
const guarded=S.create();guarded.setChannels(channels);guarded.expect({sessionId:'new',documentId:'doc',runEpoch:3,circuitRevision:4});
assert.equal(guarded.append(frame(100,[0],{in:[1],out:[2]})),false,'Old session cannot replace the accepted acquisition');
assert.equal(guarded.append(frame(1,[0],{in:[1],out:[2]},{sessionId:'new',runEpoch:3,circuitRevision:4})),true);
guarded.expect(null);assert.equal(guarded.count,0);assert.equal(guarded.append(frame(2,[1],{in:[1],out:[2]},{sessionId:'new',runEpoch:3,circuitRevision:4})),false,'Fault/loading state rejects old samples');

// Retain the same simulated duration at smaller timesteps, without decimating peaks.
for(const step of [1e-5,5e-6,1e-6]){
  const timed=S.create({capacity:8,historySpan:.2});timed.setChannels(channels);
  let sequence=0;
  const total=Math.round(.3/step);
  for(let first=0;first<=total;first+=1000){
    const times=Array.from({length:Math.min(1000,total-first+1)},(_,i)=>(first+i)*step);
    const samples=times.map(t=>t>=.15&&t<.15+step*1.1?100:-1);
    assert.ok(timed.append(frame(++sequence,times,{in:samples,out:samples.map(v=>-v)},{timeStep:step})));
  }
  const view=timed.window(.2);
  assert.ok(view.times[0]<=.1+step,'Full 200 ms window retained');
  assert.ok(view.times.at(-1)>=.3-step);
  assert.ok(view.times.length>=Math.floor(.2/step),'Raw sample resolution retained');
  assert.equal(view.channels[0].max,100,'Narrow peak retained');
  assert.equal(view.channels[1].min,-100,'Channels remain aligned after buffer growth');
  const grownCapacity=view.capacity;
  timed.setHistorySpan(.4);
  const times=Array.from({length:1000},(_,i)=>.3+(i+1)*step);
  timed.append(frame(++sequence,times,{in:times.map(()=>2),out:times.map(()=>-2)},{timeStep:step}));
  assert.ok(timed.window(.4).times[0]<=.1+step,'Increasing duration preserves existing samples');
  timed.reset();assert.equal(timed.count,0);
  assert.equal(timed.window(.2).capacity,grownCapacity,'Reset reuses allocated storage');
}
assert.throws(()=>S.create({historySpan:0}),/history span/);
console.log('Time-based scope retention checks passed at 10, 5 and 1 µs.');
