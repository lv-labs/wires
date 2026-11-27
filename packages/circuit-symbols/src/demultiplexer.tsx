import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "demultiplexer";
export const metadata = {
  prefix: "U",
  name: "Demultiplexer",
  pins: {
    Q0: [100, -100],
    Q1: [100, -50],
    Q2: [100, 0],
    Q3: [100, 50],
    S0: [-50, 150],
    S1: [0, 150],
    input: [-100, -100],
  },
  parameters: {
    highVoltage: 5,
    selectBits: 2,
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
      caption="DEMUX"
      pose={pose}
      columns={bits + 1}
      rows={2 ** bits + 1}
      labels={{ input: "IN" }}
    />
  );
}
