import { Lead } from "../svg";

export const kind = "crystal";
export const metadata = {
  prefix: "XTAL",
  name: "Crystal",
  pins: { a: [-100, 0], b: [100, 0] },
  parameters: {
    parallelCapacitance: 28.7e-12,
    seriesCapacitance: 0.1e-12,
    inductance: 2.5e-3,
    resistance: 6.4,
    showFrequency: true,
  },
} as const;

export const output = {
  type: "412",
  fields: {
    parallelCapacitance: {
      label: "Parallel capacitance · F",
      type: "number",
      exclusiveMin: 0,
    },
    seriesCapacitance: {
      label: "Series capacitance · F",
      type: "number",
      exclusiveMin: 0,
    },
    inductance: {
      label: "Series inductance · H",
      type: "number",
      exclusiveMin: 0,
    },
    resistance: {
      label: "Series resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    showFrequency: { label: "Show frequency", type: "boolean" },
  },
  sign: 1,
};

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.a} to={[-45, 0]} />
      <Lead from={metadata.pins.b} to={[45, 0]} />
      <path d="M -45 -38 V 38 M 45 -38 V 38" />
      <rect x={-23} y={-40} width={46} height={80} />
    </>
  );
}
