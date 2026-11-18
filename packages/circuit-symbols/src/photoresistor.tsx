import { Lead } from "../svg";

export const kind = "photoresistor";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "R",
  name: "Photoresistor",
  pins: {
    a: [-48, 0],
    b: [48, 0],
  },
  parameters: {
    position: 0.34,
    label: "Light Brightness",
  },
} as const;
export const output = {
  type: "374",
  fields: {
    label: {
      label: "Slider label",
      type: "string",
      maxLength: 80,
      optional: true,
      default: "Light Brightness",
    },
    position: {
      label: "Sensor position · 0 to 1",
      type: "number",
      min: 0,
      max: 1,
    },
  },
  sign: 1,
};
export function Symbol() {
  return (
    <>
      <Lead from={metadata.pins.a} to={[-22, 0]} />
      <Lead from={metadata.pins.b} to={[22, 0]} />
      <path
        d="M -22 -8
          H 22
          V 8
          H -22
          Z
          M -13 -24
          L -4 -13
          M -10 -13
          H -4
          V -19
          M 3 -26
          L 12 -15
          M 6 -15
          H 12
          V -21"
      />
    </>
  );
}
