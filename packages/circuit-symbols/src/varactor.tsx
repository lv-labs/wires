import { Lead } from "../svg";
export const kind = "varactor";
export const metadata = {
  name: "Varactor",
  prefix: "D",
  pins: {
    anode: [-150, 0],
    cathode: [150, 0],
  },
  parameters: {
    capacitance: 4e-12,
  },
} as const;
export const output = {
  type: "176",
  fields: {
    capacitance: {
      label: "Zero-bias capacitance · F",
      type: "number",
      exclusiveMin: 0,
    },
  },
  sign: 1,
};
// Artwork adapted from KiCad Device:D_Capacitance (CC BY-SA 4.0).
export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.anode} to={[-50, 0]} />
      <Lead from={metadata.pins.cathode} to={[50, 0]} />
      <path
        d="M -50 -50
          V 50
          L 50 0
          Z
          M 50 -50
          V 50"
        strokeWidth={10}
      />
      <path
        d="M -50 0
          H 50
          M -50 70
          H -6
          M -6 50
          V 90
          M 6 50
          V 90
          M 6 70
          H 50"
      />
    </>
  );
}
