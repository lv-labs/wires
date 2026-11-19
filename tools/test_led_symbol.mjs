import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createServer } from "../apps/simulator/node_modules/vite/dist/node/index.js";
import {
  createTypeScriptLoader,
  React,
  renderToStaticMarkup,
} from "./typescript_module.mjs";
import { editing } from "../packages/circuit-core/index.mjs";
const { Symbol: Led, metadata } = createTypeScriptLoader()(
  new URL("../packages/circuit-symbols/src/led.tsx", import.meta.url),
);
const draw = (props) =>
  renderToStaticMarkup(
    React.createElement("svg", null, React.createElement(Led, props)),
  );
for (const highlighted of [false, true]) {
  const off = draw({ highlighted, current: 0 }),
    on = draw({ highlighted, current: metadata.parameters.maxCurrent });
  assert.ok(off.includes('fill="rgb(0,0,0)"'));
  assert.ok(on.includes('fill="rgb(255,0,0)"'));
  assert.ok(
    draw({ highlighted, current: -1 }).includes('fill="rgb(0,0,0)"'),
    "Reverse current stays dark",
  );
  assert.ok(
    draw({
      highlighted,
      current: 1,
      parameters: { ...metadata.parameters, red: 0, green: 1, blue: 0 },
    }).includes('fill="rgb(0,255,0)"'),
    "Authored colour and current brightness remain available",
  );
  assert.ok(
    on.includes('r="55" fill="transparent" stroke="none" pointer-events="all"'),
    "Stable hover area survives the drawing change",
  );
  for (const pin of Object.values(metadata.pins))
    assert.ok(
      on.includes(`M ${pin[0]} ${pin[1]}`),
      "Pin endpoints do not change",
    );
  if (highlighted) {
    assert.ok(on.includes("<polygon"));
    assert.ok(on.includes("L 12 -80"));
  } else {
    assert.ok(!on.includes("<polygon"));
    assert.match(
      on,
      /<circle\b[^>]*fill="rgb\(255,0,0\)"/,
      "Indicator uses the authored circle body",
    );
    assert.ok(on.includes('fill="rgb(255,0,0)"'));
  }
}
const lit = draw({ current: metadata.parameters.maxCurrent });
assert.ok(
  lit.includes("<feGaussianBlur") && lit.includes('stdDeviation="12"'),
  "Lit indicator has a soft halo",
);
assert.ok(
  lit.includes('filterUnits="userSpaceOnUse"') && lit.includes('width="300"'),
  "Filter has room for the halo without clipping",
);
assert.ok(
  !draw({ current: 0 }).includes("<filter"),
  "Off LEDs do not allocate a blur filter",
);
assert.ok(
  !draw({ current: -1 }).includes("<filter"),
  "Reverse current has no glow",
);
assert.ok(
  !draw({ current: 1, highlighted: true }).includes("<filter"),
  "Diode view stays crisp",
);
const disabled = draw({ current: metadata.parameters.maxCurrent, glow: false });
assert.ok(
  !disabled.includes("<filter") && disabled.includes('fill="rgb(255,0,0)"'),
  "Disabling glow preserves the indicator brightness",
);
const dim = draw({ current: metadata.parameters.maxCurrent / 10 });
assert.ok(
  Number(dim.match(/opacity="([^"]+)"/)[1]) <
    Number(lit.match(/opacity="([^"]+)"/)[1]),
  "Halo strength follows current brightness",
);
const maximum = draw({ current: metadata.parameters.maxCurrent, glow: 1 });
assert.equal(maximum, lit, "Maximum preserves the authored glow appearance");
assert.ok(
  !draw({ current: metadata.parameters.maxCurrent, glow: 0 }).includes(
    "<filter",
  ),
  "Slider off removes the filter",
);
const half = draw({ current: metadata.parameters.maxCurrent, glow: 0.5 });
assert.equal(
  Number(half.match(/opacity="([^"]+)"/)[1]),
  Number(lit.match(/opacity="([^"]+)"/)[1]) / 2,
  "Half intensity scales only halo opacity",
);
assert.ok(
  half.includes('r="70"') && half.includes('stdDeviation="12"'),
  "Authored glow spread remains unchanged",
);
const pair = renderToStaticMarkup(
  React.createElement(
    "svg",
    null,
    React.createElement(Led, { current: 0.01 }),
    React.createElement(Led, { current: 0.01 }),
  ),
);
const ids = [...pair.matchAll(/<filter id="([^"]+)"/g)].map(
  (match) => match[1],
);
assert.equal(new Set(ids).size, 2, "Each LED gets an independent filter ID");
for (const id of ids) assert.ok(pair.includes(`filter="url(#${id})"`));
const root = fileURLToPath(new URL("../apps/simulator/", import.meta.url));
const server = await createServer({
  root,
  configFile: root + "vite.config.ts",
  server: { middlewareMode: true, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: "silent",
});
try {
  const { SymbolLayer, SymbolBody } = await server.ssrLoadModule(
    "/src/editor/SymbolLayer.tsx",
  );
  const { readLedGlow, parseLedGlow } = await server.ssrLoadModule(
    "/src/editor/useLedGlow.ts",
  );
  assert.equal(readLedGlow({ getItem: () => null }), 1);
  assert.equal(readLedGlow({ getItem: () => "false" }), 0);
  assert.equal(readLedGlow({ getItem: () => "true" }), 1);
  assert.equal(
    readLedGlow({
      getItem: () => {
        throw new Error("Storage blocked");
      },
    }),
    1,
  );
  assert.equal(parseLedGlow("0.35"), 0.35);
  assert.equal(parseLedGlow("0"), 0);
  assert.equal(parseLedGlow("1"), 1);
  assert.equal(parseLedGlow("junk"), 1);
  assert.equal(parseLedGlow("-1"), 0);
  assert.equal(parseLedGlow("2"), 1);
  const { LedGlowControl } = await server.ssrLoadModule(
    "/src/editor/LedGlowControl.tsx",
  );
  const slider = renderToStaticMarkup(
    React.createElement(LedGlowControl, { value: 0.35, onChange: () => {} }),
  );
  assert.ok(
    slider.includes("Glow intensity") &&
      slider.includes("35%") &&
      slider.includes('data-slot="slider"'),
  );
  const document = editing.empty();
  document.electrical.components.push({
    id: "led",
    kind: "led",
    modelVersion: 1,
    parameters: { ...metadata.parameters },
  });
  document.layout.components.led = { x: 0, y: 0, rotation: 0, mirror: false };
  const normal = renderToStaticMarkup(
    React.createElement(
      "svg",
      null,
      React.createElement(SymbolLayer, { document, selected: [] }),
    ),
  );
  const selected = renderToStaticMarkup(
    React.createElement(
      "svg",
      null,
      React.createElement(SymbolLayer, { document, selected: ["led"] }),
    ),
  );
  assert.ok(!normal.includes("<polygon"));
  assert.ok(
    selected.includes("<polygon"),
    "Circuit selection reveals the diode body",
  );
  for (const ledGlow of [true, false]) {
    const layer = renderToStaticMarkup(
      React.createElement(
        "svg",
        null,
        React.createElement(SymbolLayer, {
          document,
          selected: [],
          ledGlow,
          frame: {
            componentCurrents: { led: 0.01 },
            componentMeasurements: {},
            pinVoltages: {},
          },
        }),
      ),
    );
    assert.equal(
      layer.includes("<feGaussianBlur"),
      ledGlow,
      "View setting reaches the LED renderer",
    );
  }
  const placement = renderToStaticMarkup(
    React.createElement(
      "svg",
      null,
      React.createElement(SymbolBody, {
        component: document.electrical.components[0],
        pose: { rotation: 90, mirror: true },
        highlighted: true,
      }),
    ),
  );
  assert.ok(
    placement.includes("<polygon"),
    "Placement/highlight signal reaches the shared symbol",
  );
} finally {
  await server.close();
}
console.log(
  "LED modes passed: indicator/diode views, current-driven optional glow, unique filters, saved preference defaults, unchanged pins and circuit view-setting wiring.",
);
