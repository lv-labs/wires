import { Lead } from "../svg";

// Authoritative symbol metadata. Generate the headless catalog with pnpm --dir apps/simulator symbols:generate.
export const kind = "capacitor";
export const metadata = {
  prefix: "C",
  name: "Capacitor",
  pins: {
    a: [-100, 0],
    b: [100, 0],
  },
  parameters: {
    capacitance: 1e-6,
    initialVoltage: 0,
    integration: "backwardEuler",
  },
} as const;

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.a} to={[-15, 0]} />
      <Lead from={metadata.pins.b} to={[15, 0]} />
      <path
        d="M -15 -40
          V 40
          M 15 -40
          V 40"
      />
    </>
  );
}
