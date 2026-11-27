import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "analogMultiplexer";
export const metadata = {
  prefix: "U",
  name: "Analog multiplexer",
  pins: {
    I0: [-100, -100],
    I1: [-100, -50],
    I2: [-100, 0],
    I3: [-100, 50],
    S0: [0, 150],
    S1: [50, 150],
    out: [100, -100],
  },
  parameters: {
    selectBits: 2,
    onResistance: 20,
    offResistance: 10000000000.0,
    threshold: 2.5,
  },
} as const;

export function Symbol({
  pinPositions = metadata.pins,
  pose,
  parameters,
}: SymbolProps) {
  const bits = Number(parameters?.selectBits ?? 2);
  return (
    <DiscreteChip
      pins={pinPositions}
      caption="AMUX"
      pose={pose}
      columns={bits + 1}
      rows={2 ** bits + 1}
      labels={{ out: "Z" }}
    />
  );
}
