import { Lead } from "../svg";

// Authoritative symbol metadata. Generate the headless catalog with pnpm --dir apps/simulator symbols:generate.
export const kind = "resistor";
export const metadata = {
  prefix: "R",
  name: "Resistor",
  pins: {
    a: [100, 0],
    b: [-100, 0],
  },
  parameters: {
    resistance: 1000,
  },
} as const;

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.a} to={[70, 0]} />
      <Lead from={metadata.pins.b} to={[-70, 0]} />
      <rect x={-70} y={-30} width={140} height={60} />
    </>
  );
}
