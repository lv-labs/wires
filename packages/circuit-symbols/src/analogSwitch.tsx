import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "analogSwitch";
export const metadata = {

  prefix: "S",
  name: "Analog switch (SPST)",
  pins: {
    a: [-100, 0],
    b: [100, 0],
    control: [0, -100],
  },
  parameters: {
    onResistance: 20,
    offResistance: 10000000000,
    threshold: 2.5,
    inverted: false,
    pulldown: true,
  },
} as const;

export function Symbol({ pose, parameters = metadata.parameters, measured }: SymbolProps) {
  const controlVoltage = measured?.controlVoltage;
  const closed =
    typeof controlVoltage === "number" &&
    Number.isFinite(controlVoltage) &&
    (controlVoltage >= Number(parameters.threshold)) !== Boolean(parameters.inverted);

  return (
    <>
      <Lead from={metadata.pins.a} to={[-50, 0]} />
      <Lead from={metadata.pins.b} to={[50, 0]} />
      <Lead from={metadata.pins.control} to={[0, -90]} />
      <Lead from={[-50, 0]} to={closed ? [50, 0] : [50, -35]} />
      <path
        d="M 0 -90
        V -20"
        strokeDasharray="5 15"
      />
      <circle cx={-50} r={10} fill="white"/>
      <circle cx={50} r={10} fill="white"/>

    </>
  );
}
