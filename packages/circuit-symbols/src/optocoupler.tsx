import { Lead } from "../svg";

export const kind = "optocoupler";
export const metadata = {
  name: "Optocoupler",
  prefix: "U",
  pins: {
    anode: [-150, -50],
    cathode: [-150, 50],
    collector: [150, -50],
    emitter: [150, 50],
  },
  parameters: {
    ctr: 1,
    diodeModel: "default-optocoupler-led",
  },
} as const;
export const output = {
  type: "407",
  fields: {
    ctr: {
      label: "Current transfer ratio scale",
      type: "number",
      exclusiveMin: 0,
    },
    diodeModel: {
      label: "LED model",
      type: "string",
      maxLength: 32,
      choices: ["default-optocoupler-led", "default"],
    },
  },
  sign: null,
};

export function Symbol() {
  return (
    <>
      <rect x={-115} y={-73} width={230} height={146} rx={8} />
      <Lead from={metadata.pins.anode} to={[-62, -50]} />
      <Lead from={metadata.pins.cathode} to={[-62, 50]} />
      <Lead from={metadata.pins.collector} to={[62, -50]} />
      <Lead from={metadata.pins.emitter} to={[62, 50]} />
      <path d="M -62 -50 V 50 M -79 -15 H -45 L -62 12 Z M -79 12 H -45 M 40 -24 V 24 M 40 -12 L 62 -31 V -50 M 40 12 L 62 32 V 50" />
      <path d="M -33 -19 L -10 -27 M -18 -30 L -10 -27 L -14 -19 M -33 8 L -10 0 M -18 -3 L -10 0 L -14 8" />
    </>
  );
}
