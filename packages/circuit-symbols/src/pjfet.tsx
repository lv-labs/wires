import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "pjfet";
export const metadata = {
  drawingScale: 0.5,
  prefix: "Q",
  name: "PJFET",
  pins: {
    gate: [-200, 0],
    source: [100, 200],
    drain: [100, -200],
  },
  parameters: {
    threshold: -4,
    beta: 0.00125,
  },
} as const;

export function Symbol(_: SymbolProps) {
  return (
    <>
      <circle cx={50} r={111} strokeWidth={10} />
      <Lead from={metadata.pins.gate} to={[10, 0]} />
      <Lead from={metadata.pins.drain} to={[100, -55]} />
      <Lead from={metadata.pins.source} to={[100, 50]} />
      <path d="M 10 -75 V 75" strokeWidth={10} />
      <path
        d="M 100 -55
          H 10
          M 100 50
          H 10"
      />
      <polygon points="-40,0 -5,-15 -5,15" fill="currentColor" />

    </>
  );
}
