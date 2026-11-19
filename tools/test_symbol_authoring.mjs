import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { catalog, geometry } from "../packages/circuit-core/index.mjs";
import {createTypeScriptLoader, React, renderToStaticMarkup} from './typescript_module.mjs';
const load=createTypeScriptLoader();
const check = spawnSync(
  process.execPath,
  ["apps/simulator/scripts/generate-symbols.mjs", "--check"],
  { encoding: "utf8" },
);
assert.equal(check.status, 0, check.stderr);

const root = new URL("../packages/circuit-symbols/", import.meta.url);
const symbols = load(new URL("index.ts", root));
assert.deepEqual(Object.keys(symbols), Object.keys(catalog.definitions));
for (const [kind, definition] of Object.entries(catalog.definitions)) {
  const authored = load(new URL(`src/${kind}.tsx`, root));
  assert.equal(symbols[kind], authored.Symbol);
  const drawingScale = authored.metadata.drawingScale ?? 1;
  const expected = JSON.parse(JSON.stringify(authored.metadata));
  expected.pins = Object.fromEntries(Object.entries(expected.pins).map(([name, pin]) => [name, pin.map(value => value * drawingScale)]));
  if (authored.output) expected.drawingScale = drawingScale;
  assert.deepEqual(expected, definition);
  const render = (props) =>
    renderToStaticMarkup(React.createElement(symbols[kind], props));
  assert.ok(render(), `${kind}: empty symbol`);

  // Move one authored pin without changing the body. Its lead must follow it.
  for (const [pinId, pin] of Object.entries(authored.metadata.pins)) {
    const original = [...pin];
    pin[0] += 13;
    pin[1] += 7;
    assert.ok(
      render().includes(`${pin[0]} ${pin[1]}`),
      `${kind}.${pinId}: lead endpoint follows metadata`,
    );
    pin.splice(0, 2, ...original);
  }
  for (const rotation of [0, 90, 180, 270])
    for (const mirror of [false, true]) {
      const pose = { x: 128, y: 96, rotation, mirror };
      const document = {
        electrical: { components: [{ id: "part", kind }] },
        layout: { components: { part: pose } },
      };
      for (const [pinId, [x, y]] of Object.entries(authored.metadata.pins)) {
        const [rx, ry] = geometry.rotateOffset(
          x * drawingScale * (mirror ? -1 : 1),
          y * drawingScale,
          rotation,
        );
        assert.deepEqual(
          geometry.pin(document, { kind: "pin", componentId: "part", pinId }),
          { x: pose.x + rx, y: pose.y + ry },
        );
      }
    }
}

// Additional SPDT throws must retain the source's pin width and align with the headless catalog.
for (let throwCount = 2; throwCount <= 10; throwCount++) {
  const authored = load(new URL("src/spdtSwitch.tsx", root));
  const parameters = { ...authored.metadata.parameters, throwCount };
  const pins = catalog.componentPins({ kind: "spdtSwitch", parameters });
  assert.deepEqual(pins.common, [...authored.metadata.pins.common]);
  const markup = renderToStaticMarkup(React.createElement(symbols.spdtSwitch, { parameters }));
  const paths = [...markup.matchAll(/\bd="([^"]*)"/g)].map(match => (match[1].match(/[MLHVZ]|-?(?:\d*\.)?\d+/g) || []).join(" "));
  for (const [id, point] of Object.entries(pins)) {
    if (id !== "common") assert.equal(point[0], authored.metadata.pins.a[0]);
    assert.ok(paths.some(path => path.startsWith(`M ${point[0]} ${point[1]} L `)), `spdtSwitch ${throwCount}: lead ends at ${id}`);
  }
  assert.equal((markup.match(/<circle/g) || []).length, throwCount + 1);
}
// Every DPDT pole uses the same sheet-unit contact style and matching pin positions.
for (let poleCount = 1; poleCount <= 8; poleCount++) for (const position of [0, 1]) {
  const authored = load(new URL("src/dpdtSwitch.tsx", root));
  const parameters = { ...authored.metadata.parameters, poleCount, position };
  const pins = catalog.componentPins({ kind: "dpdtSwitch", parameters });
  const markup = renderToStaticMarkup(React.createElement(symbols.dpdtSwitch, { parameters }));
  const paths = [...markup.matchAll(/\bd="([^"]*)"/g)].map(match => (match[1].match(/[MLHVZ]|-?(?:\d*\.)?\d+/g) || []).join(" "));
  assert.equal(Object.keys(pins).length, poleCount * 3);
  assert.equal((markup.match(/<circle/g) || []).length, poleCount * 3);
  for (const point of Object.values(pins)) {
    assert.equal(Math.abs(point[0]), 100);
    assert.ok(paths.some(path => path.startsWith(`M ${point[0]} ${point[1]} L `)), `dpdtSwitch ${poleCount}: lead matches pin`);
  }
  const contacts = [...markup.matchAll(/<circle cx="([^"]+)"/g)].map(match => Number(match[1]));
  for (let i = 0; i < poleCount; i++) {
    const y = pins['common' + (i + 1)][1];
    assert.ok(paths.includes(`M ${contacts[i * 3]} ${y} L ${contacts[i * 3 + 1]} ${y + (position === 0 ? 50 : -50)}`), 'Each pole follows the selected contact');
  }
  assert.equal((markup.match(/stroke-dasharray="10 10"/g) || []).length, poleCount > 1 ? 1 : 0);
}

const draftPins = { common: [-200, 0], a: [200, -50], b: [200, 50] };
const previewPins = catalog.componentPins({ kind: "spdtSwitch", parameters: { throwCount: 3 } }, { pins: draftPins });
assert.deepEqual(previewPins.common, [-200, 0]);
assert.equal(previewPins.throw3[0], 200);

for (const kind of ["acSource", "acRail", "clockRail", "squareRail"]) {
  const preset = catalog.placementDefinitions[kind];
  const markup = renderToStaticMarkup(
    React.createElement(symbols[preset.kind], {
      parameters: preset.parameters,
    }),
  );
  assert.doesNotMatch(
    markup,
    />\+<\/text>/,
    `${kind}: rendered with DC polarity glyphs`,
  );
}
const annotation = renderToStaticMarkup(
  React.createElement(symbols.text, {
    parameters: { text: "<Circuit>", size: 18 },
  }),
);
assert.match(annotation, /&lt;Circuit&gt;/);
console.log(
  "Symbol authoring passed: React registry, generated metadata, lead endpoints, orientations and source presets.",
);
