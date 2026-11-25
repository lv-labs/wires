import { WaveformGlyph } from "../waveforms";
import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "voltageRail";
export const metadata = {
  prefix: "V",
  name: "DC source (1 terminal)",
  pins: {
    p: [0, 0],
  },
  parameters: {
    waveform: {
      kind: "dc",
      voltage: 5,
    },
  },
} as const;

export const presets = {
  squareRail: {
    name: "Square wave source (1 terminal)",
    parameters: {
      waveform: {
        kind: "square",
        amplitude: 5,
        frequency: 40,
        offset: 0,
        dutyCycle: 0.5,
      },
    },
  },
  clockRail: {
    name: "Clock",
    parameters: {
      waveform: {
        kind: "square",
        amplitude: 2.5,
        frequency: 100,
        offset: 2.5,
        dutyCycle: 0.5,
      },
    },
  },
  acRail: {
    name: "AC source (1 terminal)",
    parameters: {
      waveform: {
        kind: "sine",
        amplitude: 1,
        frequency: 1000,
        offset: 0,
      },
    },
  },
};

export function Symbol({
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  const waveform = parameters.waveform ?? metadata.parameters.waveform;
  if (
    typeof waveform === "object" &&
    "kind" in waveform &&
    waveform.kind === "dc"
  ) {
    const negative =
      "voltage" in waveform &&
      typeof waveform.voltage === "number" &&
      waveform.voltage < 0;
    return (
      <>
        <Lead from={metadata.pins.p} to={[0, -100]} />
        {negative ? (
          <polygon points="-30,-50 0,-100 30,-50" fill="currentColor" />
        ) : (
          <path
            d="M -30 -50
              L 0 -100, 30 -50"
          />
        )}
      </>
    );
  }

  return (
    <>
      <Lead from={metadata.pins.p} to={[0, -50]} />
      <g transform="translate(0 -100)">
        <circle r={50} />
        <WaveformGlyph waveform={waveform} pose={pose} />
      </g>
    </>
  );
}
