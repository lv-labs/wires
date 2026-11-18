import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
const require = createRequire(
  new URL("../apps/simulator/package.json", import.meta.url),
);
const ts = require("typescript");
class Matrix {
  constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    Object.assign(this, { a, b, c, d, e, f });
  }
  inverse() {
    const det = this.a * this.d - this.b * this.c;
    return new Matrix(
      this.d / det,
      -this.b / det,
      -this.c / det,
      this.a / det,
      (this.c * this.f - this.d * this.e) / det,
      (this.b * this.e - this.a * this.f) / det,
    );
  }
}
class Point {
  constructor(x, y) {
    Object.assign(this, { x, y });
  }
  matrixTransform(m) {
    return new Point(
      m.a * this.x + m.c * this.y + m.e,
      m.b * this.x + m.d * this.y + m.f,
    );
  }
}
class Shape {}
const exports = {};
const code = ts.transpileModule(
  readFileSync(
    new URL("../apps/simulator/src/editor/symbolHit.ts", import.meta.url),
    "utf8",
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  },
).outputText;
vm.runInNewContext(code, {
  exports,
  DOMPoint: Point,
  SVGGeometryElement: Shape,
});
const { symbolBodyHit } = exports;
function body(matrix, box, bounds = true, id = "switch") {
  return {
    dataset: { symbolBody: id, ...(bounds ? { symbolHitArea: "bounds" } : {}) },
    getScreenCTM: () => matrix,
    getBBox: () => box,
    querySelectorAll: () => [],
  };
}
const svg = (bodies) => ({
  getScreenCTM: () => new Matrix(),
  querySelectorAll: () => bodies,
});
for (const rotation of [0, 90, 180, 270])
  for (const mirror of [false, true])
    for (const scale of [0.064, 0.448, 1.28]) {
      const radians = (rotation * Math.PI) / 180,
        m = mirror ? -1 : 1;
      const matrix = new Matrix(
        scale * Math.cos(radians) * m,
        scale * Math.sin(radians) * m,
        -scale * Math.sin(radians),
        scale * Math.cos(radians),
        300,
        200,
      );
      for (const box of [
        { x: -100, y: -60, width: 200, height: 120 },
        { x: -100, y: -150, width: 200, height: 1500 },
      ]) {
        const surface = svg([body(matrix, box)]);
        const hit = (x, y) => {
          const p = new Point(x, y).matrixTransform(matrix);
          return symbolBodyHit(surface, p.x, p.y);
        };
        assert.equal(
          hit(40, box.y + box.height / 2),
          "switch",
          "Empty space inside a switch is clickable",
        );
        assert.equal(
          hit(100 + 3 / scale, 0),
          "switch",
          "Six-pixel padding works at any zoom",
        );
        assert.equal(
          hit(100 + 8 / scale, 0),
          null,
          "Nearby space remains available to wires/components",
        );
        const p = new Point(40, 0).matrixTransform(matrix);
        assert.equal(symbolBodyHit(surface, p.x, p.y, false), null, "Existing wire hits bypass padded interiors");
        assert.equal(
          symbolBodyHit(svg([body(matrix, box, false)]), p.x, p.y),
          null,
          "Non-switch artwork retains precise hit testing",
        );
      }
    }
const box = { x: -100, y: -50, width: 200, height: 100 };
assert.equal(
  symbolBodyHit(
    svg([
      body(new Matrix(), box, true, "back"),
      body(new Matrix(), box, true, "front"),
    ]),
    0,
    0,
  ),
  "front",
  "Topmost body wins",
);
console.log(
  "Switch hit areas passed: empty interiors, padded edges, multi-pole height, all rotations/mirrors, zoom-independent tolerance, and precise non-switch hits.",
);
