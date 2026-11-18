import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "fuse";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "R",
  name: "Fuse",
  pins: {
    a: [-48, 0],
    b: [48, 0],
  },
  parameters: {
    resistance: 0.0613,
    i2t: 6.73,
    iecSymbol: false,
  },
} as const;
export const output = {
  type: "404",
  fields: {
    resistance: {
      label: "Cold resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    i2t: {
      label: "Melting I²t · A²s",
      type: "number",
      exclusiveMin: 0,
    },
    iecSymbol: {
      label: "IEC symbol",
      type: "boolean",
      optional: true,
      default: false,
    },
  },
  sign: 1,
};
export function Symbol({
  parameters = metadata.parameters,
  measured,
}: SymbolProps) {
  const iec = Boolean(parameters.iecSymbol);
  const halfWidth = iec ? 16 : 8;
  return (
    <>
      <Lead from={metadata.pins.a} to={[-halfWidth, 0]} />
      <Lead from={metadata.pins.b} to={[halfWidth, 0]} />
      {!measured?.blown && (
        <path
          d={
            iec
              ? `M -16 -6
                H 16
                V 6
                H -16
                Z
                M -16 0
                H 16`
              : `M -8 0
                C -5.333 8, -2.667 8, 0 0
                S 5.333 -8, 8 0`
          }
        />
      )}
    </>
  );
}
