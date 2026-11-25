import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "wattmeter";
export const metadata = {
  prefix: "WM",
  name: "Wattmeter",
  pins: {
    returnIn: [-100, 50],
    returnOut: [100, 50],
    currentIn: [-100, -50],
    currentOut: [100, -50],
  },
  parameters: {
    mode: 0,
  },
} as const;

export const output = {
  type: "420",
  fields: {
    mode: {
      label: "Reading (0 instantaneous, 1 average)",
      type: "number",
      min: 0,
      max: 1,
      integer: true,
    },
  },
  sign: null,
};

export function Symbol({ pose }: SymbolProps) {
  return (
    <>
      <Lead from={metadata.pins.returnIn} to={[-60, 50]} />
      <Lead from={metadata.pins.returnOut} to={[60, 50]} />
      <Lead from={metadata.pins.currentIn} to={[-60, -50]} />
      <Lead from={metadata.pins.currentOut} to={[60, -50]} />
      <rect x={-60} y={-65} width={120} height={130} rx={12} />
      <UprightText pose={pose} dy="0.35em" textAnchor="middle" fontSize={60}>
        W
      </UprightText>
    </>
  );
}
