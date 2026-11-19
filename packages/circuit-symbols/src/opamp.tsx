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

  <g
    transform="translate(-135 -100)"
    stroke-width="10">
    <path
      d="M -20,0 H 20 M 0,-20 V 20"
       />
  </g> 
  <g
    transform="translate(-135 100)"
    stroke-width="10">
    <path
      d="M -20,0 H 20"
       />
  </g>
    </>
  );
}
