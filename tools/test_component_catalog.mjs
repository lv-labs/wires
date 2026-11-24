import {editing as CircuitEditorModel, adapter as CircuitDocumentAdapter} from '../packages/circuit-core/index.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createEngine} from './engine_node_runtime.mjs';
const M=CircuitEditorModel,A=CircuitDocumentAdapter,engine=createEngine(),session=A.createSession(engine);
const near=(actual,expected,tolerance=1e-10)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);
function circuit(kind,parameters={}){
  const d=M.empty();d.id='catalog-'+kind;
  // Keep analytical transient expectations independent of the editor default.
  d.simulation.timeStep=1e-5;
  const add=(id,kind,parameters,x)=>{d.electrical.components.push({id,kind,modelVersion:1,reference:id,parameters});d.layout.components[id]={x,y:0,rotation:0,mirror:false};};
  add('part',kind,{...structuredClone(M.definitions[kind].parameters),...parameters},0);
  add('r','resistor',{resistance:1000},192);add('g','ground',{},384);
  const connect=(a,ap,b,bp)=>{const id='w'+d.electrical.wires.length;d.electrical.wires.push({id,from:{kind:'pin',componentId:a,pinId:ap},to:{kind:'pin',componentId:b,pinId:bp}});d.layout.wires[id]={bends:[]};};
  if(kind==='currentSource'){
    connect('part','a','g','g');connect('part','b','r','a');connect('r','b','g','g');
  }else{
    add('v','voltageRail',{waveform:{kind:'dc',voltage:5}},576);
    if(kind==='potentiometer'){connect('v','p','part','a');connect('part','b','g','g');connect('part','wiper','r','a');connect('r','b','g','g');}
    else {connect('v','p','r','a');connect('r','b','part',kind==='diode'?'anode':'a');connect('part',kind==='diode'?'cathode':'b','g','g');}
  }
  return M.alignGrid(d);
}
for(const kind of ['inductor','diode','currentSource','potentiometer']){
  const d=circuit(kind),compiled=A.compile(d);
  M.validate(d);assert.equal(A.fromProjection(JSON.parse(compiled.canonical),d.id).canonical,compiled.canonical);
  for(const rotation of [0,90,180,270])for(const mirror of [false,true]){
    const transformed=structuredClone(d);Object.assign(transformed.layout.components.part,{rotation,mirror});
    for(const pinId of Object.keys(M.definitions[kind].pins)){const point=M.pin(transformed,{kind:'pin',componentId:'part',pinId});assert.ok(point.x%M.grid===0);assert.ok(point.y%M.grid===0);}
    assert.equal(A.compile(transformed).canonical,compiled.canonical);
  }
  const model=M.create(d),before=model.document;
  model.transaction('Edit',next=>M.move(next,new Set([M.token('component','part')]),32,16));model.undo();assert.deepEqual(model.document,before);
  const invalid=structuredClone(d);invalid.electrical.components[0].parameters.unrecognized=1;assert.throws(()=>A.compile(invalid));
  session.loadDocument(d);const frame=session.step(20);for(const values of Object.values(frame.pinVoltages))for(const v of Object.values(values))assert.ok(Number.isFinite(v));
  session.reset();const reset=session.step(20);assert.deepEqual(reset.pinVoltages,frame.pinVoltages);
  if(kind==='currentSource'){near(frame.pinVoltages.part.b,10);near(frame.componentCurrents.part,.01);}
  if(kind==='diode'){assert.ok(frame.pinVoltages.part.anode>.4&&frame.pinVoltages.part.anode<.9);near(frame.componentCurrents.part,frame.componentCurrents.r);}
  if(kind==='potentiometer')near(frame.pinVoltages.part.wiper,2);
  if(kind==='inductor')near(frame.componentCurrents.part,.005*(1-Math.pow(1/(1+1000*d.simulation.timeStep),20)));
}
for(const position of [0,.25,.5,.75,1]){
  session.loadDocument(circuit('potentiometer',{position}));const f=session.step(5);
  const lower=1000*(1-position),parallel=lower*1000/(lower+1000),expected=position===0?5:5*parallel/(1000*position+parallel);
  near(f.pinVoltages.part.wiper,expected);
}
{
  const fast = A.createSession(createEngine()), full = A.createSession(createEngine());
  const initial = circuit('potentiometer', {position:.5});
  fast.loadDocument(initial);
  full.loadDocument(initial);
  let previousTime = fast.step(10).time;
  full.step(10);
  for (const position of [1, .15, 0, .85, .45]) {
    assert.equal(fast.setPotPosition('part', position).appliedAtTime, previousTime);
    const edited = circuit('potentiometer', {position});
    full.updateProjection(JSON.parse(A.compile(edited).canonical), edited.id);
    const actual = fast.step(5), expected = full.step(5);
    assert.equal(actual.time, expected.time);
    near(actual.pinVoltages.part.wiper, expected.pinVoltages.part.wiper);
    previousTime = actual.time;
  }
  assert.throws(() => fast.setPotPosition('part', -.01), /wiper position between 0 and 1/);
  assert.equal(fast.snapshot().time, previousTime);
  fast.reset();
  full.reset();
  near(fast.step(5).pinVoltages.part.wiper, full.step(5).pinVoltages.part.wiper);

  const tiedWiper = circuit('potentiometer', {position:.5});
  tiedWiper.electrical.wires.push({
    id:'tied-wiper',
    from:{kind:'pin', componentId:'part', pinId:'wiper'},
    to:{kind:'pin', componentId:'part', pinId:'a'}
  });
  tiedWiper.layout.wires['tied-wiper'] = {bends:[]};
  fast.loadDocument(tiedWiper);
  fast.step(5);
  const before = fast.snapshot();
  assert.throws(() => fast.setPotPosition('part', 0), /ideal potentiometer loop/);
  assert.deepEqual(fast.snapshot(), before);
}
for(const current of [-.01,0,.01]){session.loadDocument(circuit('currentSource',{current}));const f=session.step(2);near(f.pinVoltages.part.b,current*1000);near(f.componentCurrents.part,current);}
for(const integration of ['backwardEuler','trapezoidal']){
  session.loadDocument(circuit('inductor',{initialCurrent:.002,integration}));const f=session.step(1);
  const expected=integration==='backwardEuler'?(.002+5e-5)/(1+.01):(.002+2.5e-5)/(1+.005);
  near(f.componentCurrents.part,expected);
}
const open=circuit('currentSource');open.electrical.wires=open.electrical.wires.filter(w=>w.to.componentId!=='r');assert.ok(A.compile(open).diagnostics.some(d=>d.code==='OPEN_CURRENT_SOURCE'));
const reference=JSON.parse(readFileSync('tools/engine-harness/reference.json','utf8'));
const ctx=vm.createContext({});vm.runInContext(readFileSync('tools/engine-harness/cases.js','utf8')+'\nglobalThis.cases=engineCases;',ctx);
for(const [name,test] of Object.entries(ctx.cases)){
  engine.load(test.text,reference.provenance.timeStep);let done=0;
  for(const [i,count] of (test.samples||reference.provenance.sampleSteps).entries()){
    for(const event of test.events||[])if(event.afterStep>=done&&event.afterStep<count){if(event.afterStep>done){engine.step(event.afterStep-done);done=event.afterStep;}engine.setSwitch(event.id,event.closed);}
    const f=engine.step(count-done);done=count;const expected=reference.traces[name][i];near(f.time,expected.time,1e-12);
    for(const [j,elm] of expected.elements.entries()){near(f.elements[j].current,elm.current,1e-12);elm.voltages.forEach((v,k)=>near(f.elements[j].voltages[k],v,1e-12));}
  }
}
console.log('Component checks passed: four model families, projection validation, grid/orientation, history, analytic RL/pot/current results, diode polarity, initial states, reset and all six historical numerical baselines.');

