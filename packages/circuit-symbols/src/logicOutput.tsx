import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "logicOutput";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "M",
  name: "Logic output",
  pins: {
    in: [-48, 0],
  },
  parameters: {
    threshold: 2.5,
    mode: "logic",
    pulldown: false,
  },
} as const;

export function Symbol({ pose, parameters = metadata.parameters, measured = {} }: SymbolProps) {
  const voltage = Number(measured.voltage), threshold = Number(parameters.threshold);
  const state = !Number.isFinite(voltage) ? "—" : parameters.mode === "ternary" ? voltage > threshold * 1.5 ? "2" : voltage > threshold * .5 ? "1" : "0" : parameters.mode === "numeric" ? voltage < threshold ? "0" : "1" : voltage < threshold ? "L" : "H";
  return <><Lead from={metadata.pins.in} to={[-12, 0]} /><UprightText pose={pose} x={0} y={6} fontSize={18}>{state}</UprightText></>;
}
