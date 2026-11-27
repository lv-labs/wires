import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "halfAdder";
export const metadata = {
  prefix: "U",
  name: "Half adder",
  pins: {
    sum: [150, -50],
    carry: [150, 50],
    A: [-150, -50],
    B: [-150, 50],
  },
  parameters: {
    highVoltage: 5,
  },
} as const;

export function Symbol({ pose }: SymbolProps) {
  return <Chip pins={metadata.pins} labels={{ sum: "S", carry: "C" }} pose={pose} />;
}