function deviceCircuit(kind,inputs={}){
  const d=M.empty();d.id='device-'+kind;
  const add=(id,kind,parameters)=>{d.electrical.components.push({id,kind,modelVersion:1,reference:id,parameters});d.layout.components[id]={x:d.electrical.components.length*160,y:0,rotation:0,mirror:false};};
  const connect=(a,ap,b,bp)=>{const id='w'+d.electrical.wires.length;d.electrical.wires.push({id,from:{kind:'pin',componentId:a,pinId:ap},to:{kind:'pin',componentId:b,pinId:bp}});d.layout.wires[id]={bends:[]};};
  // Isolate channel cutoff from the optional body-diode path (covered in property parity).
  add('part',kind,{...structuredClone(M.definitions[kind].parameters),...(['nmos','pmos'].includes(kind)?{bodyDiode:false}:{})});
  add('g','ground',{});
  const drive=(pin,voltage)=>{const id='drive-'+pin;add(id,'voltageRail',{waveform:{kind:'dc',voltage}});connect(id,'p','part',pin);};
  if(kind.endsWith('Gate')||kind==='inverter'){
    for(const pin of Object.keys(M.definitions[kind].pins).filter(p=>p!=='out'))drive(pin,inputs[pin]||0);
    add('load','resistor',{resistance:1000});connect('part','out','load','a');connect('load','b','g','g');
  }else if(['npn','pnp'].includes(kind)){
    const sign=kind==='npn'?1:-1;
    drive('emitter',0);
    add('supply','voltageRail',{waveform:{kind:'dc',voltage:sign*5}});
    add('load','resistor',{resistance:1000});connect('supply','p','load','a');connect('load','b','part','collector');
    add('bias','voltageRail',{waveform:{kind:'dc',voltage:inputs.off?0:sign*1.5}});
    add('baseR','resistor',{resistance:100000});connect('bias','p','baseR','a');connect('baseR','b','part','base');
  }else{
    const sign=kind.startsWith('p')?-1:1;
    drive('source',0);drive('gate',kind.includes('jfet')?(inputs.off?-sign*5:0):(inputs.off?0:sign*5));
    add('supply','voltageRail',{waveform:{kind:'dc',voltage:sign*5}});
    add('load','resistor',{resistance:1000});connect('supply','p','load','a');connect('load','b','part','drain');
  }
  return M.alignGrid(d);
}
for(const kind of ['andGate','nandGate','orGate','norGate','xorGate','inverter']){
  for(const a of [0,5])for(const b of [0,5]){
    const d=deviceCircuit(kind,{a,b,input:a});M.validate(d);const compiled=A.compile(d);assert.equal(A.fromProjection(JSON.parse(compiled.canonical),d.id).canonical,compiled.canonical);
    session.loadDocument(d);const f=session.step(10);
    const truth={andGate:a&&b,nandGate:!(a&&b),orGate:a||b,norGate:!(a||b),xorGate:!!a!==!!b,inverter:!a}[kind];
    near(f.pinVoltages.part.out,truth?5:0);near(f.componentCurrents.part,-(truth?.005:0));
    session.reset();near(session.step(10).pinVoltages.part.out,truth?5:0);
  }
}
for(const kind of ['npn','pnp','nmos','pmos','njfet','pjfet']){
  for(const off of [false,true]){
    const d=deviceCircuit(kind,{off});M.validate(d);const compiled=A.compile(d);assert.equal(A.fromProjection(JSON.parse(compiled.canonical),d.id).canonical,compiled.canonical);
    session.loadDocument(d);const frame=session.step(20);
    const output=frame.pinVoltages.part[kind==='npn'||kind==='pnp'?'collector':'drain'];
    assert.ok(Number.isFinite(output),kind+' finite voltage');
    if(off)assert.ok(Math.abs(Math.abs(output)-5)<.01,kind+' cutoff voltage '+output);else assert.ok(Math.abs(output)<4.8,kind+' conducts: '+output);
    if(kind==='npn'||kind==='pnp'){
      const baseCurrent=frame.componentCurrents.baseR,collectorCurrent=frame.componentCurrents.load;
      if(!off)near(collectorCurrent/baseCurrent,100,.1);
    }
    session.reset();near(session.step(20).pinVoltages.part[kind==='npn'||kind==='pnp'?'collector':'drain'],output);
  }
}
console.log('Semiconductor and logic checks passed: NPN/PNP gain, MOSFET/JFET polarities and cutoff, all gate truth tables, projection roundtrip and reset.');
