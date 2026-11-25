import { Lead } from "../svg";

export const kind = "inverter";
export const metadata = {

  prefix: "U",
  name: "Inverter",
  pins: {
    input: [-150, 0],
    out: [150, 0],
  },
  parameters: {
    highVoltage: 5,
    slewRate: 0.5,
  },
} as const;

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.input} to={[-100, 0]} />
      <Lead from={metadata.pins.out} to={[130, 0]} />
      <polygon 
        points="100,0 -100,100, -100,-100 " />

      <circle cx={115} r={15} />
    </>
  );
}
