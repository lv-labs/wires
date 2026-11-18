import type { SymbolProps } from "../svg";
import { Lead } from "../svg";

export const kind = "pnp";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "Q",
  name: "PNP transistor",
  pins: {
    base: [-48, 0],
    collector: [48, 16],
    emitter: [48, -16],
  },
  parameters: {
    beta: 100,
    model: "default",
    swapTerminals: false,
    drawCircle: false,
  },
} as const;

export function Symbol({ parameters = metadata.parameters }: SymbolProps) {
  return (
    <g transform={parameters.swapTerminals ? "scale(1 -1)" : undefined}>
      {parameters.drawCircle === true && <circle cx={4} r={28} />}
      <Lead from={metadata.pins.base} to={[-12, 0]} />
      <Lead from={metadata.pins.collector} to={[16, 16]} />
      <Lead from={metadata.pins.emitter} to={[16, -16]} />
      <path
        d="M -12 -20
          V 20
          M -12 -8
          L 16 16
          M -12 8
          L 16 -16"
      />
      <path
        d="M 3 0
          L -7 8
          L 4 10"
      />
    </g>
  );
}
