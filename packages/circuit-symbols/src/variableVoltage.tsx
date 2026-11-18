import { Lead, Upright } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "variableVoltage";
export const metadata = {
  prefix: "V",
  name: "Variable voltage",
  pins: {
    p: [0, 0],
  },
  parameters: {
    minVoltage: 0,
    maxVoltage: 5,
    voltage: 2.5,
    label: "Voltage",
  },
} as const;

export const output = {
  type: "172",
  fields: {
    minVoltage: {
      label: "Minimum voltage (left) · V",
      type: "number",
    },
    maxVoltage: {
      label: "Maximum voltage (right) · V",
      type: "number",
    },
    voltage: {
      label: "Voltage · V",
      type: "number",
    },
    label: {
      label: "Slider label",
      type: "string",
      maxLength: 80,
    },
  },
  sign: -1,
};

export function Symbol({ pose }: SymbolProps) {
  return (
    <>
      <Lead from={metadata.pins.p} to={[0, -50]} />
      <g transform="translate(0 -100)">
        <circle r={50} />
        <Upright pose={pose}>
          <path
            d="M -24 24
              L 24 -24
              M 6 -24
              H 24
              V -6"
          />
        </Upright>
      </g>
    </>
  );
}
