import { Lead } from "../svg";

export const kind = "unijunction";
export const metadata = {
  name: "Unijunction transistor",
  prefix: "Q",
  pins: {
    emitter: [-150, 0],
    base1: [150, 100],
    base2: [150, 0],
  },
  parameters: {},
} as const;
export const output = {
  type: "417",
  fields: {},
  sign: null,
};

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.emitter} to={[-65, 0]} />
      <path d="M -65 0 L 35 48 M 39 20 V 78 M 39 28 L 88 0 H 150 M 39 70 L 88 100 H 150" />
      <path d="M 14 29 L 35 48 L 7 43 Z" fill="currentColor" />
    </>
  );
}
