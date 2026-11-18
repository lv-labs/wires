import { Lead } from "../svg";

export const kind = "opamp";
export const metadata = {
  prefix: "U",
  name: "Op-amp",
  pins: {
    plus: [-300, -100],
    minus: [-300, 100],
    out: [300, 0],
  },
  parameters: {
    gain: 100000,
    minOutput: -15,
    maxOutput: 15,
  },
} as const;

export const presets = {
  opampMinusTop: {
    name: "Op-amp (− on top)",
  },
  opampPlusTop: {
    name: "Op-amp (+ on top)",
  },
};

export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.plus} to={[-200, -100]} />
      <Lead from={metadata.pins.minus} to={[-200, 100]} />
      <Lead from={metadata.pins.out} to={[200, 0]} />
      <polygon points="-200,200 200,0 -200,-200" />
      <path
        d="M -175 -100
          H -125
          M -150 -125
          V -75"
      />
      <path
        d="M -175 100
          H -125"
      />
    </>
  );
}
