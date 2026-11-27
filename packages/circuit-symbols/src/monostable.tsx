import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "monostable";
export const metadata = {
  prefix: "U",
  name: "Monostable",
  pins: {
    trigger: [-50, 0],
    Q: [100, 0],
    Qn: [100, 50],
  },
  parameters: {
    highVoltage: 5,
    retriggerable: false,
    delay: 0.01,
  },
} as const;

export function Symbol({ pinPositions = metadata.pins, pose }: SymbolProps) {
  return (
    <DiscreteChip
      pins={pinPositions}
      caption="MONO"
      pose={pose}
      columns={2}
      rows={2}
      labels={{ trigger: "▷", Qn: "Q" }}
    />
  );
}
