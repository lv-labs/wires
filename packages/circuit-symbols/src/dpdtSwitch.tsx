import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "dpdtSwitch";
export const metadata = {
  prefix: "S",
  name: "DPDT switch",
  pins: {
    common1: [-100, -100],
    a1: [100, -50],
    b1: [100, -150],
    common2: [-100, 100],
    a2: [100, 150],
    b2: [100, 50],
  },
  parameters: {
    onResistance: 0,
    momentary: false,
    linkLabel: "",
    iecSymbol: false,
    poleCount: 2,

    position: 0,
  },
} as const;

export function Symbol({ parameters = metadata.parameters }: SymbolProps) {
  const position = Number(parameters.position ?? 0);
  const count = Number(parameters.poleCount ?? 2);
  const firstY = metadata.pins.common1[1];
  const spacing = metadata.pins.common2[1] - firstY;
  const contactOffset = position === 0 ? 50 : -50;

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const y = firstY + i * spacing;
        const common =
          i === 0
            ? metadata.pins.common1
            : i === 1
              ? metadata.pins.common2
              : ([metadata.pins.common1[0], y] as const);
        const a =
          i === 0
            ? metadata.pins.a1
            : i === 1
              ? metadata.pins.a2
              : ([
                  metadata.pins.a1[0],
                  y + metadata.pins.a1[1] - firstY,
                ] as const);
        const b =
          i === 0
            ? metadata.pins.b1
            : i === 1
              ? metadata.pins.b2
              : ([
                  metadata.pins.b1[0],
                  y + metadata.pins.b1[1] - firstY,
                ] as const);
        return (
          <g key={i}>
            <Lead from={common} to={[-50, y]} />
            <Lead from={a} to={[50, y + 50]} />
            <Lead from={b} to={[50, y - 50]} />

            <circle cx={-50} cy={y} r={10} fill="white" />
            <circle cx={50} cy={y + 50} r={10} fill="white" />
            <circle cx={50} cy={y - 50} r={10} fill="white" />

            <path
              d={`
                M -50 ${y}
                L 50 ${y + contactOffset}
              `}
            />
          </g>
        );
      })}
      {count > 1 && (
        <path
          d={`
            M 0 ${firstY + contactOffset / 2}
            V ${firstY + (count - 1) * spacing + contactOffset / 2}
          `}
          strokeDasharray="10 10"
        />
      )}
      {parameters.iecSymbol === true && (
        <path
          d={`
            M 0 ${firstY - 75}
            V ${firstY - 25}
            M -25 ${firstY - 75}
            H 25
          `}
          strokeDasharray="10 10"
        />
      )}
    </>
  );
}
