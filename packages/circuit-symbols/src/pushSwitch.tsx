import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "pushSwitch";
export const metadata = {

  prefix: "S",
  name: "Push switch",
  pins: {
    a: [-100, 0],
    b: [100, 0],
  },
  parameters: {
    onResistance: 0,
    momentary: true,
    linkLabel: "",
    iecSymbol: false,

    normallyClosed: false,
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
          M ${parameters.normallyClosed ? 0 : -50} -50
          L 60 ${parameters.normallyClosed ? 0 : -50}
          M 0 -32
          V -16
          M -12 -32
          H 12
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
