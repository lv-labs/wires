import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "analogSpdtSwitch";
export const metadata = {

  prefix: "S",
  name: "Analog switch (SPDT)",
  pins: {
    common: [-100, 0],
    a: [100, -50],
    b: [100, 50],
    control: [0, 100],
  },
  parameters: {
    onResistance: 20,
    offResistance: 10000000000,
    threshold: 2.5,
    inverted: false,
    pulldown: true,
  },
} as const;

export function Symbol({ parameters = metadata.parameters, measured }: SymbolProps) {
  const controlVoltage = measured?.controlVoltage;
  const lowerThrow =
    typeof controlVoltage === "number" &&
    Number.isFinite(controlVoltage) &&
    (controlVoltage < Number(parameters.threshold)) !== Boolean(parameters.inverted);

  return (
    <>
      <Lead from={metadata.pins.common} to={[-50, 0]} />
      <Lead from={metadata.pins.a} to={[50, -50]} />
      <Lead from={metadata.pins.b} to={[50, 50]} />
      <Lead from={metadata.pins.control} to={[0, 90]} />
      <Lead from={[-40, 0]} to={[50, lowerThrow ? 50 : -50]} />
      <path
        d="M 0 25
          V 90"
        strokeDasharray="5 15"
      />

      <circle cx={-50} r={10} fill="white"/>
      <circle cx={50} cy={-50} r={10} fill="white"/>
      <circle cx={50} cy={50} r={10} fill="white"/>

    </>
  );
}
