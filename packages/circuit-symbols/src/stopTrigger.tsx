import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "stopTrigger";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "TRIG",
  name: "Stop trigger",
  pins: {
    in: [-48, 0],
  },
  parameters: {
    threshold: 1,
    direction: 0,
    delay: 0,
  },
} as const;

export const output = {
  type: "408",
  fields: {
    threshold: {
      label: "Trigger voltage · V",
      type: "number",
    },
    direction: {
      label: "Condition (0 ≥ threshold, 1 ≤ threshold)",
      type: "number",
      min: 0,
      max: 1,
      integer: true,
    },
    delay: {
      label: "Delay · s",
      type: "number",
      min: 0,
    },
  },
  sign: null,
};

export function Symbol({ pose }: SymbolProps) {
  return (
    <>
      <Lead from={metadata.pins.in} to={[-24, 0]} />
      <rect x={-24} y={-16} width={48} height={32} />
      <UprightText pose={pose} y={4} textAnchor="middle" fontSize={10}>
        TRIG
      </UprightText>
    </>
  );
}
