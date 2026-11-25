import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "counter";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "U",
  name: "Counter",
  pins: {
    clock: [-48, -48],
    reset: [-48, 48],
    Q3: [48, -48],
    Q2: [48, -16],
    Q1: [48, 16],
    Q0: [48, 48],
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
        clock: parameters.negativeEdge ? "○▷" : "▷",
        reset: parameters.invertReset ? "R̅" : "R",
        direction: "U/D",
      }}
      pose={pose}
    />
  );
}
