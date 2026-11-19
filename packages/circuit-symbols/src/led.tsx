import { useId } from "react";
import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "led";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.

  prefix: "D",
  name: "LED",
  pins: {
    anode: [-100, 0],
    cathode: [100, 0],
  },
  parameters: {
    model: "default-led",
    red: 1,
    green: 0,
    blue: 0,
    maxCurrent: 0.01,
  },
} as const;

export function Symbol({
  parameters = metadata.parameters,
  current = 0,
  highlighted = false,
  glow = 1,
}: SymbolProps) {
  const glowId = `led-glow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const glowIntensity =
    typeof glow === "number"
      ? Number.isFinite(glow)
        ? Math.max(0, Math.min(1, glow))
        : 0
      : glow
        ? 1
        : 0;
  const brightness = Math.max(
    0,
    Math.min(
      1,
      current > 0
        ? 1 + 0.2 * Math.log(current / Number(parameters.maxCurrent))
        : 0,
    ),
  );
  const color = `rgb(${Math.round(255 * Number(parameters.red ?? 1) * brightness)},${Math.round(255 * Number(parameters.green ?? 0) * brightness)},${Math.round(255 * Number(parameters.blue ?? 0) * brightness)})`;
  return (
    <>
      {/* Keep the hover target stable when the indicator changes to a diode. */}
      <circle r={55} fill="transparent" stroke="none" pointerEvents="all" />
      <Lead from={metadata.pins.anode} to={[highlighted ? -30 : -40, 0]} />
      <Lead from={metadata.pins.cathode} to={[highlighted ? 30 : 40, 0]} />
      {highlighted ? (
        <>
          <polygon points="30,0 -30,-40, -30,40" fill={color} />
          <path
            d="M 30 -40
              V 40"
          />
          <path
            d="M -12 -56
              L 12 -80
              M 0 -80
              H 12
              V -68
              M 12 -40
              L 36 -64
              M 24 -64
              H 36
              V -52"
          />
        </>
      ) : (
        <>
          {glowIntensity > 0 && brightness > 0 && color !== "rgb(0,0,0)" && (
            <>
              <defs>
                <filter
                  id={glowId}
                  filterUnits="userSpaceOnUse"
                  x={-150}
                  y={-150}
                  width={300}
                  height={300}
                  colorInterpolationFilters="sRGB"
                >
                  <feGaussianBlur stdDeviation={12} />
                </filter>
              </defs>
              <circle
                r={70}
                fill={color}
                stroke="none"
                opacity={0.55 * brightness * glowIntensity}
                filter={`url(#${glowId})`}
                pointerEvents="none"
              />
            </>
          )}
          <circle r={40} />
          <circle r={39} fill={color} stroke="none" />
        </>
      )}
    </>
  );
}
