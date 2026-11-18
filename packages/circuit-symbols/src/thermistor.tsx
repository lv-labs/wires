import { Lead } from "../svg";

export const kind = "thermistor";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "R",
  name: "NTC thermistor",
  pins: {
    a: [-48, 0],
    b: [48, 0],
  },
  parameters: {
    resistance25: 10000,
    resistance50: 3605,
    minTemperature: -40,
    maxTemperature: 150,
    position: 0.34,
    label: "Temperature",
  },
} as const;
export const output = {
  type: "350",
  fields: {
    label: {
      label: "Slider label",
      type: "string",
      maxLength: 80,
      optional: true,
      default: "Temperature",
    },
    resistance25: {
      label: "Resistance at 25 °C · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    resistance50: {
      label: "Resistance at 50 °C · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    minTemperature: {
      label: "Minimum temperature · °C",
      type: "number",
      exclusiveMin: -273.15,
    },
    maxTemperature: {
      label: "Maximum temperature · °C",
      type: "number",
      exclusiveMin: -273.15,
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
          M -20 16
          H -12
          L 12 -16"
      />
    </>
  );
}
