import { AnalogAmplifier } from "../analogAmplifier";
import type { SymbolProps } from "../svg";

export const kind = "opampReal";
export const metadata = {
  name: "Op amp (real)",
  prefix: "U",
  pins: {
    minus: [-150, -50],
    plus: [-150, 50],
    out: [150, 0],
    positiveSupply: [0, -150],
    negativeSupply: [0, 150],
  },
  parameters: {
    swapInputs: false,
    slewRate: 0.6,
    initialCompensationVoltage: 0,
    currentLimit: 0.0231,
    modelType: 0,
  },
} as const;
export const output = {
  type: "409",
  fields: {
    swapInputs: {
      label: "Swap inputs",
      type: "boolean",
    },
    slewRate: {
      label: "Slew rate · V/µs",
      type: "number",
      exclusiveMin: 0,
    },
    initialCompensationVoltage: {
      label: "Initial compensation voltage · V",
      type: "number",
    },
    currentLimit: {
      label: "Output current limit · A",
      type: "number",
      exclusiveMin: 0,
    },
    modelType: {
      label: "Model",
      type: "number",
      integer: true,
      min: 0,
      max: 2,
    },
  },
  sign: null,
};

export function Symbol({ pinPositions = metadata.pins, pose }: SymbolProps) {
  return <AnalogAmplifier pins={pinPositions} pose={pose} />;
}
