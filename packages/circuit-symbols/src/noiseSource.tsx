import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "noiseSource";
export const metadata = {
  prefix: "V",
  name: "Noise source",
  pins: {
    p: [0, 0],
  },
  parameters: {
    amplitude: 5,
    offset: 0,
  },
} as const;
export const output = {
  type: "R",
  fields: {
    amplitude: {
      label: "Peak voltage · V",
      type: "number",
      min: 0,
    },
    offset: {
      label: "DC offset · V",
      type: "number",
    },
  },
  sign: -1,
};

export function Symbol({ pose }: SymbolProps) {
  return (
    <>
      <circle cy={-100} r={50} />
      <Lead from={metadata.pins.p} to={[0, -50]} />
      <UprightText pose={pose} y={-90} textAnchor="middle" fontSize={30}>
        Noise
      </UprightText>
    </>
  );
}
