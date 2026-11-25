import { Lead, UprightText } from "../svg";
import type { Pin, SymbolProps } from "../svg";

export const kind = "ringCounter";
export const metadata = {
  prefix: "U",
  name: "Ring counter",
  pins: {
    clock: [-250, 50],
    reset: [250, 100],
    Q0: [-200, -50],
    Q1: [-150, -50],
    Q2: [-100, -50],
    Q3: [-50, -50],
    Q4: [0, -50],
    Q5: [50, -50],
    Q6: [100, -50],
    Q7: [150, -50],
    Q8: [200, -50],
    Q9: [250, -50],
    inhibit: [-150, 100],
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
  const left = pinPositions.clock[0] + 25;
  const right = pinPositions.reset[0] + 25;
  const labels: Record<string, string> = {
    clock: "▷",
    reset: parameters.invertReset ? "R̅" : "R",
    inhibit: "CE̅",
  };
  return (
    <>
      <rect x={left} y={-25} width={right - left} height={100} rx={4} />
      {Object.entries(pinPositions).map(([name, point]) => {
        const [x, y] = point;
        const end: Pin = name === "clock" ? [left, y] : [x, y < 0 ? -25 : 75];
        const textX = name === "clock" ? left + 13 : x;
        const textY = name === "clock" ? y : y < 0 ? -10 : 62;
        return (
          <g key={name}>
            <Lead from={point} to={end} />
            <UprightText
              pose={pose}
              x={textX}
              y={textY}
              fontSize={16}
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
        y={28}
        fontSize={16}
        textAnchor="middle"
        dominantBaseline="central"
      >
        Ring counter
      </UprightText>
    </>
  );
}
