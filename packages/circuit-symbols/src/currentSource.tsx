import { Lead } from "../svg";

export const kind = "currentSource";
export const metadata = {
  prefix: "I",
  name: "DC current source",
  pins: {
    a: [-150, 0],
    b: [150, 0],
  },
  parameters: {
    current: 0.01,
    maxVoltage: 0,
  },
} as const;

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.a} to={[-50, 0]} />
      <Lead from={metadata.pins.b} to={[50, 0]} />
      <circle r={50} />
      <path
        d="M -25 0
          H 25
          M 8 -15
          L 25 0, 8 15"
      />
    </>
  );
}
