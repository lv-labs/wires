import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "mbbSwitch";
export const metadata = {

  prefix: "S",
  name: "Make-before-break switch",
  pins: {
    common: [-100, 0],
    a: [100, -50],
    b: [100, 50],
  },
  parameters: {
    onResistance: 0,
    momentary: false,
    linkLabel: "",
    iecSymbol: false,
    group: 0,

    position: 0,
  },
} as const;

export function Symbol({ parameters = metadata.parameters }: SymbolProps) {
  const position = Number(parameters.position);
  const bridging = position % 2 === 1;
  return (
    <>
      <Lead from={metadata.pins.common} to={[-40, 0]} />
      <Lead from={metadata.pins.a} to={[40, -50]} />
      <Lead from={metadata.pins.b} to={[40, 50]} />
      
      <circle cx={-40}  r={10} fill="white" />
      <circle cx={40} cy={-50} r={10} fill="white" />
      <circle cx={40} cy={50} r={10} fill="white" />
      
      {(position === 0 || bridging) && (
        <path
          d="M -40 0
            L 40 -50"
        />
      )}
      {(position === 2 || bridging) && (
        <path
          d="M -40 0
            L 40 50"
        />
      )}
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
