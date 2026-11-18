import { Lead } from "../svg";

export const kind = "zener";
export const metadata = {
  prefix: "D",
  name: "Zener diode",
  pins: {
    anode: [-100, 0],
    cathode: [100, 0],
  },
  parameters: {
    model: "default-zener",
  },
} as const;

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.anode} to={[-30, 0]} />
      <Lead from={metadata.pins.cathode} to={[30, 0]} />
      <path
        d="M -30 -40
          V 40
          L 30 0
          Z"
      />
      <path
        d="M 15 -40
          H 30
          V 40
          H 45"
      />
    </>
  );
}
