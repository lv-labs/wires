import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "relay";
export const metadata = {
  name: "Relay",
  prefix: "K",
  pins: {
    common1: [-100, 0],
    nc1: [100, -50],
    no1: [100, 50],
    coilA: [-100, 100],
    coilB: [100, 100],
  },
  parameters: {
    poleCount: 1,
    inductance: 0.2,
    coilResistance: 20,
    onResistance: 0.05,
    offResistance: 1000000,
    onCurrent: 0.02,
    offCurrent: 0.015,
    switchingTime: 0.005,
    coilStyle: 0,
    showBox: true,
    pulldown: true,
    initialCoilCurrent: 0,
    initialPosition: 0,
  },
} as const;

export const output = {
  type: "178",
  sign: null,
  fields: {
    poleCount: { label: "Poles", type: "number", integer: true, min: 1, max: 4 },
    inductance: { label: "Coil inductance · H", type: "number", exclusiveMin: 0 },
    coilResistance: { label: "Coil resistance · Ω", type: "number", exclusiveMin: 0 },
    onResistance: { label: "On resistance · Ω", type: "number", exclusiveMin: 0 },
    offResistance: { label: "Off resistance · Ω", type: "number", exclusiveMin: 0 },
    onCurrent: { label: "Pickup current · A", type: "number", exclusiveMin: 0 },
    offCurrent: { label: "Release current · A", type: "number", exclusiveMin: 0 },
    switchingTime: { label: "Switching time · s (0 for legacy behavior)", type: "number", min: 0 },
    coilStyle: { label: "Coil leads", type: "number", integer: true, min: 0, max: 2 },
    showBox: { label: "Show enclosure", type: "boolean" },
    pulldown: { label: "Contact pulldowns", type: "boolean" },
    initialCoilCurrent: { label: "Initial coil current · A", type: "number" },
    initialPosition: { label: "Initial position", type: "number", integer: true, min: 0, max: 2 },
  },
} as const;

export function Symbol({ parameters = metadata.parameters, measured }: SymbolProps) {
  const poles = Number(parameters.poleCount);
  const travel = Number(measured?.travel ?? [0, 1, 0.5][Number(parameters.initialPosition)]);
  const coilStyle = Number(parameters.coilStyle);
  const coilSide = coilStyle === 2 ? 100 : -100;
  const boxTop = -150 * (poles - 1) - 65;
  const boxBottom = coilStyle === 0 ? 116 : 167;
  return (
    <>
      {parameters.showBox && <rect x={-78} y={boxTop} width={156} height={boxBottom - boxTop} strokeDasharray="8 6" />}
      <path d={`M 0 ${boxTop + 46} V 83`} strokeDasharray="7 7" />
      {Array.from({ length: poles }, (_, pole) => {
        const y = -150 * pole;
        return (
          <g key={pole}>
            <Lead from={[-100, y]} to={[-63, y]} />
            <Lead from={[63, y - 50]} to={[100, y - 50]} />
            <Lead from={[63, y + 50]} to={[100, y + 50]} />
            <Lead from={[-63, y]} to={[56, y - 50 + 100 * travel]} />
            <circle cx={63} cy={y - 50} r={4} />
            <circle cx={63} cy={y + 50} r={4} />
          </g>
        );
      })}
      {coilStyle === 0 ? (
        <path d="M -100 100 H -40 q 10 -28 20 0 q 10 -28 20 0 q 10 -28 20 0 q 10 -28 20 0 H 100" />
      ) : (
        <path d={`M ${coilSide} 100 H 0 q 28 6.25 0 12.5 q 28 6.25 0 12.5 q 28 6.25 0 12.5 q 28 6.25 0 12.5 H ${coilSide}`} />
      )}
    </>
  );
}
