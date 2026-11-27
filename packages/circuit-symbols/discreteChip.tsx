import { Lead, UprightText } from "./svg";
import type { Pin, SymbolProps } from "./svg";

export function DiscreteChip({
  pins,
  columns,
  rows,
  caption,
  labels = {},
  inverted = [],
  pose,
}: {
  pins: Record<string, Pin>;
  columns: number;
  rows: number;
  caption: string;
  labels?: Record<string, string>;
  inverted?: readonly string[];
  pose?: SymbolProps["pose"];
}) {
  const left = -50 * Math.floor((columns - 1) / 2) - 25;
  const top = -50 * Math.floor((rows - 1) / 2) - 25;
  const right = left + columns * 50;
  const bottom = top + rows * 50;
  const captionY = Object.values(pins).some(([, y]) => y < top)
    ? (top + bottom) / 2
    : top + 9;
  return (
    <>
      <rect
        x={left}
        y={top}
        width={right - left}
        height={bottom - top}
        rx={8}
      />
      <UprightText
        pose={pose}
        x={(left + right) / 2}
        y={captionY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
      >
        {caption}
      </UprightText>
      {Object.entries(pins).map(([name, [x, y]]) => {
        const vertical = y > bottom || y < top;
        const verticalEdge = y < top ? top : bottom;
        const west = x < left;
        const side = west ? -1 : 1;
        const edge = west ? left : right;
        const bubble = inverted.includes(name);
        return (
          <g key={name}>
            <Lead
              from={[x, y]}
              to={
                vertical
                  ? [x, verticalEdge]
                  : [edge + (bubble ? side * 12 : 0), y]
              }
            />
            {bubble && <circle cx={edge + side * 6} cy={y} r={6} />}
            <UprightText
              pose={pose}
              x={vertical ? x : edge - side * 7}
              y={vertical ? verticalEdge + (y < top ? 12 : -10) : y}
              textAnchor={vertical ? "middle" : west ? "start" : "end"}
              dominantBaseline="central"
              fontSize={17}
              overline={name === "Qn"}
            >
              {labels[name] ?? name}
            </UprightText>
          </g>
        );
      })}
    </>
  );
}
