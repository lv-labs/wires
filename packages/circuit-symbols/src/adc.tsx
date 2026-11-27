import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "adc";
export const metadata = {
  prefix: "U",
  name: "Analog-to-digital converter",
  pins: {
    D0: [100, 100],
    D1: [100, 50],
    D2: [100, 0],
    D3: [100, -50],
    input: [-50, -50],
    reference: [-50, 100],
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
      caption="ADC"
      pose={pose}
      columns={2}
      rows={Number(parameters?.bits ?? 4)}
      labels={{ input: "IN", reference: "V+" }}
    />
  );
}
