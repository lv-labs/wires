import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "spdtSwitch";
export const metadata = {
  prefix: "S",
  name: "SPDT switch",
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
    throwCount: 2,
    centerOff: false,

    position: 0,
  },
} as const;

export function Symbol({ parameters = metadata.parameters }: SymbolProps) {
  const count = Number(parameters.throwCount ?? 2);
  const position = Number(parameters.position ?? 0);
  const ys =
    count === 2
      ? [-50, 50]
      : Array.from(
          { length: count },
          (_, i) => 50 * (i - Math.floor((count - 1) / 2)),
        );
  const common = metadata.pins.common;
  const contacts =
    count === 2
      ? [metadata.pins.a, metadata.pins.b]
      : ys.map((y) => [metadata.pins.a[0], y] as const);
  const closed = position >= 0 && position < count;
  // The extra position is centre-off: point into the gap rather than a contact.
  const bladeX = closed || count === 2 ? 50 : 0;
  const bladeY = closed ? ys[position] : 0;

  return (
    <>
      <Lead from={common} to={[-50, 0]} />
      {contacts.map((pin, i) => (
        <Lead key={i} from={pin} to={[50, ys[i]]} />
      ))}

      <circle cx={-50} cy={0} r={10} fill="white" />
      {ys.map((y, i) => (
        <circle key={i} cx={50} cy={y} r={10} fill="white" />
      ))}

      <path
        d={`
          M -40 0
          L ${bladeX} ${bladeY}
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
