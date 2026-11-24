import { Upright } from "./svg";
import type { Pose } from "./svg";

import { useEffect, useId, useState } from "react";

// Shared by the one- and two-terminal voltage source symbols.
const waveforms: Record<string, string> = {
  dc: `M -24 -9 H 24
    M -24 9 H -14
    M -5 9 H 5
    M 14 9 H 24`,
  sine: `M -25 0
    C -20 -30, -5 -30, 0 0
    S 17.5 30, 25 0`,
  square: `M -25 15
    V -15
    H 0
    V 15
    H 25
    V -15`,
  triangle: `M -25 15
    L -8.3333 -15
    L 8.333 15
    L 25 -15`,
  sawtooth: `M -25 15
    V -15
    L 0 15
    V -15
    L 25 15`,
  pulse: `M -25 15
    V -15
    H -14
    V 15
    H 25
    V -15`,
};

export function WaveformGlyph({
  waveform,
  pose,
}: {
  waveform: unknown;
  pose?: Pose;
}) {
  const kind =
    waveform && typeof waveform === "object" && "kind" in waveform
      ? String(waveform.kind)
      : "dc";
  return (
    <Upright pose={pose}>
      <path d={waveforms[kind]} />
    </Upright>
  );
}


// Falstad's idle preview traverses the frequency range and back in two seconds.
export function idleSweepProgress(milliseconds: number) {
  const time = ((milliseconds % 2000) + 2000) % 2000;
  return (time <= 1000 ? time : 2000 - time) / 1000;
}

export function sweepSinePath(progress: number) {
  const cycles = 1 + 2 * Math.max(0, Math.min(1, progress));
  // Repeat the authored sine curve, compressing X coordinates rather than the
  // SVG element so stroke weight stays the same while the frequency changes.
  // Expand the starter glyph's 50-unit period to fill the 100-unit source circle.
  const source = waveforms.sine;
  if (
    !/^\s*M/.test(source) ||
    /[A-Za-z]/.test(source.replace(/[MLHVCSQTZ]/g, ""))
  )
    return source;
  return (cycles === 1 ? [0] : [-1, 0, 1])
    .map((tile) => {
      let command = "M",
        index = 0;
      return source.replace(
        /[MLHVCSQTZ]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g,
        (token) => {
          if (/^[A-Z]$/.test(token)) {
            command = token;
            index = 0;
            return token;
          }
          const horizontal =
            command === "H" || (command !== "V" && index % 2 === 0);
          index++;
          return horizontal
            ? String(
                Number(((2 * (Number(token) + tile * 50)) / cycles).toFixed(5)),
              )
            : token;
        },
      );
    })
    .join("\n");
}

export function SweepGlyph({
  frequency,
  minFrequency,
  maxFrequency,
  pose,
}: {
  frequency?: number;
  minFrequency: number;
  maxFrequency: number;
  pose?: Pose;
}) {
  const [idleProgress, setIdleProgress] = useState(0);
  const live = typeof frequency === "number" && Number.isFinite(frequency);
  const clip = `sweep-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  useEffect(() => {
    if (live) return;
    let request: number;
    const animate = (time: number) => {
      setIdleProgress(idleSweepProgress(time));
      request = requestAnimationFrame(animate);
    };
    request = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(request);
  }, [live]);
  const range = maxFrequency - minFrequency;
  const progress = live
    ? range > 0
      ? (frequency - minFrequency) / range
      : 0
    : idleProgress;
  return (
    <Upright pose={pose}>
      <defs>
        <clipPath id={clip}>
          <circle r={50} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <path d={sweepSinePath(progress)} />
      </g>
    </Upright>
  );
}
