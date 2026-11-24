import {editing as CircuitEditorModel, geometry, signals, adapter as CircuitDocumentAdapter, protocol as CircuitRevisionProtocol, simulation as CircuitSimulation} from '../packages/circuit-core/index.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createEngine} from './engine_node_runtime.mjs';
import {outputFamilyCircuit} from './output_family_fixtures.mjs';
const doc=JSON.parse(await readFile(new URL('../docs/new-simulator/examples/voltage-divider.json',import.meta.url))),A=CircuitDocumentAdapter;
const channels=[{id:'input',positive:{componentId:'v1',pinId:'p'},negative:null},{id:'output',positive:{componentId:'r2',pinId:'a'},negative:null},{id:'difference',positive:{componentId:'v1',pinId:'p'},negative:{componentId:'r2',pinId:'a'}}];
function engine(){let time=0;const calls=[],compiled=A.compile(doc);return {calls,load(){time=0;},step(count){calls.push(count);time+=count*1e-5;return this.snapshot();},snapshot(){const value=Math.sin(2*Math.PI*1000*(time-1e-5));return {time,timeStep:1e-5,elements:compiled.mapping.map(c=>({current:c.id==='r2'?0.002:c.id==='v1'?0.004:0,voltages:c.pins.map(p=>c.id==='v1'&&p==='p'?value:c.id==='r2'&&p==='a'?2*value:0)}))};}};}
const e=engine(),session=A.createSession(e);session.loadDocument(doc);const frame=session.step(100,channels);
assert.equal(frame.sampleBatch.times.length,100);assert.equal(e.calls.length,100);assert.ok(e.calls.every(count=>count===1));
assert.ok(Math.max(...frame.sampleBatch.values.input)>.999,'Intermediate peak captured even when final frame is near zero');
frame.sampleBatch.values.input.forEach((v,i)=>{assert.ok(Math.abs(frame.sampleBatch.values.output[i]-2*v)<1e-12);assert.ok(Math.abs(frame.sampleBatch.values.difference[i]+v)<1e-12);});
assert.equal(frame.sampleBatch.times[0],0);assert.ok(Math.abs(frame.sampleBatch.times.at(-1)-.00099)<1e-12);
const before=session.snapshot();assert.throws(()=>session.step(2,[{id:'bad',positive:{componentId:'missing',pinId:'x'},negative:null}]),/Unknown scope/);assert.deepEqual(session.snapshot(),before,'Invalid channels do not advance/fault engine');
assert.throws(()=>session.step(2,[channels[0],channels[0]]),/duplicate/);assert.throws(()=>A.normalizeSampleChannels(Array.from({length:33},(_,i)=>({...channels[0],id:String(i)}))),/32/);
assert.throws(()=>session.step(2,[{...channels[0],positive:{kind:'pin',...channels[0].positive}}]),/fields/);
const currentFrame=session.step(3,[channels[0],{id:'current',kind:'current',componentId:'r2'}]);
assert.equal(currentFrame.sampleBatch.values.current.length,3);
assert.ok(currentFrame.sampleBatch.values.current.every(value=>value===0.002),'Sample signed component current on every solver step');
const sourceFrame=session.step(2,[{id:'source-current',kind:'current',componentId:'v1'}]);
assert.ok(sourceFrame.sampleBatch.values['source-current'].every(value=>value===-0.004),'Preserve source current sign from native mapping');
const currentBefore=session.snapshot();
assert.throws(()=>session.step(2,[{id:'bad-current',kind:'current',componentId:'missing'}]),/Current unavailable/);
assert.deepEqual(session.snapshot(),currentBefore,'Invalid current targets do not advance solver');
session.step(10);assert.equal(e.calls.at(-1),10,'Unsampled callers retain one bounded engine call');
const native = createEngine();
const legacy = createEngine();
assert.equal(typeof native.stepSampled, 'function');
delete legacy.stepSampled;
const transient = structuredClone(doc);
transient.electrical.components.find(component => component.id === 'v1').parameters.waveform =
  {kind:'sine', amplitude:5, offset:0, frequency:1000};
