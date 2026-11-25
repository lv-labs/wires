import { Lead, UprightText } from "../svg";
import type { Pin, SymbolProps } from "../svg";

export const kind = "sevenSegment";
export const metadata = {
  name: "Segment display",
  prefix: "DISP",
  pins: {
    a: [-125, -75],
    b: [-125, -25],
    c: [-125, 25],
    d: [-125, 75],
    e: [-25, 125],
    f: [25, 125],
    g: [75, 125],
  },
  parameters: { segments: 7, extra: 0, diodeDirection: 0, highVoltage: 5 },
} as const;

export const output = {
  type: "157",
  sign: null,
  fields: {
    segments: { label: "Segments", type: "number", choices: [7, 14, 16] },
    extra: { label: "Extra segment", type: "number", choices: [0, 1, 2] },
    diodeDirection: {
      label: "Input type",
      type: "number",
      choices: [0, 1, -1],
    },
    highVoltage: {
      label: "Logic high voltage · V",
      type: "number",
      exclusiveMin: 0,
    },
  },
} as const;

// Endpoints on a 2 × 2 grid, in the same segment order as the model's pins.
const segments7 = [
  [0, 0, 2, 0],
  [2, 0, 2, 1],
  [2, 1, 2, 2],
  [0, 2, 2, 2],
  [0, 1, 0, 2],
  [0, 0, 0, 1],
  [0, 1, 2, 1],
];
const diagonals = [
  [0, 0, 1, 1],
  [1, 0, 1, 1],
  [2, 0, 1, 1],
  [1, 1, 2, 1],
  [1, 1, 2, 2],
  [1, 1, 1, 2],
  [1, 1, 0, 2],
  [0, 1, 1, 1],
];
const segments14 = [...segments7.slice(0, 6), ...diagonals];
const segments16 = [
  [0, 0, 1, 0],
  [1, 0, 2, 0],
  [2, 0, 2, 1],
  [2, 1, 2, 2],
  [2, 2, 1, 2],
  [1, 2, 0, 2],
  [0, 2, 0, 1],
  [0, 1, 0, 0],
  ...diagonals,
];

export function Symbol({
  parameters = metadata.parameters,
  pinPositions = metadata.pins,
  measured,
  pose,
}: SymbolProps) {
  const base = Number(parameters.segments),
    extra = Number(parameters.extra);
  const count = Object.keys(pinPositions).length;
  const rows = Math.ceil(base / 2) + (count > 2 * Math.ceil(base / 2) ? 1 : 0);
  const w = count === 7 ? 100 : 125,
    h = rows * 25;
  const segments =
    base === 7 ? segments7 : base === 14 ? segments14 : segments16;
  const levels = Array.isArray(measured?.segments) ? measured.segments : [];
  const color = (i: number) => `rgba(255,56,36,${levels[i] ?? 0.12})`;
  const length = Math.min(h - 35, 74),
    width = length * 0.65;
  return (
    <>
      <rect x={-w} y={-h} width={2 * w} height={2 * h} rx={4} />
      {Object.entries(pinPositions).map(([pin, point]) => {
        const [x, y] = point;
        const bottom = y > h;
        const end: Pin = bottom ? [x, h] : [Math.sign(x) * w, y];
        return (
          <g key={pin}>
            <Lead from={point} to={end} />
            <UprightText
              pose={pose}
              x={bottom ? x : end[0] - Math.sign(x) * 13}
              y={bottom ? h - 12 : y}
              fontSize={14}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {pin === "common"
                ? parameters.diodeDirection === 1
                  ? "K"
                  : "A"
                : pin}
            </UprightText>
          </g>
        );
      })}
      {segments.map(([x1, y1, x2, y2], index) => (
        <line
          key={index}
          x1={(x1 - 1) * width}
          y1={(y1 - 1) * length}
          x2={(x2 - 1) * width}
          y2={(y2 - 1) * length}
          stroke={color(index)}
          strokeWidth={7}
        />
      ))}
      {extra !== 0 &&
        (extra === 1 ? [length] : [-length / 2, length / 2]).map((y) => (
          <circle
            key={y}
            cx={width + 14}
            cy={y}
            r={4}
            stroke="none"
            fill={color(base)}
          />
        ))}
    </>
  );
}
