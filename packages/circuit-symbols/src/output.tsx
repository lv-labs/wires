import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "output";
export const metadata = {

  prefix: "O",
  name: "Output marker",
  pins: {
    in: [-50, 0],
  },
  parameters: {
    showVoltage: true,
  },
} as const;

export function Symbol(_: SymbolProps) {
  return (
    <>
      <Lead from={metadata.pins.in} to={[0, 0]} />
      <circle r={10} fill="white" />
    </>
  );
}
