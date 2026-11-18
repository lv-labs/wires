import { Lead } from "../svg";

export const kind = "inductor";
export const metadata = {
  prefix: "L",
  name: "Inductor",
  pins: {
    a: [-100, 0],
    b: [100, 0],
  },
  parameters: {
    inductance: 1,
    initialCurrent: 0,
    integration: "backwardEuler",
  },
} as const;

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.a} to={[-50, 0]} />
      <Lead from={metadata.pins.b} to={[50, 0]} />
      <path
        d="M -50 0
          C -40 -35, -35 -35, -25 0
          C -15 -35, -10 -35, 0 0
          C 10 -35, 15 -35, 25 0
          C 35 -35, 40 -35, 50 0"
      />
    </>
  );
}
