import { ControlledSource } from "../controlledSource";
import type { SymbolProps } from "../svg";

export const kind = "vccs";
export const metadata = {
  name: "Voltage-controlled current source",
  prefix: "U",
  pins: { a: [-100, 0], b: [-100, 50], outPlus: [100, 0], outMinus: [100, 50] },
  parameters: { inputCount: 2, expression: ".1*(a-b)" },
} as const;

export const output = {
  type: "213",
  sign: null,
  fields: {
    inputCount: {
      label: "Voltage inputs",
      type: "number",
      min: 0,
      max: 8,
      integer: true,
    },
    expression: { label: "Output expression", type: "string", maxLength: 512 },
  },
} as const;

export function Symbol({
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  return (
    <ControlledSource
      label="VCCS"
      inputCount={Number(parameters.inputCount)}
      pose={pose}
    />
  );
}
