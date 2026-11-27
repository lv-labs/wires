import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "multiplexer";
export const metadata = {
  prefix: "U",
  name: "Multiplexer",
  pins: {
    I0: [-100, -100],
    I1: [-100, -50],
    I2: [-100, 0],
    I3: [-100, 50],
    S0: [0, 150],
    S1: [50, 150],
    Q: [100, -100],
  },
  parameters: {
    highVoltage: 5,
    selectBits: 2,
    invertedOutput: false,
    strobePin: false,
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
      caption="MUX"
      pose={pose}
      columns={bits + 1}
      rows={2 ** bits + 1}
      labels={{ Qn: "Q", strobe: "STR" }}
      inverted={["Qn"]}
    />
  );
}