const nativeChannels = [...channels, {id:'source-current',kind:'current',componentId:'v1',polarity:-1}];
const nativeSession = A.createSession(native), legacySession = A.createSession(legacy);
nativeSession.loadDocument(transient);
legacySession.loadDocument(transient);
for (const count of [100, 17]) {
  const expected = legacySession.step(count, nativeChannels);
  const actual = nativeSession.step(count, nativeChannels);
  assert.deepEqual(actual, expected);
}
const projection = A.compile(transient);
const wireIndex = projection.terminalConnections[0].index;
native.load(projection.text, projection.timeStep);
legacy.load(projection.text, projection.timeStep);
const wireSamples = native.stepSampled(12, [{current:wireIndex, sign:1}]);
const expectedWireSamples = Array.from({length:12}, () => legacy.step(1).elements[wireIndex].current);
assert.deepEqual(Array.from(wireSamples.values[0]), expectedWireSamples);

const trigger = outputFamilyCircuit('stopTrigger', {threshold:2, delay:.0002});
nativeSession.loadDocument(trigger);
legacySession.loadDocument(trigger);
const triggerChannel = [{id:'v',positive:{componentId:'part',pinId:'in'},negative:null}];
const stopped = nativeSession.step(1000, triggerChannel);
assert.equal(stopped.stopRequested, true);
assert.ok(stopped.sampleBatch.times.length < 1000);
assert.deepEqual(stopped, legacySession.step(1000, triggerChannel));
// Explicit probe graph resolution is deterministic, including differential and orphan targets.
const m=CircuitEditorModel.create(doc);
const wire=m.document.electrical.wires[0], route=CircuitEditorModel.route(m.document,wire);
const markerId=m.addProbe({kind:'wire',id:wire.id,point:{x:(route[0].x+route[1].x)/2,y:(route[0].y+route[1].y)/2}},'Input');
const marker=m.document.probes.find(({id})=>id===markerId);
assert.equal(CircuitEditorModel.scopeChannels(m.document).channels.length,doc.probes.length,'Placing a probe leaves scope channels alone');
assert.equal(geometry.probeVoltage(m.document,marker,{pinVoltages:{v1:{p:-2.5}}}),-2.5,'The marker reads the wire voltage without a scope channel');
const traceId=m.addScopeVoltage(marker.positive,marker.label,undefined,markerId);
assert.equal(m.document.layout.probes[traceId],undefined,'Plotting a probe creates a trace with no additional marker');
const narrow=geometry.probeBounds(m.document,marker);
m.transaction('Edit marker display',d=>Object.assign(d.layout.probes[markerId],{decimals:6,showLabel:true}));
const wide=geometry.probeBounds(m.document,marker);
assert.ok(wide.right>narrow.right);
assert.equal(geometry.hit(m.document,{x:wide.right-1,y:wide.y+1}).id,markerId);
m.remove(new Set([geometry.token('probe',traceId)]));
assert.ok(m.document.layout.probes[markerId],'Deleting the trace keeps the marker');
m.undo();
m.remove(new Set([geometry.token('probe',markerId)]));
assert.ok(geometry.scopeChannels(m.document).channels.some(({id})=>id===traceId),'Deleting the marker keeps its plotted trace');
assert.equal(m.document.probes.find(({id})=>id===traceId).sourceProbeId,undefined);
m.undo();
const resolved=CircuitEditorModel.scopeChannels(m.document);assert.equal(resolved.channels.length,doc.probes.length+1);assert.equal(resolved.unresolved.length,0);
const beforeMove=m.document;
const scopeTrace=(document,id)=>geometry.scopeChannels(document).channels.find(channel=>channel.id===id);
const newTarget={kind:'pin',componentId:'r1',pinId:'b'};
m.execute({type:'moveProbe',id:markerId,target:newTarget});
assert.deepEqual(m.document.probes.find(({id})=>id===markerId).positive,newTarget);
assert.deepEqual(m.document.layout.probes[markerId],beforeMove.layout.probes[markerId]);
assert.notDeepEqual(scopeTrace(m.document,traceId).positive,scopeTrace(beforeMove,traceId).positive);
assert.deepEqual(scopeTrace(m.document,traceId).positive,scopeTrace(m.document,'probe-out').positive);
assert.deepEqual(scopeTrace(m.document,'probe-out'),scopeTrace(beforeMove,'probe-out'));
m.undo();
assert.deepEqual(m.document,beforeMove,'Moving the marker and trace undoes together');
const split=m.document;split.electrical.wires.reverse();assert.deepEqual(CircuitEditorModel.scopeChannels(split),resolved);
const orphan=structuredClone(split);orphan.electrical.wires=orphan.electrical.wires.filter(w=>!w.from.junctionId&&!w.to.junctionId);
assert.ok(CircuitEditorModel.scopeChannels(orphan).unresolved.length>0);
// Coordinator captures channel configuration at request time, independent of changes in flight.
let workerSession,request=0,state={documentId:null,circuitRevision:0,runEpoch:0};
const coordinator=CircuitSimulation.create({autoRun:false,workerFactory:options=>{
  workerSession=A.createSession(engine());const protocol=CircuitRevisionProtocol.create(workerSession);
  protocol.handle({protocolVersion:1,sessionId:options.sessionId,requestId:++request,operation:'initialize'});
  return {ready:Promise.resolve({}),terminate(){},async request(operation,extra={}){
    const reply=protocol.handle({protocolVersion:1,sessionId:options.sessionId,requestId:++request,operation,base:state,...extra});
    state=reply.state;if(!reply.ok)throw Object.assign(new Error(reply.error.message),reply.error);return reply.result;
  }};
}});
await coordinator.setDocument(doc);coordinator.setSampleChannels(channels);
const pending=coordinator.step(10);coordinator.setSampleChannels([channels[0]]);
assert.equal((await pending).sampleBatch.channels.length,3,'In-flight batch retains original channel set');
assert.equal((await coordinator.step(10)).sampleBatch.channels.length,1);
coordinator.setSampleChannels([]);assert.ok(!('sampleBatch' in await coordinator.step(10)));coordinator.dispose();
{
  const acquisition = signals.create();
  const trace = {id:'rail', positive:{componentId:'part',pinId:'p'}, negative:null};
  acquisition.setChannels([trace]);
  const operations = [], accepted = [];
  const run = CircuitSimulation.create({
    batchSteps: 24,
    scheduleTask: () => 1,
    cancelTask: () => {},
    workerFactory: ({sessionId}) => {
      const protocol = CircuitRevisionProtocol.create(A.createSession(createEngine()));
      let id = 0, base = {documentId:null,circuitRevision:0,runEpoch:0};
      const send = (operation, extra = {}) => {
        const reply = protocol.handle({protocolVersion:1,sessionId,requestId:++id,operation,base,...extra});
        base = reply.state;
        assert.ok(reply.ok, reply.error?.message);
        operations.push(operation);
        return reply.result;
      };
      return {ready:Promise.resolve(send('initialize')),terminate(){},async request(operation,extra){return send(operation,extra);}};
    },
    onState: state => acquisition.followState(state),
    onFrame: (frame, metadata) => accepted.push([acquisition.append(frame), metadata?.preview, frame.sampleBatch.times.length]),
  });
  const source = outputFamilyCircuit('variableVoltage');
  const rail = source.electrical.components.find(component=>component.id==='part');
  rail.parameters.voltage = 1;
  await run.setDocument(source);
  run.setSampleChannels([trace]);
  let previous = rail.parameters.voltage;
  for (const voltage of [2,4,0,5]) {
    rail.parameters.voltage = voltage;
    const ack = await run.setDocument(source,{preview:true});
    const samples = ack.frame.sampleBatch.values.rail;
    for (const [i,value] of samples.entries())
      assert.ok(Math.abs(value-(previous+(voltage-previous)*(i+1)/24))<1e-12);
    assert.equal(samples.at(-1),voltage);
    previous = voltage;
  }
  assert.deepEqual(operations,['initialize','installCircuit',...Array(4).fill('setVariableVoltage')]);
  assert.deepEqual(accepted,Array.from({length:4},()=>[true,true,24]));
  assert.equal(acquisition.count,96);
  run.dispose();

  const session = A.createSession(createEngine());
  session.loadDocument(source);
  const {voltageRamp} = session.setVariableVoltage('part', 2, {smooth:true});
  const withoutScopes = session.step(24, [], voltageRamp);
  assert.equal(withoutScopes.pinVoltages.part.p, 2);
  assert.ok(!withoutScopes.sampleBatch);
  session.setVariableVoltage('part', 3);
  assert.equal(session.step(1,[trace]).sampleBatch.values.rail[0],3);
}
console.log('Scope sampling checks passed: per-step peaks/differentials, pre-mutation validation, unsampled compatibility, graph resolution and in-flight channel configuration.');
