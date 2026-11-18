import { Meter, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "voltmeter";
export const metadata = {
  prefix: "VM",
  name: "Voltmeter / scope probe",
  pins: {
    a: [-100, 0],
    b: [100, 0],
  },
  parameters: {
    mode: 0,
    resistance: 10000000,
    scale: 0,
    circleSymbol: true,
  },
} as const;

export const output = {
  type: "p",
  fields: {
    mode: {
      label: "Reading (0 V, 1 RMS, 2 max, 3 min, 4 peak-to-peak, 5 binary)",
      type: "number",
      min: 0,
      max: 5,
      integer: true,
    },
    resistance: {
      label: "Input resistance · Ω (0 = ideal)",
      type: "number",
      min: 0,
    },
    scale: {
      label: "Scale",
      type: "number",
      min: 0,
      max: 3,
      integer: true,
      optional: true,
      default: 0,
    },
    circleSymbol: {
      label: "Circular symbol",
      type: "boolean",
      optional: true,
      default: true,
    },
  },
  sign: 1,
};

export function Symbol({ parameters = metadata.parameters, pose }: SymbolProps) {
  const circle = parameters.circleSymbol !== false;
  return (
    <>
      <Meter pins={metadata.pins} letter="V" pose={pose} circle={circle} />
      <UprightText pose={pose} x={circle ? -80 : -55} y={-30} textAnchor="middle" dominantBaseline="central" fontSize={36}>+</UprightText>
    </>
  );
}
