import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adapter, catalog, editing, falstad } from '../packages/circuit-core/index.mjs';
import { createEngine } from './engine_node_runtime.mjs';
import { chipBatchCircuit } from './chip_batch_fixtures.mjs';

const session = adapter.createSession(createEngine());
const near = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
const kinds = Object.keys(catalog.definitions).filter(catalog.discreteChipKind);

for (const kind of kinds) {
  const editor = editing.create(editing.empty());
  editor.addComponent(kind, 0, 0);
  const d = editor.document, component = d.electrical.components[0];
  assert.deepEqual(catalog.componentPins(component), catalog.definitions[kind].pins);
  editing.validate(JSON.parse(JSON.stringify(d)));
  assert.equal(editing.hit(d, {x: 0, y: 0})?.id, component.id);
  assert.equal(adapter.compile(d).mapping[0].kind, kind);
}

function chip(kind, params, inputs, outputs) {
  const def = catalog.definitions[kind];
  const p = { ...def.parameters, ...params };
  const loads = outputs ?? catalog.discreteChipLayout(kind, p).pins.filter(pin => pin[3]).map(pin => pin[0]);
  return chipBatchCircuit(kind, p, inputs, loads);
}
function run(kind, params, inputs, outputs) {
  session.loadDocument(chip(kind, params, inputs, outputs));
  return session.step(10).pinVoltages.part;
}

for (let selected = 0; selected < 4; selected++) {
  const select = {S0: (selected & 1) * 5, S1: (selected >> 1) * 5};
  for (const strobe of [0, 5]) {
    const mux = run('multiplexer', {highVoltage: 3.3, invertedOutput: true, strobePin: true},
      {...select, [`I${selected}`]: 5, strobe});
    near(mux.Q, strobe ? 0 : 3.3);
    near(mux.Qn, strobe ? 3.3 : 0);
  }
  const demux = run('demultiplexer', {}, {...select, input: 5});
  for (let i = 0; i < 4; i++) near(demux[`Q${i}`], i === selected ? 5 : 0);
}
const wide = run('multiplexer', {selectBits: 6}, {I63: 5, S0: 5, S1: 5, S2: 5, S3: 5, S4: 5, S5: 5});
near(wide.Q, 5);

const muxDoc = chip('multiplexer', {}, {I2: 5, S1: 5});
session.loadDocument(muxDoc);
const before = session.step(10);
muxDoc.electrical.components[0].parameters.highVoltage = 3.3;
session.updateProjection(JSON.parse(adapter.compile(muxDoc).canonical), muxDoc.id);
const after = session.step(10);
assert.ok(after.time > before.time);
near(after.pinVoltages.part.Q, 3.3);

const analog = run('analogMultiplexer', {onResistance: 100, offResistance: 1e10}, {I1: 2, S0: 5}, ['out']);
near(analog.out, 2 * (1 / 100) / (1 / 100 + 1 / 1000 + 3 / 1e10));

const dac = run('dac', {bits: 3, lsbFirst: true}, {D0: 5, D2: 5, reference: 7});
near(dac.out, 5);
const adc = run('adc', {bits: 3, lsbFirst: true, highVoltage: 3.3}, {input: 5.9, reference: 7});
near(adc.D0, 3.3);
near(adc.D1, 0);
near(adc.D2, 3.3);
const saturated = run('adc', {bits: 3}, {input: 10, reference: 7});
for (const pin of ['D0', 'D1', 'D2']) near(saturated[pin], 5);

for (const segmentMode of [0, 1, 2]) {
  const p = {segmentMode, blankPin: true, blankOnF: true};
  const zero = run('sevenSegmentDecoder', p, {blank: 5});
  near(zero.a, 5);
  const blank = run('sevenSegmentDecoder', p, {});
  const fifteen = run('sevenSegmentDecoder', p, {I0: 5, I1: 5, I2: 5, I3: 5, blank: 5});
  for (let i = 0; i < [7, 14, 16][segmentMode]; i++) {
    const segment = String.fromCharCode(97 + i);
    near(blank[segment], 0);
    near(fifteen[segment], 0);
  }
}

