import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "phaseComparator";
export const metadata = {
  prefix: "U",
  name: "Phase comparator",
  pins: {
    I1: [-50, 0],
    I2: [-50, 50],
    out: [100, 0],
  },
  parameters: {
    highVoltage: 5,
  },
} as const;

export function Symbol({ pinPositions = metadata.pins, pose }: SymbolProps) {
  return (
    <DiscreteChip
      pins={pinPositions}
      caption="PHASE"
      pose={pose}
      columns={2}
      rows={2}
      labels={{ out: "OUT" }}
    />
  );
}
