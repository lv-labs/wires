import { Lead } from "../svg";
export const kind = "diac";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  name: "DIAC",
  prefix: "D",
  pins: {
    a: [-48, 0],
    b: [48, 0],
  },
  parameters: {
    onResistance: 500,
    offResistance: 100000000,
    breakdownVoltage: 30,
    holdingCurrent: 0.01,
  },
} as const;
export const output = {
  type: "203",
  fields: {
    onResistance: {
      label: "On resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    offResistance: {
      label: "Off resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    breakdownVoltage: {
      label: "Breakdown voltage · V",
      type: "number",
      exclusiveMin: 0,
    },
    holdingCurrent: {
      label: "Holding current · A",
      type: "number",
      min: 0,
    },
  },
  sign: 1,
};
export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.a} to={[-16, 0]} />
      <Lead from={metadata.pins.b} to={[16, 0]} />

      <path
        d="M -16 -14
          V 14
          M 16 -14
          V 14
          M -16 -12
          L 16 -6
          L -16 0
          Z
          M 16 0
          L -16 6
          L 16 12
          Z"
      />
    </>
  );
}
