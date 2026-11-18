import { Lead } from "../svg";

export const kind = "transformer";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "T",
  name: "Transformer",
  pins: {
    p1: [-32, -48],
    s1: [32, -48],
    p2: [-32, 48],
    s2: [32, 48],
  },
  parameters: {
    inductance: 4,
    ratio: 1,
    coupling: 0.999,
    integration: "backwardEuler",
  },
} as const;

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.p1} to={[-32, -24]} />
      <Lead from={metadata.pins.p2} to={[-32, 24]} />
      <Lead from={metadata.pins.s1} to={[32, -24]} />
      <Lead from={metadata.pins.s2} to={[32, 24]} />
      <path
        d="M -32 -24
          C -10 -24, -10 -12, -32 -12
          C -10 -12, -10 0, -32 0
          C -10 0, -10 12, -32 12
          C -10 12, -10 24, -32 24
          M 32 -24
          C 10 -24, 10 -12, 32 -12
          C 10 -12, 10 0, 32 0
          C 10 0, 10 12, 32 12
          C 10 12, 10 24, 32 24
          M -5 -28
          V 28
          M 5 -28
          V 28"
      />
    </>
  );
}
