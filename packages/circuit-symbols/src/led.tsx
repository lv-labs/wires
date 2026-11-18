import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "led";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.

  prefix: "D",
  name: "LED",
  pins: {
    anode: [-100, 0],
    cathode: [100, 0],
  },
  parameters: {
    model: "default-led",
    red: 1,
    green: 0,
    blue: 0,
    maxCurrent: 0.01,
  },
} as const;

export function Symbol({
  parameters = metadata.parameters,
  current = 0,
}: SymbolProps) {
  const brightness = Math.max(
    0,
    Math.min(
      1,
      current > 0
        ? 1 + 0.2 * Math.log(current / Number(parameters.maxCurrent))
        : 0,
    ),
  );
  return (
    <>
      <Lead from={metadata.pins.anode} to={[-30, 0]} />
      <Lead from={metadata.pins.cathode} to={[30, 0]} />
      <polygon
        points="30,0 -30,-40, -30,40"
        fill={`rgb(${Math.round(255 * Number(parameters.red ?? 1) * brightness)},${Math.round(255 * Number(parameters.green ?? 0) * brightness)},${Math.round(255 * Number(parameters.blue ?? 0) * brightness)})`}
      />
      <path
        d="M 30 -40
          V 40"
      />
      <path
        d="M -12 -56
          L 12 -80
          M 0 -80
          H 12
          V -68
          M 12 -40
          L 36 -64
          M 24 -64
          H 36
          V -52"
      />
    </>
  );
}
