import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "counter";
export const metadata = {
  prefix: "U",
  name: "Counter",
  pins: {
    clock: [-150, -150],
    reset: [-150, 150],
    Q3: [150, -150],
    Q2: [150, -50],
    Q1: [150, 50],
    Q0: [150, 150],
  },
  parameters: {
    highVoltage: 5,
    initialValue: 0,
    modulus: 0,
    invertReset: true,
    negativeEdge: false,
    bits: 4,
    upDown: false,
    lsbFirst: false,
  },
} as const;

export function Symbol({
  parameters = metadata.parameters,
  pinPositions = metadata.pins,
  pose,
}: SymbolProps) {
  return (
    <Chip
      pins={pinPositions}
      labels={{
        reset: "R",
        direction: "U/D",
      }}
      bubbles={[
        ...(parameters.negativeEdge ? ["clock"] : []),
        ...(parameters.invertReset ? ["reset"] : []),
      ]}
      clocks={["clock"]}
      pose={pose}
    />
  );
}