near(run('phaseComparator', {}, {I1: 5}).out, 5);
near(run('phaseComparator', {}, {I2: 5}).out, 0);
const sipo = run('sipoShift', {bits: 3, initialValue: 2}, {clock: 5, data: 5});
near(sipo.Q0, 5);
near(sipo.Q1, 0);
near(sipo.Q2, 5);
const piso = run('pisoShift', {bits: 3}, {load: 5, D2: 5, D1: 0, D0: 5});
near(piso.out, 5);
const oldPiso = run('pisoShift', {bits: 3, serialInput: false}, {load: 5, clock: 5, D2: 5});
near(oldPiso.out, 5);
const widePiso = run('pisoShift', {bits: 30}, {load: 5, D29: 5});
near(widePiso.out, 5);

const sequence = chip('sequenceGenerator', {sequence: '101', playOnce: true, resetPin: false},
  {clock: {kind: 'square', amplitude: 2.5, offset: 2.5, frequency: 1000, dutyCycle: .5}});
session.loadDocument(sequence);
const pulseLevels = [];
for (let i = 0; i < 4; i++) {
  if (i === 0) session.step(99);
  else session.step(200);
  pulseLevels.push(session.step(1).pinVoltages.part.Q);
}
assert.deepEqual(pulseLevels, [5, 0, 5, 0]);
const longSequence = '1'.repeat(33);
near(run('sequenceGenerator', {sequence: longSequence}, {reset: 5}).Q, 5);
near(run('sequenceGenerator', {sequence: ''}, {clock: 5}).Q, 0);

const mono = chip('monostable', {delay: .0001}, {trigger: 5});
session.loadDocument(mono);
near(session.step(5).pinVoltages.part.Q, 5);
const ended = session.step(100).pinVoltages.part;
near(ended.Q, 0);
near(ended.Qn, 5);

function imported(text) {
  const result = falstad.importText(text);
  assert.ok(result.document, JSON.stringify(result.diagnostics));
  return result.document;
}
for (const [legacy, xml] of [
  ['184 64 96 128 96 6 3', '<mux x="64 96 128 96" f="6" se="3"/>'],
  ['185 64 96 128 96 0 3', '<dmux x="64 96 128 96" se="3"/>'],
  ['167 64 96 128 96 8192 3 3.3', '<ADC x="64 96 128 96" bi="3" hv="3.3"/>'],
  ['197 64 96 128 96 6 2', '<SevenSegDecoder x="64 96 128 96" f="6" sgt="2"/>'],
  ['432 64 96 128 96 0 2 100 1e10 2.5', '<AnalogMux x="64 96 128 96" ron="100"/>'],
  ['189 64 96 128 96 0 3 5', '<SipoShift x="64 96 128 96" bi="3" dt="5"/>'],
  ['186 64 96 128 96 2 3 5', '<PisoShift x="64 96 128 96" f="2" bi="3" dt="5"/>'],
  ['188 64 96 128 96 14 3 5', '<SeqGen x="64 96 128 96" f="14" bc="3" dt="5"/>'],
  ['c 64 96 128 96 6 0.000001 0 0 10', '<c x="64 96 128 96" f="2" c="0.000001" iv="0" sr="10"/>'],
  ['209 64 96 128 96 6 0.000001 0 0 10 1', '<pc x="64 96 128 96" f="2" c="0.000001" iv="0" sr="10"/>'],
  ['412 64 96 128 96 2 4_2.87e-11_0_0.001_0 4_1e-13_0_0.001_0 0_0.0025_0_0_0 0_6.4',
    '<cr x="64 96 128 96" f="3" pc="2.87e-11" sc="1e-13" in=".0025" r="6.4"><c ix="0" vd=".02"/></cr>'],
  ['430 64 96 128 96 2 1 false', '<CrossSwitch x="64 96 128 96" f="2" p="1"/>'],
  ['422 64 96 128 96 0 .001 2.25 3.3', '<DelayBuffer x="64 96 128 96" dl=".001" th="2.25" hv="3.3"/>'],
  ['180 64 96 128 96 1 2 1e8 1e7 3.3', '<ts x="64 96 128 96" f="1" ron="2" roff="1e8" rog="1e7" hi="3.3"/>'],
  ['Gyrator 64 96 128 96 0', '<Gyrator x="64 96 128 96"/>'],
  ['194 64 96 128 96 0 true 0.001', '<Monostable x="64 96 128 96" rt="true" dl=".001"/>'],
]) {
  const text = imported(legacy), converted = imported(`<cir>${xml}</cir>`);
  assert.deepEqual(converted.electrical.components[0].parameters, text.electrical.components[0].parameters);
  assert.deepEqual(Object.values(converted.layout.components), Object.values(text.layout.components));
  assert.deepEqual(converted.layout.junctions, text.layout.junctions);
  assert.deepEqual(converted.layout.wires, text.layout.wires);
}
for (const text of ['184 0 0 64 0 0 7', '184 0 0 64 0 8 2', '<cir><mux x="0 0 64 0" im="2"/></cir>',
  '<cir><ADC x="0 0 64 0" bo="2"/></cir>', '197 0 0 64 0 0 3', '194 0 0 64 0 0 false -1']) {
  assert.equal(falstad.importText(text).document, null, text);
}
for (const position of [0, 1]) {
  for (const onResistance of [0, 10]) {
    const cross = run('crossSwitch', {position, onResistance}, {inA: 5, inB: 2}, ['outA', 'outB']);
    near(cross.outA, (position ? 2 : 5) * 1000 / (1000 + onResistance));
    near(cross.outB, (position ? 5 : 2) * 1000 / (1000 + onResistance));
  }
}

