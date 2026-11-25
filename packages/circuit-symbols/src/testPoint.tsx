import { Lead, Upright } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "testPoint";
export const metadata = {

  prefix: "TP",
  name: "Test point",
  pins: {
    in: [0, 0],
  },
  parameters: {
    mode: 0,
    label: "TP",
  },
} as const;

export const output = {
  type: "368",
  fields: {
    mode: {
      label: "Reading (0 V, 1 RMS, 2 max, 3 min, 4 peak-to-peak, 5 binary)",
      type: "number",
      min: 0,
      max: 5,
      integer: true,
    },
    label: {
      label: "Label",
      type: "string",
      maxLength: 80,
    },
  },
  sign: null,
};

export function Symbol({
  parameters = metadata.parameters,
  pose,
  reading,
}: SymbolProps) {
  const label = String(parameters.label);
  const rotation = pose?.rotation ?? 0;
  const textAnchor =
    rotation === 90 ? "start" : rotation === 270 ? "end" : "middle";
  const textY = -195;
  const lineHeight = 44;
  const linesAboveAnchor = [1, 0.5, 0, 0.5][rotation / 90] ?? 0;
  const labelOffset = label && reading ? -lineHeight * linesAboveAnchor : 0;
  return (
    <>
      <Lead from={metadata.pins.in} to={[0, -100]} />
      <circle  cy={-130} r={30} />
      <Upright pose={pose} y={textY}>
        <text
          x={0}
          y={textY + labelOffset}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize={40}
          fill="currentColor"
          stroke="none"
        >
          {label && <tspan x={0}>{label}</tspan>}
          {reading && (
            <tspan
              x={0}
              dy={label ? lineHeight : 0}
              opacity={0.7}
              pointerEvents="none"
            >
              {reading}
            </tspan>
          )}
        </text>
      </Upright>
    </>
  );
}
