import { Lead } from "../svg";

export const kind = "tunnelDiode";
export const metadata = {
  prefix: "D",
  name: "Tunnel diode",
  pins: {
    anode: [-100, 0],
    cathode: [100, 0],
  },
  parameters: {},
} as const;
export const output = {
  type: "175",
  fields: {},
  sign: 1,
};
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
          H 15"
      />
    </>
  );
}
