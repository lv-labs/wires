import assert from "node:assert/strict";
import {
  createTypeScriptLoader,
  React,
  renderToStaticMarkup,
} from "./typescript_module.mjs";
const load = createTypeScriptLoader();
const render = (element) =>
  renderToStaticMarkup(React.createElement("svg", null, element));
const { SweepGlyph, idleSweepProgress, sweepSinePath } = load(
  new URL("../packages/circuit-symbols/waveforms.tsx", import.meta.url),
);
const { Symbol: Sweep, metadata } = load(
  new URL("../packages/circuit-symbols/src/sweepSource.tsx", import.meta.url),
);
for (const [time, progress] of [
  [0, 0],
  [500, 0.5],
  [1000, 1],
  [1500, 0.5],
  [2000, 0],
  [2500, 0.5],
])
  assert.equal(idleSweepProgress(time), progress);
assert.ok(
  sweepSinePath(0).includes("M -50 0"),
  "The low-frequency wave starts at the circle edge",
);
assert.ok(
  /S 35 30, 50 0/.test(sweepSinePath(0)),
  "The low-frequency wave reaches the opposite edge",
);
assert.notEqual(sweepSinePath(0), sweepSinePath(0.5));
assert.notEqual(sweepSinePath(0.5), sweepSinePath(1));
assert.equal(
  sweepSinePath(-1),
  sweepSinePath(0),
  "Frequency below the range clamps to one cycle",
);
assert.equal(
  sweepSinePath(2),
  sweepSinePath(1),
  "Frequency above the range clamps to three cycles",
);
const paths = [];
for (const frequency of [20, 2010, 4000]) {
  const rendered = render(
    React.createElement(SweepGlyph, {
      frequency,
      minFrequency: 20,
      maxFrequency: 4000,
    }),
  );
  assert.ok(
    rendered.includes("<clipPath") && rendered.includes('<circle r="50"'),
    "Wave is clipped to the source circle",
  );
  assert.ok(
    !rendered.includes("<rect"),
    "No rectangular inner clipping window remains",
  );
  assert.ok(!rendered.includes("NaN") && !rendered.includes("Infinity"));
  paths.push(rendered.match(/<path d="([^"]+)"/)[1]);
}
assert.equal(new Set(paths).size, 3, "Live frequency drives curve compression");
const flat = render(
  React.createElement(SweepGlyph, {
    frequency: 20,
    minFrequency: 20,
    maxFrequency: 20,
  }),
);
assert.ok(!flat.includes("NaN") && !flat.includes("Infinity"));
const paused = render(
  React.createElement(Sweep, {
    parameters: metadata.parameters,
    running: false,
    measured: { frequency: 4000 },
  }),
);
assert.ok(
  paused.includes(paths[0]),
  "Paused rendering uses the idle starter, not a stale simulation measurement",
);
const live = render(
  React.createElement(Sweep, {
    parameters: metadata.parameters,
    running: true,
    measured: { frequency: 4000 },
  }),
);
assert.ok(
  live.includes(paths[2]),
  "Running rendering follows the native frequency",
);
assert.ok(
  live.includes("M 0 0") && live.includes("L 0 -50"),
  "Authored lead and pin positions are preserved",
);
for (const rotation of [0, 90, 180, 270])
  for (const mirror of [false, true]) {
    const rendered = render(
      React.createElement(Sweep, {
        pose: { rotation, mirror },
        running: true,
        measured: { frequency: 2010 },
      }),
    );
    assert.ok(!rendered.includes("NaN"));
    assert.ok(rendered.includes(paths[1]));
    if (rotation || mirror)
      assert.ok(
        rendered.includes('transform="translate(0 0) scale('),
        "Wave remains upright in rotated and mirrored symbols",
      );
  }
console.log(
  "Sweep animation passed: authored sine shape, 2-second idle cycle, live frequency compression, clipping, pause behaviour, fixed-frequency safety and orientations.",
);
