import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import {
  editing,
  geometry,
  document as documents,
  adapter,
} from "../packages/circuit-core/index.mjs";
import { createServer } from "../apps/simulator/node_modules/vite/dist/node/index.js";
import { React, renderToStaticMarkup } from "./typescript_module.mjs";
const require = createRequire(
    new URL("../apps/simulator/package.json", import.meta.url),
  ),
  ts = require("typescript"),
  exports = {};
vm.runInNewContext(
  ts.transpileModule(
    readFileSync(
      new URL("../apps/simulator/src/editor/drawings.ts", import.meta.url),
      "utf8",
    ),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2023,
      },
    },
  ).outputText,
  { exports, structuredClone },
);
const { makeDrawing, moveDrawingPoint, defaultDrawingStyle } = exports;
const plain = (value) => JSON.parse(JSON.stringify(value));
const initial = JSON.parse(
  readFileSync(
    new URL(
      "../docs/new-simulator/examples/voltage-divider.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const model = editing.create(initial, () => {}, { wireSections: true });
const before = model.document,
  projection = adapter.compile(before).canonical;
for (const kind of ["text", "line", "box", "ellipse", "polygon"]) {
  const drawing = makeDrawing(
    kind,
    { x: -1000, y: -1000 },
    { x: -600, y: -700 },
    defaultDrawingStyle,
  );
  drawing.id = kind;
  if (kind === "polygon")
    drawing.points = [
      { x: -1000, y: -1000 },
      { x: -600, y: -1000 },
      { x: -800, y: -700 },
    ];
  model.execute({ type: "addDrawing", drawing });
}
const added = model.document;
assert.equal(added.layout.drawings.length, 5);
assert.deepEqual(
  added.electrical,
  before.electrical,
  "Drawings never enter the electrical graph",
);
assert.equal(
  adapter.compile(added).canonical,
  projection,
  "Drawings do not change simulation projection",
);
const selected = new Set([geometry.token("drawing", "box")]);
const drag = editing.createDragSession(added, selected);
const moved = drag.update(100, 150);
assert.deepEqual(moved.electrical, added.electrical);
assert.deepEqual(
  moved.layout.wires,
  added.layout.wires,
  "Drawing drag leaves wire routing untouched",
);
assert.equal(
  moved.layout.drawings.find((d) => d.id === "box").points[0].x,
  -900,
);
assert.deepEqual(
  drag.cancel(),
  added,
  "Cancelled drawing drag restores exact document",
);
model.execute({
  type: "transform",
  selection: [{ kind: "drawing", id: "box" }],
  dx: 100,
  dy: 150,
});
const transformed = model.document;
assert.deepEqual(
  transformed.layout.drawings.find((d) => d.id === "box").points[0],
  { x: -900, y: -850 },
);
model.undo();
assert.deepEqual(model.document, added);
model.redo();
assert.deepEqual(model.document, transformed);
const fragment = editing.copySelection(added, selected);
assert.equal(fragment.electrical.components.length, 0);
assert.equal(fragment.layout.drawings.length, 1);
const target = editing.empty(),
  tokens = editing.pasteSelection(target, fragment);
assert.equal(tokens.size, 1);
assert.notEqual(target.layout.drawings[0].id, "box");
documents.validate(JSON.parse(JSON.stringify(target)));
model.execute({ type: "remove", selection: [{ kind: "drawing", id: "box" }] });
assert.equal(model.document.layout.drawings.length, 4);
model.undo();
assert.equal(model.document.layout.drawings.length, 5);
for (const d of added.layout.drawings) {
  const b = geometry.drawingBounds(d);
  assert.ok(b.right > b.x && b.bottom >= b.y);
  assert.ok(
    geometry
      .boxSelection(
        added,
        { x: b.x - 10, y: b.y - 10 },
        { x: b.right + 10, y: b.bottom + 10 },
      )
      .has(geometry.token("drawing", d.id)),
  );
}
const box = makeDrawing(
  "box",
  { x: 0, y: 0 },
  { x: 200, y: 150 },
  defaultDrawingStyle,
);
assert.equal(
  geometry.drawingHit(box, { x: 100, y: 75 }),
  false,
  "Unfilled boxes do not cover their interiors",
);
assert.equal(
  geometry.drawingHit({ ...box, fill: "#ff0000" }, { x: 100, y: 75 }),
  true,
);
assert.equal(geometry.drawingHit(box, { x: 100, y: 0 }), true);
const resized = moveDrawingPoint(box, 0, { x: -50, y: -100 });
assert.deepEqual(plain(resized.points), [
  { x: -50, y: -100 },
  { x: 200, y: -100 },
  { x: 200, y: 150 },
  { x: -50, y: 150 },
]);
const ellipse = makeDrawing(
  "ellipse",
  { x: 0, y: 0 },
  { x: 200, y: 100 },
  defaultDrawingStyle,
);
const centreMove = moveDrawingPoint(ellipse, 0, { x: 200, y: 200 });
assert.equal(centreMove.points[1].x - centreMove.points[0].x, 100);
const bad = structuredClone(added);
bad.layout.drawings[0].stroke = "url(https://example.com)";
assert.throws(() => documents.validate(bad), /style/);
const rotated = structuredClone(added);
editing.transformSelection(rotated, selected, 0, 0, { rotation: 90 });
assert.equal(adapter.compile(rotated).canonical, projection);
const root = fileURLToPath(new URL("../apps/simulator/", import.meta.url));
const server = await createServer({
  root,
  configFile: root + "vite.config.ts",
  server: { middlewareMode: true, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: "silent",
});
try {
  const { DrawingLayer } = await server.ssrLoadModule(
    "/src/editor/DrawingLayer.tsx",
  );
  const render = renderToStaticMarkup(
    React.createElement(
      "svg",
      null,
      React.createElement(DrawingLayer, { drawings: added.layout.drawings }),
    ),
  );
  assert.ok(
    render.includes("<polygon") &&
      render.includes("<ellipse") &&
      render.includes("<line") &&
      render.includes("<text"),
  );
  assert.ok(!render.includes("NaN"));
  const groupSelection = renderToStaticMarkup(
    React.createElement(DrawingLayer, {
      drawings: added.layout.drawings,
      selected: added.layout.drawings.map((drawing) => drawing.id),
    }),
  );
  assert.equal(
    (groupSelection.match(/data-selected="true"/g) || []).length,
    added.layout.drawings.length,
    "Every drawing in a group selection receives a blue highlight",
  );
  assert.ok(groupSelection.includes("text-blue-600 dark:text-blue-400"));
  const { SelectionHitboxes } = await server.ssrLoadModule(
    "/src/editor/SelectionHitboxes.tsx",
  );
  const hitboxes = renderToStaticMarkup(
    React.createElement(SelectionHitboxes, { document: added, scale: 0.5 }),
  );
  assert.ok(hitboxes.includes("data-selection-hitboxes"));
  assert.ok(hitboxes.includes("#ec4899") && hitboxes.includes("#3b82f6") && hitboxes.includes("#f59e0b"));
  assert.ok(!hitboxes.includes("NaN"));
  const { CircuitEditor } = await server.ssrLoadModule(
    "/src/editor/CircuitEditor.tsx",
  );
  const editor = renderToStaticMarkup(
    React.createElement(CircuitEditor, {
      initialDocument: added,
      autosave: false,
    }),
  );
  assert.ok(
    editor.includes("Draw") && editor.includes("data-sheet-drawings"),
    "Drawing menu and sheet layer mount in the real editor",
  );
} finally {
  await server.close();
}
console.log(
  "Drawings passed: separate storage, save/load, simulation invariance, drag/resize, delete, copy/paste, undo/redo, selection and real-editor rendering.",
);
