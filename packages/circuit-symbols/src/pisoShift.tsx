import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "pisoShift";
export const metadata = {
  prefix: "U",
  name: "Parallel-in serial-out shift register",
  pins: {
    load: [-250, 0],
    clock: [-250, 50],
    out: [300, 0],
    serial: [-250, -50],
    D7: [200, -100],
    D6: [150, -100],
    D5: [100, -100],
    D4: [50, -100],
    D3: [0, -100],
    D2: [-50, -100],
    D1: [-100, -100],
    D0: [-150, -100],
  },
  parameters: {
    highVoltage: 5,
    bits: 8,
    initialValue: 0,
    serialInput: true,
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
      caption="PISO"
      pose={pose}
      columns={Number(parameters?.bits ?? 8) + 2}
      rows={3}
      labels={{ load: "LD", clock: "▷", serial: "SER", out: "Q" }}
    />
  );
}
