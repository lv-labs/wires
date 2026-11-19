import { Lead } from "../svg";
import type { SymbolProps } from "../svg";
import { SweepGlyph } from "../waveforms";

export const kind = "sweepSource";
export const metadata = {
  prefix: "V",
  name: "A/C sweep",
  pins: {
    p: [0, 0],
  },
  parameters: {
    minFrequency: 20,
    maxFrequency: 4000,
    amplitude: 5,
    sweepTime: 0.1,
    logarithmic: false,
    bidirectional: true,
  },
} as const;
export const output = {
  type: "170",
  fields: {
    minFrequency: {
      label: "Minimum frequency · Hz",
      type: "number",
      exclusiveMin: 0,
    },
    maxFrequency: {
      label: "Maximum frequency · Hz",
      type: "number",
      min: 0,
    },
    amplitude: {
      label: "Peak voltage · V",
      type: "number",
      min: 0,
    },
    sweepTime: {
      label: "Sweep time · s",
      type: "number",
      exclusiveMin: 0,
    },
    logarithmic: {
      label: "Logarithmic sweep",
      type: "boolean",
    },
    bidirectional: {
      label: "Sweep up and down",
      type: "boolean",
    },
  },
  sign: -1,
};

export function Symbol({
  parameters = metadata.parameters,
  pose,
  measured = {},
  running = false,
}: SymbolProps) {
  return (
    <>
      <Lead from={metadata.pins.p} to={[0, -50]} />
      <g transform="translate(0 -100)">
        <circle r={50} />
        <SweepGlyph
          pose={pose}
          minFrequency={Number(
            parameters.minFrequency ?? metadata.parameters.minFrequency,
          )}
          maxFrequency={Number(
            parameters.maxFrequency ?? metadata.parameters.maxFrequency,
          )}
          frequency={
            running && typeof measured.frequency === "number"
              ? measured.frequency
              : undefined
          }
        />
      </g>
    </>
  );
}
