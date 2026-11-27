import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "relayContact";
export const metadata = {
  name: "Relay contact",
  prefix: "K",
  pins: {
    a: [-100, 0],
    b: [100, 0],
  },
  parameters: {
    label: "label",
    onResistance: 0.05,
    offResistance: 1000000.0,
    normallyClosed: false,
    iecSymbol: true,
    initialPosition: 1,
  },
} as const;
export const output = {
  type: "426",
  fields: {
    label: {
      label: "Label for linking relays",
      type: "string",
      maxLength: 80,
    },
    onResistance: {
      label: "On resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    offResistance: {
      label: "Off resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    normallyClosed: {
      label: "Normally closed",
      type: "boolean",
    },
    iecSymbol: {
      label: "IEC symbol",
      type: "boolean",
    },
    initialPosition: {
      label: "Initial position",
      type: "number",
      integer: true,
      min: 0,
      max: 1,
    },
  },
  sign: 1,
};

export function Symbol({
  parameters = metadata.parameters,
  measured,
}: SymbolProps) {
  const closed = measured?.closed ?? parameters.initialPosition === 0;
  return (
    <>
      <Lead from={metadata.pins.a} to={[-40, 0]} />
      <Lead from={metadata.pins.b} to={[40, 0]} />
      <Lead from={[-40, 0]} to={closed ? [40, 0] : [36, -40]} />
      <circle cx={-40} r={5} />
      <circle cx={40} r={5} />
      {parameters.iecSymbol && <path d="M 0 10 V 28" strokeDasharray="5 5" />}
    </>
  );
}
