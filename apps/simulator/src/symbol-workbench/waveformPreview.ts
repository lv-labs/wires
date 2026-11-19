export const waveformChoices = [
  ["dc", "DC"],
  ["sine", "AC / Sine"],
  ["square", "Square"],
  ["triangle", "Triangle"],
  ["sawtooth", "Sawtooth"],
  ["pulse", "Pulse"],
] as const
export type WaveformKind = (typeof waveformChoices)[number][0]
export type PreviewWaveform = {
  kind: WaveformKind
  [key: string]: string | number
}
export function previewWaveform(
  kind: WaveformKind,
  previous: Record<string, unknown> = {}
): PreviewWaveform {
  const value = (key: string, fallback: number) =>
    typeof previous[key] === "number" && Number.isFinite(previous[key])
      ? (previous[key] as number)
      : fallback
  if (kind === "dc") return { kind, voltage: value("voltage", 5) }
  return {
    kind,
    amplitude: value("amplitude", 1),
    frequency: value("frequency", 1000),
    offset: value("offset", 0),
    phase: value("phase", 0),
    ...(kind === "square" || kind === "pulse"
      ? { dutyCycle: value("dutyCycle", 0.5) }
      : {}),
  }
}
