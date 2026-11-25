import { ControlledSource } from "../controlledSource";
import type { SymbolProps } from "../svg";

export const kind = "cccs";
export const metadata = {
  name: "Current-controlled current source",
  prefix: "U",
  pins: {
    aPlus: [-100, 0],
    aMinus: [-100, 50],
    outPlus: [100, 0],
    outMinus: [100, 50],
  },
  parameters: { inputCount: 2, expression: "2*a" },
} as const;

export const output = {
  type: "215",
  sign: null,
  fields: {
    inputCount: {
      label: "Current-sense terminals (2 per input)",
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
      label="CCCS"
      inputCount={Number(parameters.inputCount)}
      pose={pose}
    />
  );
}
