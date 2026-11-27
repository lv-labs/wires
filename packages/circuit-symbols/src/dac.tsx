import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "dac";
export const metadata = {
  prefix: "U",
  name: "Digital-to-analog converter",
  pins: {
    D0: [-50, 100],
    D1: [-50, 50],
    D2: [-50, 0],
    D3: [-50, -50],
    out: [100, -50],
    reference: [100, 100],
  },
  parameters: {
    highVoltage: 5,
    bits: 4,
    lsbFirst: false,
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
      caption="DAC"
      pose={pose}
      columns={2}
      rows={Number(parameters?.bits ?? 4)}
      labels={{ out: "OUT", reference: "V+" }}
    />
  );
}
