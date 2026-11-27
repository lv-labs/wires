import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "motorProtectionSwitch";
export const metadata = {
  name: "Motor protection switch",
  prefix: "Q",
  pins: {
    in1: [-100, -200],
    out1: [-100, 200],
    in2: [0, -200],
    out2: [0, 200],
    in3: [100, -200],
    out3: [100, 200],
  },
  parameters: {
    resistance: 0.0613,
    i2t: 6.73,
    label: "",
    initiallyTripped: false,
  },
} as const;
export const output = {
  type: "428",
  fields: {
    resistance: {
      label: "On resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    i2t: {
      label: "Trip energy · A²s",
      type: "number",
      exclusiveMin: 0,
    },
    label: {
      label: "Label for linking relays",
      type: "string",
      maxLength: 80,
    },
    initiallyTripped: {
      label: "Initially tripped",
      type: "boolean",
    },
  },
  sign: null,
};

export function Symbol({
  parameters = metadata.parameters,
  measured,
}: SymbolProps) {
  const tripped = measured?.blown ?? parameters.initiallyTripped;
  return (
    <>
      <rect x={-125} y={-85} width={250} height={170} rx={8} />
      {[-100, 0, 100].map((x) => (
        <g key={x}>
          <Lead from={[x, -200]} to={[x, -50]} />
          <Lead from={[x, 200]} to={[x, 50]} />
          <rect x={x - 13} y={-48} width={26} height={37} />
          <Lead from={[x, -11]} to={tripped ? [x + 26, 36] : [x, 50]} />
          <circle cx={x} cy={50} r={5} />
        </g>
      ))}
    </>
  );
}
