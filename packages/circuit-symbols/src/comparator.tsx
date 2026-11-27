import { AnalogAmplifier } from "../analogAmplifier";
import type { SymbolProps } from "../svg";

export const kind = "comparator";
export const metadata = {
  name: "Comparator (Hi-Z/GND output)",
  prefix: "U",
  pins: {
    minus: [-150, -50],
    plus: [-150, 50],
    out: [150, 0],
  },
  parameters: {
    swapInputs: false,
  },
} as const;
export const output = {
  type: "401",
  fields: {
    swapInputs: {
      label: "Swap inputs",
      type: "boolean",
    },
  },
  sign: null,
};

export function Symbol({ pinPositions = metadata.pins, pose }: SymbolProps) {
  return <AnalogAmplifier pins={pinPositions} pose={pose} openCollector />;
}
