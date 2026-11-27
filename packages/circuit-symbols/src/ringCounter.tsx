import { ClockTriangle, Lead, UprightText } from "../svg";
import type { Pin, SymbolProps } from "../svg";

export const kind = "ringCounter";
export const metadata = {
  prefix: "U",
  name: "Ring counter",
  pins: {
    clock: [-500, 100],
    reset: [500, 200],
    Q0: [-400, -100],
    Q1: [-300, -100],
    Q2: [-200, -100],
    Q3: [-100, -100],
    Q4: [0, -100],
    Q5: [100, -100],
    Q6: [200, -100],
    Q7: [300, -100],
    Q8: [400, -100],
    Q9: [500, -100],
    inhibit: [-300, 200],
  },
  parameters: {
    highVoltage: 5,
    bits: 10,
    initialValue: 1,
    invertReset: true,
    clockInhibit: true,
  },
} as const;

export function Symbol({
  parameters = metadata.parameters,
  pinPositions = metadata.pins,
  pose,
}: SymbolProps) {
  const left = pinPositions.clock[0] + 50;
  const right = pinPositions.reset[0] + 50;
  const labels: Record<string, string> = {
    reset: "R",
    inhibit: "CE",
  };
  return (
    <>
      <rect x={left} y={-50} width={right - left} height={200} rx={12} />
      {Object.entries(pinPositions).map(([name, point]) => {
        const [x, y] = point;
        if (name === "clock") {
          const edge: Pin = [left, y];
          return (
            <g key={name}>
              <Lead from={point} to={edge} />
              <ClockTriangle at={edge} />
            </g>
          );
        }
        const end: Pin = [x, y < 0 ? -50 : 150];
        return (
          <g key={name}>
            <Lead from={point} to={end} />
            <UprightText
              pose={pose}
              x={x}
              y={y < 0 ? -25 : 125}
              fontSize={32}
              overline={name === "inhibit" || (name === "reset" && parameters.invertReset === true)}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {labels[name] ?? name}
            </UprightText>
          </g>
        );
      })}
      <UprightText
        pose={pose}
        x={(left + right) / 2}
        y={50}
        fontSize={Math.min(32, (right - left - 30) / 7.5)}
        textAnchor="middle"
        dominantBaseline="central"
      >
        Ring counter
      </UprightText>
    </>
  );
}
