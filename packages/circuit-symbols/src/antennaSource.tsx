import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "antennaSource";
export const metadata = {
  prefix: "V",
  name: "Antenna",
  pins: {
    p: [0, 0],
  },
  parameters: {},
} as const;
export const output = {
  type: "A",
  fields: {},
  sign: -1,
};

export function Symbol({ pose }: SymbolProps) {
  return (
    <>
      <circle cy={-100} r={50} />
      <Lead from={metadata.pins.p} to={[0, -50]} />
      <UprightText pose={pose} y={-90} textAnchor="middle" fontSize={30}>
        Ant
      </UprightText>
    </>
  );
}
