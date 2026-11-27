import { Lead } from "../svg";

export const kind = "tristateBuffer";
export const metadata = {
  name: "Tristate buffer",
  prefix: "U",
  pins: { input: [-100, 0], out: [100, 0], enable: [0, 100] },
  parameters: {
    onResistance: 0.1,
    offResistance: 10000000000,
    pulldownResistance: 100000000,
    highVoltage: 5,
  },
} as const;

export const output = {
  type: "180",
  fields: {
    onResistance: {
      label: "On resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    offResistance: {
      label: "Off resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    pulldownResistance: {
      label: "Output pulldown · Ω (0 disables)",
      type: "number",
      min: 0,
    },
    highVoltage: { label: "High level · V", type: "number", exclusiveMin: 0 },
  },
  sign: 1,
};

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.input} to={[-50, 0]} />
      <Lead from={metadata.pins.out} to={[50, 0]} />
      <Lead from={metadata.pins.enable} to={[0, 25]} />
      <path d="M -50 -50 L 50 0 L -50 50 Z" />
    </>
  );
}
