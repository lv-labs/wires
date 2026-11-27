import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "tFlipFlop";
export const metadata = {
  prefix: "U",
  name: "T flip-flop",
  pins: {
    T: [-150, -100],
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
