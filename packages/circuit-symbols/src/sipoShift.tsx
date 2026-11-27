import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "sipoShift";
export const metadata = {
  prefix: "U",
  name: "Serial-in parallel-out shift register",
  pins: {
    data: [-250, 0],
    clock: [-250, 50],
    Q0: [-150, -100],
    Q1: [-100, -100],
    Q2: [-50, -100],
    Q3: [0, -100],
    Q4: [50, -100],
    Q5: [100, -100],
    Q6: [150, -100],
    Q7: [200, -100],
  },
  parameters: {
    highVoltage: 5,
    bits: 8,
    initialValue: 0,
  },
} as const;

export function Symbol({
  pinPositions = metadata.pins,
  pose,
  parameters,
}: SymbolProps) {
  return (
    <DiscreteChip
      pins={pinPositions}
      caption="SIPO"
      pose={pose}
      columns={Number(parameters?.bits ?? 8) + 1}
      rows={3}
      labels={{ data: "D", clock: "▷" }}
    />
  );
}
