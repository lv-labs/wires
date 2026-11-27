import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "fullAdder";
export const metadata = {
  prefix: "U",
  name: "Adder (4 bit)",
  pins: {
    A0: [-150, -100],
    A1: [-150, -200],
    A2: [-150, -300],
    A3: [-150, -400],
    B0: [-150, 300],
    B1: [-150, 200],
    B2: [-150, 100],
    B3: [-150, 0],
    S0: [150, 100],
    S1: [150, 0],
    S2: [150, -100],
    S3: [150, -200],
    carryIn: [-150, 400],
    carryOut: [150, -400],
  },
  parameters: {
    highVoltage: 5,
  },
} as const;

export function Symbol({ pose }: SymbolProps) {
  return (
    <Chip
      pins={metadata.pins}
      labels={{ carryIn: "Cin", carryOut: "C" }}
      pose={pose}
    />
  );
}
