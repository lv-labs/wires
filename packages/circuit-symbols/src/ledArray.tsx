import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "ledArray";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "LA",
  name: "LED array",
  pins: {
    C0: [-112, 160],
    C1: [-80, 160],
    C2: [-48, 160],
    C3: [-16, 160],
    C4: [16, 160],
    C5: [48, 160],
    C6: [80, 160],
    C7: [112, 160],
    R0: [-160, -112],
    R1: [-160, -80],
    R2: [-160, -48],
    R3: [-160, -16],
    R4: [-160, 16],
    R5: [-160, 48],
    R6: [-160, 80],
    R7: [-160, 112],
  },
  parameters: { columns: 8, rows: 8 },
} as const;

export const output = {
  type: "405",
  fields: {
    columns: {
      label: "Columns · 2 to 16",
      type: "number",
      min: 2,
      max: 16,
      integer: true,
      optional: true,
    },
    rows: {
      label: "Rows · 2 to 16",
      type: "number",
      min: 2,
      max: 16,
      integer: true,
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
  const columns = Object.keys(pinPositions).filter((name) =>
    name.startsWith("C"),
  ).length;
  const rows = Object.keys(pinPositions).length - columns;
  const w = 16 * columns,
    h = 16 * rows;
  const currents = Array.isArray(measured?.currents) ? measured.currents : [];
  return (
    <>
      <rect x={-w} y={-h} width={2 * w} height={2 * h} />
      {Object.entries(pinPositions).map(([name, pin]) => {
        const column = name.startsWith("C");
        const position = column ? pin[0] : pin[1];
        return (
          <g key={name}>
            <Lead from={pin} to={column ? [position, h] : [-w, position]} />
            <UprightText
              pose={pose}
              x={column ? position + 5 : -w - 24}
              y={column ? h + 20 : position - 5}
              fontSize={8}
            >
              {name}
            </UprightText>
          </g>
        );
      })}
      {Array.from({ length: columns * rows }, (_, index) => {
        const brightness = Math.max(
          0.04,
          Math.min(1, (currents[index] ?? 0) / 0.01),
        );
        return (
          <circle
            key={index}
            cx={16 - w + 32 * (index % columns)}
            cy={16 - h + 32 * Math.floor(index / columns)}
            r={7}
            stroke="#607064"
            fill={`rgba(255,75,45,${brightness})`}
          />
        );
      })}
    </>
  );
}
