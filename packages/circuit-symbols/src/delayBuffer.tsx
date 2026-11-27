import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "delayBuffer";
export const metadata = {
  name: "Delay buffer",
  prefix: "U",
  pins: { input: [-100, 0], out: [100, 0] },
  parameters: { delay: 0, threshold: 2.5, highVoltage: 5 },
} as const;

export const output = {
  type: "422",
  fields: {
    delay: { label: "Delay · s", type: "number", min: 0 },
    threshold: { label: "Threshold · V", type: "number" },
    highVoltage: { label: "High level · V", type: "number", exclusiveMin: 0 },
  },
  sign: -1,
};

export function Symbol({ pose }: SymbolProps) {
  return (
    <>
      <Lead from={metadata.pins.input} to={[-50, 0]} />
      <Lead from={metadata.pins.out} to={[50, 0]} />
      <path d="M -50 -50 L 50 0 L -50 50 Z" />
      <UprightText pose={pose} x={-26} y={7} textAnchor="middle" fontSize={28}>
        Δ
      </UprightText>
    </>
  );
}
