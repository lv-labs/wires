import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "loadCounter";
export const metadata = {
  drawingScale: 3.125,
  prefix: "U",
  name: "Counter with load",
  pins: {
    Q3: [48, -32],
    Q2: [48, -16],
    Q1: [48, 0],
    Q0: [48, 16],
    I3: [-48, -32],
    I2: [-48, -16],
    I1: [-48, 0],
    I0: [-48, 16],
    clock: [-48, -48],
    clear: [-48, 32],
    enableP: [-48, 48],
    carry: [48, -48],
    load: [48, 32],
    enableT: [48, 48],
  },
  parameters: {
    highVoltage: 5,
    bits: 4,
    initialValue: 0,
    modulus: 0,
    lsbFirst: false,
  },
} as const;

export function Symbol({ pinPositions = metadata.pins, pose }: SymbolProps) {
  return (
    <Chip
      pins={pinPositions}
      labels={{
        clock: "▷",
        clear: "CLR̅",
        enableP: "EnP",
        enableT: "EnT",
        carry: "RCO",
        load: "LOAD̅",
      }}
      pose={pose}
    />
  );
}
