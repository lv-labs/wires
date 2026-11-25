import { Display } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "decimalDisplay";
export const metadata = {
  prefix: "DISP",
  name: "Decimal display",
  pins: {
    I0: [-150, 150],
    I1: [-150, 50],
    I2: [-150, -50],
    I3: [-150, -150],
  },
  parameters: {
    mode: 0,
    bitCount: 4,
    highVoltage: 5,
    lsbFirst: false,
  },
} as const;

export const output = {
  type: "419",
  fields: {
    mode: {
      label: "Base (0 decimal, 1 hex, 2 octal)",
      type: "number",
      min: 0,
      max: 2,
      integer: true,
    },
    bitCount: {
      label: "Bits · 1 to 16",
      type: "number",
      min: 1,
      max: 16,
      integer: true,
      optional: true,
    },
    highVoltage: {
      label: "Logic high voltage · V",
      type: "number",
      exclusiveMin: 0,
      optional: true,
    },
    lsbFirst: {
      label: "Least significant bit first",
      type: "boolean",
      optional: true,
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
