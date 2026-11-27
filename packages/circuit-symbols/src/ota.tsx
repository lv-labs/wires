import { UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "ota";
export const metadata = {
  name: "OTA (LM13700 style)",
  prefix: "U",
  pins: {
    plus: [-150, -100],
    minus: [-150, 100],
    linearization: [-150, 0],
    bias: [100, -100],
    out: [150, 0],
  },
  parameters: {
    negativeSupply: -9,
    positiveSupply: 9,
  },
} as const;
export const output = {
  type: "402",
  fields: {
    negativeSupply: {
      label: "Negative internal supply · V",
      type: "number",
    },
    positiveSupply: {
      label: "Positive internal supply · V",
      type: "number",
    },
  },
  sign: null,
};

export function Symbol({ pose }: SymbolProps) {
  return (
    <>
      <path d="M -150 -100 H -76 L 70 0 L -76 100 H -150 M -76 100 V -100 M -150 0 H -76 M 70 0 H 150 M 100 -100 V -20" />
      <circle cx={87} r={17} />
      <circle cx={110} r={17} />
      <UprightText pose={pose} x={-54} y={-39} fontSize={26}>
        +
      </UprightText>
      <UprightText pose={pose} x={-54} y={58} fontSize={26}>
        −
      </UprightText>
    </>
  );
}
