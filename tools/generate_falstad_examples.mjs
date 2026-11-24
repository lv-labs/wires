import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import core from '../packages/circuit-core/index.mjs';
import { createEngine } from './engine_node_runtime.mjs';

const upstream = new URL('../engine/upstream/src/com/lushprojects/circuitjs1/public/', import.meta.url);
const destination = new URL('../apps/simulator/src/editor/menu/', import.meta.url);
const worker = fileURLToPath(new URL('../build/engine-worker/', import.meta.url));
const menu = [];
const groups = [menu];
const documents = new Map();
const blocked = new Map();
const scopeWarnings = new Set();
let entries = 0;
let available = 0;

function checkCircuit(document) {
  if (!document.electrical.components.length) return;
  const compiled = core.adapter.compile(document);
  const editor = core.editing.create(document, () => {}, { wireSections: true });
  editor.replace(document);
  if (core.adapter.compile(editor.document).canonical !== compiled.canonical) {
    throw new Error('Opening the example changed its electrical connections');
  }
  const session = core.adapter.createSession(createEngine(worker));
  session.loadDocument(editor.document);
  const { channels, unresolved } = core.geometry.scopeChannels(editor.document);
  if (unresolved.length) throw new Error('Opening the example left a scope trace unresolved');
  const acquisition = core.signals.create();
  const descriptors = acquisition.setChannels(channels);
  const delay = document.electrical.components.reduce((longest, component) =>
    component.kind === 'transmissionLine' ? Math.max(longest, component.parameters.delay) : longest, 0);
  const steps = Math.max(100, Math.ceil(delay / document.simulation.timeStep) + 2);
  let frame;
  for (let remaining = steps; remaining > 0; remaining -= 10000) {
    frame = session.step(Math.min(remaining, 10000), descriptors);
  }
  const voltages = Object.values(frame.pinVoltages).flatMap(pins => Object.values(pins));
  if (!Number.isFinite(frame.time) || frame.time <= 0 || !voltages.every(Number.isFinite)) {
    throw new Error('Simulation did not produce a finite frame');
  }
}

for (const raw of readFileSync(new URL('setuplist.txt', upstream), 'utf8').split(/\r\n?|\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  if (line.startsWith('+')) {
    const group = { title: line.slice(1), children: [] };
    groups.at(-1).push(group);
    groups.push(group.children);
    continue;
  }
  if (line === '-') {
    if (groups.length === 1) throw new Error('Unexpected submenu close in setuplist.txt');
    groups.pop();
    continue;
  }
  const match = /^>?([\w.-]+\.txt)\s+(.+)$/.exec(line);
  if (!match) throw new Error(`Invalid example menu entry ${line}`);
  const [, file, title] = match;
  entries++;
  if (!documents.has(file) && !blocked.has(file)) {
    const text = readFileSync(new URL(`circuits/${file}`, upstream), 'utf8');
    const result = core.falstad.importText(text, { id: `falstad:${file}`, title });
    try {
      if (!result.document) throw new Error(result.diagnostics.find(d => d.severity === 'error')?.message ?? 'Import produced no document');
      checkCircuit(result.document);
      documents.set(file, result.document);
      if (result.diagnostics.some(d => d.code === 'UNSUPPORTED_SCOPE' || d.code === 'SCOPE_LIMIT')) {
        scopeWarnings.add(file);
      }
    } catch (error) {
      blocked.set(file, error.message);
    }
  }
  const enabled = documents.has(file);
  groups.at(-1).push({ title, file, enabled, ...(scopeWarnings.has(file) ? { scopeWarning: true } : {}) });
  if (enabled) available++;
}
if (groups.length !== 1) throw new Error('Unclosed submenu in setuplist.txt');

const basics = menu.find(entry => entry.title === 'Basics');
if (!basics?.children.length || !basics.children.every(entry => documents.has(entry.file))) {
  throw new Error('Every Falstad Basics example must be playable');
}
const sorted = [...documents].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
const saved = sorted.map(([file, document]) => `  ${JSON.stringify(file)}: ${JSON.stringify(document)}`);
for (const [file, output] of [
  ['falstad-example-menu.json', `${JSON.stringify(menu, null, 2)}\n`],
  ['falstad-examples.json', `{\n${saved.join(',\n')}\n}\n`],
]) {
  const path = new URL(file, destination);
  if (process.argv.includes('--check')) {
    if (readFileSync(path, 'utf8') !== output) throw new Error('Run pnpm examples:generate to refresh the Falstad example library');
  } else {
    writeFileSync(path, output);
  }
}
console.log(`${available}/${entries} Falstad menu entries available (${documents.size} circuit files).`);
if (process.argv.includes('--report')) {
  for (const [file, reason] of blocked) console.log(`${file}: ${reason}`);
}
