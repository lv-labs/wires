import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "gyrator";
export const metadata = {
  name: "Gyrator",
  prefix: "GY",
  pins: {
    port1Plus: [-150, -50],
    port2Plus: [150, -50],
    port1Minus: [-150, 50],
    port2Minus: [150, 50],
  },
  parameters: { resistance: 1000 },
} as const;

export const output = {
  type: "Gyrator",
  fields: {
    resistance: {
      label: "Gyration resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
  },
  sign: 1,
};

export function Symbol({ pose }: SymbolProps) {
  const p = metadata.pins;
  return (
    <>
      <Lead from={p.port1Plus} to={[-75, -50]} />
      <Lead from={p.port2Plus} to={[75, -50]} />
      <Lead from={p.port1Minus} to={[-75, 50]} />
      <Lead from={p.port2Minus} to={[75, 50]} />
      <rect x={-75} y={-50} width={150} height={100} />
      <UprightText pose={pose} x={0} y={-12} textAnchor="middle" fontSize={36}>
        π
      </UprightText>
      <path d="M -30 22 H 30 M 16 12 L 30 22 L 16 32" />
    </>
  );
}
