import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "loadCounter";
export const metadata = {
  prefix: "U",
  name: "Counter with load",
  pins: {
    Q3: [150, -100],
    Q2: [150, -50],
    Q1: [150, 0],
    Q0: [150, 50],
    I3: [-150, -100],
    I2: [-150, -50],
    I1: [-150, 0],
    I0: [-150, 50],
    clock: [-150, -150],
    clear: [-150, 100],
    enableP: [-150, 150],
    carry: [150, -150],
    load: [150, 100],
    enableT: [150, 150],
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
        clear: "CLR",
        enableP: "EnP",
        enableT: "EnT",
        carry: "RCO",
        load: "LOAD",
      }}
      bubbles={["clear", "load"]}
      clocks={["clock"]}
      pose={pose}
    />
  );
}
