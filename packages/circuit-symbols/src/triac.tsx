import { Lead } from "../svg";
export const kind = "triac";
export const metadata = {
  name: "TRIAC",
  prefix: "D",
  pins: {
    mt2: [-150, 0],
    mt1: [150, 0],
    gate: [100, 150],
  },
  parameters: {
    triggerCurrent: 0.01,
    holdingCurrent: 0.0082,
    gateResistance: 100,
  },
} as const;
export const output = {
  type: "206",
  fields: {
    triggerCurrent: {
      label: "Trigger current · A",
      type: "number",
      exclusiveMin: 0,
    },
    holdingCurrent: {
      label: "Holding current · A",
      type: "number",
      exclusiveMin: 0,
    },
    gateResistance: {
      label: "Gate resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
  },
  sign: 1,
};
// Artwork adapted from KiCad Device:Q_Triac (CC BY-SA 4.0).
export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.mt2} to={[-50, 0]} />
      <Lead from={metadata.pins.mt1} to={[50, 0]} />
      <Lead from={metadata.pins.gate} to={[100, 50]} />
      <path d="M 100 50 L 50 25" />
      <path
        d="M -50 -100
          V 100
          L 50 50, -50 0
          M 50 100
          V -100
          L -50 -50, 50 0"
        strokeWidth={10}
      />
    </>
  );
}
