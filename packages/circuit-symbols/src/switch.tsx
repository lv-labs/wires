import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "switch";
export const metadata = {

  prefix: "S",
  name: "Switch",
  pins: {
    a: [-100, 0],
    b: [100, 0],
  },
  parameters: {
    onResistance: 0,
    momentary: false,
    linkLabel: "",
    iecSymbol: false,

    closed: false,
  },
} as const;

export function Symbol({ parameters = metadata.parameters }: SymbolProps) {
  return (
    <>
      <Lead from={metadata.pins.a} to={[-50, 0]} />
      <Lead from={metadata.pins.b} to={[50, 0]} />
      <circle cx={-50} r={10} fill="white" />
      <circle cx={50} r={10} fill="white" />
      <path
        d={`
          M -50 0
          L 50 ${parameters.closed ? 0 : -50}
        `}
      />
      {parameters.iecSymbol === true && (
        <path
          d="M 0 -32
            V -16
            M -8 -32
            H 8"
          strokeDasharray="3 3"
        />
      )}
    </>
  );
}
