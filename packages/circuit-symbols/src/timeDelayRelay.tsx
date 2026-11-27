import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "timeDelayRelay";
export const metadata = {
  name: "Time delay relay",
  prefix: "K",
  pins: {
    supply: [-150, 50],
    return: [150, 50],
    input: [-150, -50],
    out: [150, -50],
  },
  parameters: {
    onDelay: 1,
    offDelay: 0,
    onResistance: 1,
    offResistance: 10000000.0,
  },
} as const;
export const output = {
  type: "414",
  fields: {
    onDelay: {
      label: "On delay · s",
      type: "number",
      min: 0,
    },
    offDelay: {
      label: "Off delay · s",
      type: "number",
      min: 0,
    },
    onResistance: {
      label: "On resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    offResistance: {
      label: "Off resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
  },
  sign: null,
};

export function Symbol({ pose }: SymbolProps) {
  return (
    <Chip
      pins={metadata.pins}
      labels={{ supply: "Vin", return: "GND", input: "IN", out: "OUT" }}
      pose={pose}
    />
  );
}
