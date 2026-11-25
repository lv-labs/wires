import { Lead } from "../svg";
export const kind = "scr";
export const metadata = {
  name: "SCR",
  prefix: "D",
  pins: {
    anode: [-150, 0],
    cathode: [150, 0],
    gate: [100, 150],
  },
  parameters: {
    triggerCurrent: 0.01,
    holdingCurrent: 0.0082,
    gateResistance: 50,
  },
} as const;
export const output = {
  type: "177",
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
  sign: null,
};
// Artwork adapted from KiCad Device:Q_SCR_AKG (CC BY-SA 4.0).
export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.anode} to={[-50, 0]} />
      <Lead from={metadata.pins.cathode} to={[50, 0]} />
      <Lead from={metadata.pins.gate} to={[100, 50]} />
      <path d="M 100 50 L 50 25" />
      <path
        d="M -50 -50
          V 50
          L 50 0
          Z
          M 50 -50
          V 50"
        strokeWidth={8}
      />
    </>
  );
}
