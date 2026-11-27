import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "voltageControlledOscillator";
export const metadata = {
  prefix: "U",
  name: "Voltage-controlled oscillator",
  pins: {
    input: [-50, -50],
    out: [-50, 100],
    capA: [100, -50],
    capB: [100, 0],
    resistor1: [100, 50],
    resistor2: [100, 100],
  },
  parameters: {
    highVoltage: 5,
  },
} as const;

export function Symbol({ pinPositions = metadata.pins, pose }: SymbolProps) {
  return (
    <DiscreteChip
      pins={pinPositions}
      caption="VCO"
      pose={pose}
      columns={2}
      rows={4}
      labels={{
        input: "Vi",
        out: "Vo",
        capA: "C",
        capB: "C",
        resistor1: "R1",
        resistor2: "R2",
      }}
    />
  );
}
