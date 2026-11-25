import { Display } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "instructionDisplay";
export const metadata = {
  prefix: "INS",
  name: "Instruction display",
  pins: {
    I0: [-150, 150],
    I1: [-150, 50],
    I2: [-150, -50],
    I3: [-150, -150],
  },
  parameters: {
    bitCount: 4,
    threshold: 2.5,
    lookup: "0=NOP\n1=LOAD\n2-15=OP {a}",
  },
} as const;

export const output = {
  type: "instruction",
  fields: {
    bitCount: {
      label: "Bits · 1 to 16",
      type: "number",
      min: 1,
      max: 16,
      integer: true,
      optional: true,
    },
    threshold: {
      label: "Logic threshold · V",
      type: "number",
    },
    lookup: {
      label: "Lookup table (one value or range = text per line)",
      type: "string",
      maxLength: 4096,
    },
  },
  sign: null,
};

export function Symbol({
  measured,
  pose,
  pinPositions = metadata.pins,
}: SymbolProps) {
  return (
    <Display
      pins={pinPositions}
      value={String(measured?.text ?? "—")}
      pose={pose}
    />
  );
}
