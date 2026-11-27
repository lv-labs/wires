import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "jkFlipFlop";
export const metadata = {
  prefix: "U",
  name: "JK flip-flop",
  pins: {
    J: [-150, -100],
    clock: [-150, 0],
    K: [-150, 100],
    Q: [150, -100],
    Qn: [150, 100],
  },
  parameters: {
    highVoltage: 5,
    initialState: false,
    positiveEdge: false,
  },
} as const;

export function Symbol({
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  return (
    <Chip
      pins={metadata.pins}
      labels={{ Qn: "Q" }}
      overlined={["Qn"]}
      bubbles={parameters.positiveEdge ? [] : ["clock"]}
      clocks={["clock"]}
      pose={pose}
    />
  );
}
