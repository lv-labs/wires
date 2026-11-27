import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "sequenceGenerator";
export const metadata = {
  prefix: "U",
  name: "Sequence generator",
  pins: {
    clock: [-50, 0],
    Q: [100, 50],
    reset: [-50, 50],
  },
  parameters: {
    highVoltage: 5,
    sequence: "00000000",
    playOnce: false,
    resetPin: true,
  },
} as const;

export function Symbol({ pinPositions = metadata.pins, pose }: SymbolProps) {
  return (
    <DiscreteChip
      pins={pinPositions}
      caption="SEQ"
      pose={pose}
      columns={2}
      rows={2}
      labels={{ clock: "▷", reset: "R" }}
    />
  );
}
