import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "../apps/simulator/node_modules/vite/dist/node/index.js";
import {
  createTypeScriptLoader,
  React,
  renderToStaticMarkup,
} from "./typescript_module.mjs";
const load = createTypeScriptLoader();
const { validateSymbolSource, validateWaveformSource } = load(
  new URL("../apps/simulator/scripts/symbol-source.ts", import.meta.url),
);
const root = new URL("../packages/circuit-symbols/src/", import.meta.url);
const files = readdirSync(root).filter((f) => f.endsWith(".tsx"));
for (const file of files)
  validateSymbolSource(
    readFileSync(new URL(file, root), "utf8"),
    file.slice(0, -4),
  );
const resistor = readFileSync(new URL("resistor.tsx", root), "utf8");
assert.throws(
  () =>
    validateSymbolSource(
      resistor + "\nexport const broken = <rect",
      "resistor",
    ),
  /\d+:\d+/,
);
assert.throws(
  () =>
    validateSymbolSource(resistor.replace('"resistor"', '"other"'), "resistor"),
  /kind/,
);
assert.throws(
  () =>
    validateSymbolSource(
      resistor.replace("export function Symbol", "function Symbol"),
      "resistor",
    ),
  /Symbol export/,
);
assert.throws(
  () =>
    validateSymbolSource(
      resistor.replace("pins: {", "pins: null, unused: {"),
      "resistor",
    ),
  /pins object/,
);
const appRoot = fileURLToPath(new URL("../apps/simulator/", import.meta.url));
const server = await createServer({
  root: appRoot,
  configFile: appRoot + "vite.config.ts",
  server: { middlewareMode: true, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: "silent",
});
try {
  const { default: App } = await server.ssrLoadModule(
    "/src/symbol-workbench/App.tsx",
  );
  const initialPage = renderToStaticMarkup(React.createElement(App));
  assert.ok(
    initialPage.includes("Symbol workbench"),
    "Workbench renders before any source has loaded",
  );
  assert.ok(
    initialPage.includes("Loading source"),
    "Initial loading state renders without a failure record",
  );
  assert.ok(
    !initialPage.includes("IN GOOD COMPANY"),
    "Comparison panel is removed",
  );
  assert.ok(
    initialPage.includes("Passive Components"),
    "Sidebar renders Add menu categories",
  );
  const { libraryGroups } = await server.ssrLoadModule(
    "/src/symbol-workbench/libraryGroups.ts",
  );
  const groups = libraryGroups(files.map((file) => file.slice(0, -4)));
  const allKinds = groups.flatMap((group) => group.kinds);
  assert.equal(allKinds.length, files.length, "All symbols remain browsable");
  assert.equal(
    new Set(allKinds).size,
    files.length,
    "Presets do not duplicate source symbols",
  );
  assert.ok(
    groups
      .find((group) => group.label === "Passive Components")
      .kinds.includes("capacitor"),
  );
  assert.ok(
    groups
      .find((group) => group.label === "Passive Components")
      .kinds.includes("pushSwitch"),
  );
  assert.ok(
    groups
      .find((group) => group.label === "Inputs and Sources")
      .kinds.includes("voltageSource"),
  );
  const { sourceCoordinates, snapPreviewPoint, formatCoordinates } =
    await server.ssrLoadModule("/src/symbol-workbench/previewGeometry.ts");
  for (const scale of [1, 3.125])
    for (const rotation of [0, 90, 180, 270])
      for (const mirror of [false, true]) {
        const x = 15,
          y = -40,
          radians = (rotation * Math.PI) / 180;
        const mx = x * scale * (mirror ? -1 : 1),
          my = y * scale;
        const result = sourceCoordinates(
          mx * Math.cos(radians) - my * Math.sin(radians),
          mx * Math.sin(radians) + my * Math.cos(radians),
          rotation,
          mirror,
          scale,
        );
        assert.ok(
          Math.abs(result.x - x) < 1e-8 && Math.abs(result.y - y) < 1e-8,
          "Crosshair reports source coordinates across rotations, mirroring and scales",
        );
      }
  for (const scale of [1, 3.125])
    for (const rotation of [0, 90, 180, 270])
      for (const mirror of [false, true]) {
        const snapped = snapPreviewPoint(15.49, -40.6, rotation, mirror, scale);
        const local = sourceCoordinates(
          snapped.x,
          snapped.y,
          rotation,
          mirror,
          scale,
        );
        const original = sourceCoordinates(
          15.49,
          -40.6,
          rotation,
          mirror,
          scale,
        );
        assert.ok(
          Math.abs(local.x - Math.round(original.x)) < 1e-8 &&
            Math.abs(local.y - Math.round(original.y)) < 1e-8,
          "Crosshairs snap to whole artwork coordinates",
        );
      }
  for (const step of [1, 5, 10, 25, 50, 7])
    for (const scale of [1, 3.125])
      for (const rotation of [0, 90, 180, 270])
        for (const mirror of [false, true]) {
          const original = sourceCoordinates(
            -33.4,
            78.9,
            rotation,
            mirror,
            scale,
          );
          const snapped = snapPreviewPoint(
            -33.4,
            78.9,
            rotation,
            mirror,
            scale,
            step,
          );
          const local = sourceCoordinates(
            snapped.x,
            snapped.y,
            rotation,
            mirror,
            scale,
          );
          const x = Math.round(original.x / step) * step,
            y = Math.round(original.y / step) * step;
          assert.ok(
            Math.abs(local.x - x) < 1e-8 && Math.abs(local.y - y) < 1e-8,
            "Configurable grid snaps in source units",
          );
          assert.equal(
            formatCoordinates(local.x, local.y),
            `${x} ${y}`,
            "Clipboard text matches snapped coordinates without floating point residue",
          );
        }
  assert.equal(formatCoordinates(-0.00000000001, 15.000000001), "0 15");
  assert.ok(
    initialPage.includes("Snap grid spacing"),
    "Preview exposes a configurable snap control",
  );
  assert.ok(
    initialPage.includes('data-slot="button"') &&
      initialPage.includes('data-slot="input"'),
    "Workbench uses shared shadcn controls",
  );
  assert.ok(
    initialPage.includes("Fit symbol") && initialPage.includes("Pan preview"),
    "Viewport exposes fit and pan controls",
  );
  const { zoomCamera, wheelCamera, panCamera, isPanStart } =
    await server.ssrLoadModule("/src/editor/viewport.ts");
  const { core } = await server.ssrLoadModule("/src/editor/core.ts");
  const camera = { x: 150, y: 100, scale: 0.448 },
    anchor = { x: 350, y: 180 };
  for (const factor of [0.001, 0.8, 1.2, 100]) {
    const zoomed = zoomCamera(camera, anchor, factor),
      original = core.geometry.zoom(camera, anchor, factor);
    assert.equal(zoomed.x, original.x);
    assert.equal(zoomed.y, original.y);
    assert.equal(zoomed.scale, original.scale);
    assert.ok(
      Math.abs(
        (anchor.x - zoomed.x) / zoomed.scale -
          (anchor.x - camera.x) / camera.scale,
      ) < 1e-8,
      "Zoom anchors the pointer position",
    );
  }
  const scroll = wheelCamera(
    camera,
    { deltaX: 20, deltaY: -30, ctrlKey: false, metaKey: false },
    anchor,
  );
  assert.equal(scroll.x, 130);
  assert.equal(scroll.y, 130);
  assert.equal(scroll.scale, camera.scale);
  for (const modifier of ["ctrlKey", "metaKey"]) {
    const actual = wheelCamera(
      camera,
      {
        deltaX: 0,
        deltaY: -10,
        ctrlKey: false,
        metaKey: false,
        [modifier]: true,
      },
      anchor,
    );
    assert.equal(
      actual.scale,
      zoomCamera(camera, anchor, Math.exp(0.08)).scale,
    );
  }
  assert.equal(
    zoomCamera(camera, anchor, 100, { min: 0.064, max: 16 }).scale,
    16,
    "Preview supports close artwork inspection",
  );
  const panned = panCamera(camera, { x: 10, y: 20 }, { x: 60, y: 5 });
  assert.equal(panned.x, 200);
  assert.equal(panned.y, 85);
  assert.equal(panned.scale, camera.scale);
  assert.ok(
    isPanStart(1, "select", false) &&
      isPanStart(0, "select", true) &&
      isPanStart(0, "pan", false),
  );
  assert.ok(!isPanStart(0, "select", false) && !isPanStart(2, "pan", true));
  const route = server.middlewares.stack.find(
    (layer) =>
      layer.handle.toString().includes("pathname") &&
      layer.handle.toString().includes("/symbols"),
  ).handle;
  for (const url of ["/symbols", "/symbols/", "/symbols.html", "/editor"]) {
    const req = { url };
    let next = false;
    route(req, {}, () => {
      next = true;
    });
    assert.equal(req.url, "/index.html");
    assert.ok(next, "Both routes mount the main React app");
  }
  const handler = server.middlewares.stack.find(
    (layer) => layer.route === "/__symbols",
  ).handle;
  async function request(
    url,
    method = "GET",
    body,
    origin = "http://localhost:5173",
  ) {
    let result;
    const req = {
      url,
      method,
      headers: { host: "localhost:5173", origin },
      async *[Symbol.asyncIterator]() {
        if (body) yield JSON.stringify(body);
      },
    };
    const res = {
      statusCode: 200,
      setHeader() {},
      end(text) {
        result = { status: this.statusCode, ...JSON.parse(text) };
      },
    };
    await handler(req, res);
    return result;
  }
  assert.equal((await request("/missing")).status, 404);
  assert.equal((await request("/resistor")).source, resistor);
  assert.equal(
    (
      await request(
        "/resistor/preview",
        "POST",
        { draft: resistor },
        "https://example.com",
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request("/resistor/preview", "POST", {
        draft: resistor + "\n<broken",
      })
    ).status,
    400,
  );
  assert.equal(
    (await request("/resistor", "POST", { source: "stale", draft: resistor }))
      .status,
    409,
  );
  for (const kind of ["resistor", "npn", "led", "counter"]) {
    const source = readFileSync(new URL(kind + ".tsx", root), "utf8");
    const draft =
      source + '\nexport const previewMarker = "unsaved preview";\n';
    const preview = await request(`/${kind}/preview`, "POST", { draft });
    assert.equal(preview.status, 200);
    const transformed = await server.transformRequest(preview.url);
    assert.ok(transformed.code.includes("function Symbol"));
    assert.ok(
      transformed.code.includes("unsaved preview"),
      "Vite compiles the in-memory draft, not the saved source",
    );
    assert.ok(
      transformed.code.includes("/packages/circuit-symbols/svg.tsx"),
      `${kind}: relative helpers resolve`,
    );
    assert.equal(
      readFileSync(new URL(kind + ".tsx", root), "utf8"),
      source,
      "Preview must not write source",
    );
    const module = await server.environments.client.moduleGraph.getModuleByUrl(
      preview.url,
    );
    assert.ok(
      module.id.startsWith("\0symbol-workbench:"),
      "Drafts use virtual modules, separate from saved files",
    );
  }
  const glyphFile = new URL("../waveforms.tsx", root);
  const glyphSource = readFileSync(glyphFile, "utf8");
  validateWaveformSource(glyphSource);
  const savedGlyphs = await server.ssrLoadModule(
    "/@fs" + fileURLToPath(glyphFile),
  );
  const dcGlyph = renderToStaticMarkup(
    React.createElement(savedGlyphs.WaveformGlyph, {
      waveform: { kind: "dc" },
    }),
  );
  assert.throws(
    () =>
      validateWaveformSource(
        glyphSource.replace(
          "export function WaveformGlyph",
          "function WaveformGlyph",
        ),
      ),
    /WaveformGlyph/,
  );
  assert.throws(
    () => validateWaveformSource(glyphSource + "\n<broken"),
    /\d+:\d+/,
  );
  assert.equal((await request("/waveformGlyphs")).source, glyphSource);
  assert.equal(
    (
      await request("/waveformGlyphs", "POST", {
        source: "stale",
        draft: glyphSource,
      })
    ).status,
    409,
  );
  const { waveformChoices, previewWaveform } = await server.ssrLoadModule(
    "/src/symbol-workbench/waveformPreview.ts",
  );
  assert.equal(previewWaveform("dc").voltage, 5);
  assert.equal(previewWaveform("square").dutyCycle, 0.5);
  assert.equal(previewWaveform("sine", { amplitude: 4 }).amplitude, 4);
  for (const kind of ["voltageSource", "voltageRail"]) {
    const source = readFileSync(new URL(kind + ".tsx", root), "utf8");
    const glyphDraft = glyphSource.replace(
      /(sine:\s*`\s*)M\s+-?\d+(?:\.\d+)?\s+[-\d.]+/,
      "$1M -123 0",
    );
    const result = await request(`/${kind}/preview`, "POST", {
      draft: source,
      glyphDraft,
    });
    assert.equal(result.status, 200);
    const transformed = await server.transformRequest(result.url);
    assert.ok(
      transformed.code.includes(":glyph.tsx"),
      "Voltage source imports its in-memory glyph draft",
    );
    const module = await server.ssrLoadModule(result.url);
    for (const [waveformKind] of waveformChoices) {
      const drawing = renderToStaticMarkup(
        React.createElement(module.Symbol, {
          parameters: {
            ...module.metadata.parameters,
            waveform: previewWaveform(waveformKind),
          },
        }),
      );
      assert.ok(!drawing.includes("NaN"));
      if (waveformKind === "dc" && kind === "voltageRail") {
        assert.match(drawing, /M -30 -50\s+L 0 -100, 30 -50/);
        assert.doesNotMatch(drawing, /<circle/);
      } else if (waveformKind === "dc")
        assert.ok(drawing.includes(dcGlyph), "DC uses the authored glyph");
      else
        assert.ok(
          !drawing.includes(dcGlyph),
          "AC uses its waveform instead of the DC glyph",
        );
      if (waveformKind === "sine")
        assert.ok(
          drawing.includes("M -123 0"),
          "Unsaved glyph changes render in the source body",
        );
    }
    assert.equal(
      readFileSync(glyphFile, "utf8"),
      glyphSource,
      "Preview never writes the shared glyph file",
    );
  }
  console.log(
    `Symbol source workbench passed: all ${files.length} sources validate; static/dynamic drafts compile through Vite without writing files; syntax errors, kind/export protection, stale saves and origin checks pass.`,
  );
} finally {
  await server.close();
}
