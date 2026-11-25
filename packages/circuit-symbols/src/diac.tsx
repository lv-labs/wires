import { Lead } from "../svg";
export const kind = "diac";
export const metadata = {
  name: "DIAC",
  prefix: "D",
  pins: {
    a: [-150, 0],
    b: [150, 0],
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
// Artwork adapted from KiCad Device:DIAC (CC BY-SA 4.0).
export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.a} to={[-50, 0]} />
      <Lead from={metadata.pins.b} to={[50, 0]} />
      <path
        d="M -50 100
          V -100
          L 50 -50, -50 0
          Z
          M 50 -100
          V 100
          L -50 50, 50 0
          Z"
        strokeWidth={10}
        
      />
    </>
  );
}
