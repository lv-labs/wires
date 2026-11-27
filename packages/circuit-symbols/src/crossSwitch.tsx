import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "crossSwitch";
export const metadata = {
  name: "Crossover switch",
  prefix: "S",
  pins: {
    inA: [-150, -50],
    outA: [150, -100],
    inB: [-150, 50],
    outB: [150, 100],
  },
  parameters: {
    position: 0,
    onResistance: 0,
    momentary: false,
    linkLabel: "",
    iecSymbol: false,
  },
} as const;

export function Symbol({ parameters = metadata.parameters }: SymbolProps) {
  const crossed = parameters.position === 1;
  const a = crossed ? 40 : -40,
    b = -a;
  const p = metadata.pins;
  return (
    <>
      <Lead from={p.inA} to={[-65, -40]} />
      <Lead from={p.inB} to={[-65, 40]} />
      <Lead from={p.outA} to={[65, -40]} />
      <Lead from={p.outB} to={[65, 40]} />
      {parameters.iecSymbol && (
        <rect x={-75} y={-62} width={150} height={124} rx={6} />
      )}
      <path d={`M -65 -40 L 65 ${a} M -65 40 L 65 ${b}`} />
      {[-65, 65].flatMap((x) =>
        [-40, 40].map((y) => <circle key={`${x},${y}`} cx={x} cy={y} r={6} />),
      )}
    </>
  );
}
