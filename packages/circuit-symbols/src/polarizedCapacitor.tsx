import { Lead } from "../svg";

export const kind = "polarizedCapacitor";
export const metadata = {
  prefix: "C",
  name: "Polarized capacitor",
  pins: {
    positive: [-100, 0],
    negative: [100, 0],
  },
  parameters: {
    capacitance: 0.000001,
    initialVoltage: 0,
    integration: "backwardEuler",
    maxReverseVoltage: 1,
  },
} as const;

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.positive} to={[-15, 0]} />
      <Lead from={metadata.pins.negative} to={[15, 0]} />
      <path
        d="M -15 -40
          V 40"
      />
      <path
        d="M 15 -40
          Q 0 0, 15 40"
      />
      <path
        d="M -50 -20
          H -30
          M -40 -30
          V -10"
      />
    </>
  );
}
