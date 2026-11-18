import { Lead } from "../svg";

export const kind = "diode";
export const metadata = {
  prefix: "D",
  name: "Diode",
  pins: {
    anode: [-100, 0],
    cathode: [100, 0],
  },
  parameters: { model: "default" },
} as const;

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.anode} to={[-30, 0]} />
      <Lead from={metadata.pins.cathode} to={[30, 0]} />
      <polygon points="30,0 -30,-40 -30,40" />
      <path
        d="M 30 -40
          V 40"
      />
    </>
  );
}
