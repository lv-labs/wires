import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "fmSource";
export const metadata = {
  prefix: "V",
  name: "FM source",
  pins: {
    p: [0, 0],
  },
  parameters: {
    carrierFrequency: 800,
    signalFrequency: 40,
    amplitude: 5,
    deviation: 200,
  },
} as const;
export const output = {
  type: "201",
  fields: {
    carrierFrequency: {
      label: "Carrier frequency · Hz",
      type: "number",
      min: 0,
    },
    signalFrequency: {
      label: "Signal frequency · Hz",
      type: "number",
      min: 0,
    },
    amplitude: {
      label: "Peak voltage · V",
      type: "number",
      min: 0,
    },
    deviation: {
      label: "Frequency deviation · Hz",
      type: "number",
      min: 0,
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
        FM
      </UprightText>
    </>
  );
}
