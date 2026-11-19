import assert from 'node:assert/strict';
import { editing } from '../packages/circuit-core/index.mjs';

const editor = editing.create(editing.empty());
const componentId = editor.addComponent('resistor', 0, 0);
const probeId = editor.addProbe({ kind: 'pin', componentId, pinId: 'a' });
const document = editor.document;
const component = editing.token('component', componentId);
const probe = editing.token('probe', probeId);

const fragment = editing.copySelection(document, new Set([component]));
assert.deepEqual(fragment.probes, [], 'Copying a component leaves its voltage probe behind');
const duplicate = structuredClone(document);
assert.equal(editing.pasteSelection(duplicate, fragment).size, 1);
assert.deepEqual(duplicate.probes, document.probes);
editing.validate(duplicate);

const explicit = editing.copySelection(document, new Set([component, probe]));
assert.deepEqual(explicit.probes, document.probes, 'An explicitly selected probe can travel with its target');
const pasted = editing.pasteSelection(duplicate, explicit);
assert.equal(pasted.size, 2);
assert.equal(duplicate.probes.at(-1).positive.componentId, duplicate.electrical.components.at(-1).id);
editing.validate(duplicate);