const enabled = run('tristateBuffer', {onResistance: 10, highVoltage: 3.3, pulldownResistance: 0},
  {input: 5, enable: 5}, ['out']);
near(enabled.out, 3.3 * 1000 / 1010);
const disabled = run('tristateBuffer', {offResistance: 1000000, pulldownResistance: 0},
  {input: 5, enable: 0}, ['out']);
near(disabled.out, 5 * 1000 / 1001000);

const delayed = chip('delayBuffer', {delay: .0001},
  {input: {kind: 'square', amplitude: 2.5, offset: 2.5, frequency: 1000, dutyCycle: .5}}, ['out']);
session.loadDocument(delayed);
near(session.step(90).pinVoltages.part.out, 5);
near(session.step(18).pinVoltages.part.out, 5);
near(session.step(50).pinVoltages.part.out, 0);

const gyrator = run('gyrator', {}, {port1Plus: 2, port1Minus: 0, port2Minus: 0}, ['port2Plus']);
near(gyrator.port2Plus, 2);

for (const [type, polar] of [['c', ''], ['209', ' 1']]) {
  const sample = imported(`v 64 160 64 96 0 0 40 1 0 0 .5
${type} 64 96 192 96 6 .000001 0 0 10${polar}
g 64 160 64 192 0
w 64 160 192 160 0
w 192 160 192 96 0`);
  const capacitor = sample.electrical.components.find(part => part.kind.endsWith('Capacitor') || part.kind === 'capacitor');
  session.loadDocument(sample);
  const frame = session.step(1);
  near(frame.componentCurrents[capacitor.id], 1 / (10 + sample.simulation.timeStep / .000001));
  capacitor.parameters.seriesResistance = 20;
  session.updateProjection(JSON.parse(adapter.compile(sample).canonical), sample.id);
  const changed = session.step(1);
  assert.ok(changed.time > frame.time);
  assert.ok(changed.componentCurrents[capacitor.id] < frame.componentCurrents[capacitor.id]);
}

const upstream = new URL('../engine/upstream/src/com/lushprojects/circuitjs1/public/circuits/', import.meta.url);
for (const file of ['piso-sr.txt', 'hfadc.txt', 'phasecomp.txt', 'pll.txt', 'gyratorelm.txt', 'crystalosc.txt', 'crystalosc2.txt']) {
  const document = imported(readFileSync(new URL(file, upstream), 'utf8'));
  session.loadDocument(document);
  assert.ok(session.step(100).time > 0, file);
}
console.log(`Verified placement, text/XML import, live edits and native simulation of ${kinds.length} individual-pin chips and five other components.`);
