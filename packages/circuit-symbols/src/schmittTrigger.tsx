import { Lead } from "../svg";

export const kind = "schmittTrigger";
export const metadata = {

  prefix: "U",
  name: "Schmitt trigger",
  pins: {
    input: [-150, 0],
    out: [150, 0],
  },
  parameters: {
    slewRate: 0.5,
    lowerThreshold: 1.66,
    upperThreshold: 3.33,
    highVoltage: 5,
    lowVoltage: 0,
  },
} as const;
export const output = {
  type: "182",
  fields: {
    slewRate: {
      label: "Slew rate · V/ns",
      type: "number",
      exclusiveMin: 0,
    },
    lowerThreshold: {
      label: "Lower threshold · V",
      type: "number",
    },
    upperThreshold: {
      label: "Upper threshold · V",
      type: "number",
    },
    highVoltage: {
      label: "High output · V",
      type: "number",
    },
    lowVoltage: {
      label: "Low output · V",
      type: "number",
    },
  },
  sign: -1,
};

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.input} to={[-100, 0]} />
      <Lead from={metadata.pins.out} to={[100, 0]} />
      <polygon 
        points="100,0 -100,100, -100,-100 " />
      <polygon 
        points="-10,-20 -30,-20 -30 20 -10 20"
        strokeWidth={5} />
      <path d="M -10,-20 H5" strokeWidth={5}/>
      <path d="M -10,20 H-45" strokeWidth={5}/>
    </>
  );
}
