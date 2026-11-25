import { Lead } from "../svg";
export const kind = "triode";
export const metadata = {
  name: "Triode",
  prefix: "Q",
  pins: {
    plate: [0, -200],
    grid: [-150, 0],
    cathode: [-50, 200],
  },
  parameters: {
    mu: 93,
    kg1: 680,
  },
} as const;
export const output = {
  type: "173",
  fields: {
    mu: {
      label: "Amplification factor · μ",
      type: "number",
      exclusiveMin: 0,
    },
    kg1: {
      label: "Triode perveance factor · kg1",
      type: "number",
      exclusiveMin: 0,
    },
  },
  sign: 1,
};
// Artwork adapted from KiCad Valve:EC92 (CC BY-SA 4.0).
export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.plate} to={[0, -100]} />
      <Lead from={metadata.pins.grid} to={[-62.5, 0]} />
      <Lead from={metadata.pins.cathode} to={[-50, 100]} />
      <path
        d="M -100 -50
          A 100 100 0 0 1 100 -50
          V 50
          A 100 100 0 0 1 -100 50
          Z
          M -62.5 0
          H -37.5
          M -12.5 0
          H 12.5
          M 37.5 0
          H 62.5"
      />
      <path
        d="M -50 -100
          H 50
          M -50 100
          A 52 52 0 0 1 50 100
          M -50,135
          V 100"
        strokeWidth={10}
      />
    </>
  );
}
