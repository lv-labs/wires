import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "currentConveyor";
export const metadata = {
  name: "Current conveyor (CCII)",
  prefix: "U",
  pins: { x: [-100, -50], y: [-100, 50], z: [100, 0] },
  parameters: { gain: 1 },
} as const;

export const presets = {
  negativeCurrentConveyor: { name: "CCII−", parameters: { gain: -1 } },
} as const;

export const output = {
  type: "179",
  sign: null,
  fields: { gain: { label: "Z current gain", type: "number" } },
} as const;

export function Symbol({
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  const gain = parameters.gain;
  return (
    <>
      <rect x={-50} y={-75} width={100} height={150} rx={4} />
      {(["x", "y", "z"] as const).map((pin) => {
        const [x, y] = metadata.pins[pin];
        return (
          <g key={pin}>
            <Lead from={metadata.pins[pin]} to={[Math.sign(x) * 50, y]} />
            <UprightText
              pose={pose}
              x={Math.sign(x) * 36}
              y={y}
              fontSize={15}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {pin.toUpperCase()}
            </UprightText>
          </g>
        );
      })}
      <UprightText
        pose={pose}
        x={-7}
        y={0}
        fontSize={20}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {gain === 1 ? "CCII+" : gain === -1 ? "CCII−" : "CCII"}
      </UprightText>
    </>
  );
}
