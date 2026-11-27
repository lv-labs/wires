import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "dFlipFlop";
export const metadata = {
  prefix: "U",
  name: "D flip-flop",
  pins: {
    D: [-150, -100],
    clock: [-150, 0],
    Q: [150, -100],
    Qn: [150, 100],
  },
  parameters: {
    highVoltage: 5,
    initialState: false,
  },
} as const;

export function Symbol({ pose }: SymbolProps) {
  return (
    <Chip
      pins={metadata.pins}
      labels={{ Qn: "Q" }}
      overlined={["Qn"]}
      clocks={["clock"]}
      pose={pose}
    />
  );
}
