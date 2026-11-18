import { Meter, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "ammeter";
export const metadata = {
  prefix: "AM",
  name: "Ammeter",
  pins: {
    a: [-100, 0],
    b: [100, 0],
  },
  parameters: {
    mode: 0,
    scale: 0,
    circleSymbol: true,
  },
} as const;

export const output = {
  type: "370",
  fields: {
    mode: {
      label: "Reading (0 instantaneous, 1 RMS)",
      type: "number",
      min: 0,
      max: 1,
      integer: true,
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

export function Symbol({
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  const circle = parameters.circleSymbol !== false;
  return (
    <>
      <Meter pins={metadata.pins} letter="A" pose={pose} circle={circle} />
      {circle && (
        <UprightText
          pose={pose}
          x={-80}
          y={-30}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={36}
        >
          +
        </UprightText>
      )}
    </>
  );
}
