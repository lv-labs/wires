import { minimumValueDivision } from "./scopeScales"

export function formatScope(value: number | null | undefined, unit = "") {
  if (value == null || !Number.isFinite(value)) return "—"
  if (Math.abs(value) < 1e-15) value = 0
  const [scale, prefix] = [
    [1, ""],
    [1e-3, "m"],
    [1e-6, "µ"],
    [1e-9, "n"],
    [1e-12, "p"],
  ].find(([size]) => Math.abs(value) >= Number(size)) || [1, ""]
  return `${Number((value / Number(scale)).toPrecision(4))} ${prefix}${unit}`.trim()
}

const timeUnits = [
  { scale: 1, unit: "s" },
  { scale: 1e-3, unit: "ms" },
  { scale: 1e-6, unit: "µs" },
  { scale: 1e-9, unit: "ns" },
  { scale: 1e-12, unit: "ps" },
]

/** Use the same unit and decimal places across the whole ruler. */
export function scopeTimeRuler(end: number, timeDivision: number) {
  const { scale, unit } =
    timeUnits.find(({ scale }) => end >= scale) ?? timeUnits[4]
  const decimals = Math.min(
    12,
    Math.max(0, Math.ceil(Math.log10(scale / timeDivision)))
  )
  return { unit, format: (time: number) => (time / scale).toFixed(decimals) }
}

/** Statistics of raw samples in the visible window (also in AC display mode). */
export function scopeMeasurements(values: number[]) {
  if (!values.length) return { mean: null, rms: null, peakToPeak: null }
  let mean = 0,
    meanSquare = 0,
    min = Infinity,
    max = -Infinity
  values.forEach((value, i) => {
    mean += (value - mean) / (i + 1)
    meanSquare += (value * value - meanSquare) / (i + 1)
    min = Math.min(min, value)
    max = Math.max(max, value)
  })
  return {
    mean,
    rms: Math.sqrt(Math.max(0, meanSquare)),
    peakToPeak: max - min,
  }
}

export function scopeBounds(times: number[], span: number) {
  const end = Math.max(span, times.at(-1) || 0)
  const start = Math.max(0, end - span)
  return { start, end, index: sampleLowerBound(times, start) }
}

/** Crop a pane independently while acquisition retains the longest requested window. */
export function scopeWindow<
  T extends { values: number[]; min: number | null; max: number | null },
>(channels: T[], times: number[], span: number) {
  const { start, end, index } = scopeBounds(times, span)
  if (index === 0) return { start, end, times, channels }
  return {
    start,
    end,
    times: times.slice(index),
    channels: channels.map((channel) => {
      const values = channel.values.slice(index)
      let min = Infinity,
        max = -Infinity
      for (const value of values) {
        min = Math.min(min, value)
        max = Math.max(max, value)
      }
      return {
        ...channel,
        values,
        min: values.length ? min : null,
        max: values.length ? max : null,
        last: values.at(-1),
      }
    }),
  }
}

export const scopePathScale = 4

/** Encode a quarter-pixel grid and collapse flat runs before submitting the SVG path. */
export function scopePath(
  points: [number, number][],
  x: (time: number) => number,
  y: (value: number) => number
) {
  let path = ""
  let lastY: number | undefined
  let lastX: number | undefined
  let pendingX: number | undefined
  for (const [time, value] of points) {
    const nextX = Math.round(x(time) * scopePathScale)
    const nextY = Math.round(y(value) * scopePathScale)
    if (nextY === lastY) {
      pendingX = nextX
      continue
    }
    if (pendingX !== undefined && pendingX !== lastX) path += `H${pendingX}`
    path += `${path ? "L" : "M"}${nextX} ${nextY}`
    lastX = nextX
    lastY = nextY
    pendingX = undefined
  }
  if (pendingX !== undefined && pendingX !== lastX) path += `H${pendingX}`
  return path
}

/** One trace owns its vertical mapping, independent of other traces in its pane. */
export function traceDisplay(trace: {
  values: number[]
  min: number | null
  max: number | null
  scale?: number
  offset?: number
  coupling?: string
  kind?: string
}) {
  let mean = 0
  if (trace.coupling === "ac") {
    for (let i = 0; i < trace.values.length; i++)
      mean += (trace.values[i] - mean) / (i + 1)
  }
  const peak =
    trace.min === null || trace.max === null
      ? 0
      : Math.max(Math.abs(trace.min - mean), Math.abs(trace.max - mean))
  const target = peak / 3.5
  const power = target > 0 ? 10 ** Math.floor(Math.log10(target)) : 0
  const automatic =
    power > 0
      ? Math.max(
          minimumValueDivision,
          ([1, 2, 5, 10].find((step) => step * power >= target) || 10) * power
        )
      : trace.kind === "current"
        ? 0.001
        : 1
  const scale =
    Number.isFinite(trace.scale) && (trace.scale || 0) > 0
      ? trace.scale!
      : automatic
  return {
    mean,
    scale,
    automatic,
    peak,
    offset: trace.offset || 0,
    unit: trace.kind === "current" ? "A" : "V",
  }
}

type AutoRange = {
  scale: number
  sampleTime: number
  coupling: string | undefined
  shrinkSince?: number
}

const autoRangeSettleMs = 1200
const autoRangeShrinkDivisions = 1.4

/** Keep headroom for peaks, and require a sustained drop before zooming in. */
export function updateAutoRange(
  previous: AutoRange | undefined,
  display: Pick<ReturnType<typeof traceDisplay>, "automatic" | "peak">,
  coupling: string | undefined,
  sampleTime: number,
  now: number
): AutoRange {
  const { automatic, peak } = display
  if (
    !previous ||
    sampleTime < previous.sampleTime ||
    coupling !== previous.coupling ||
    peak > 4 * previous.scale
  ) {
    return { scale: automatic, sampleTime, coupling }
  }

  const { scale } = previous
  if (automatic >= scale || peak > autoRangeShrinkDivisions * scale)
    return { scale, sampleTime, coupling }
  if (sampleTime === previous.sampleTime) return previous

  const shrinkSince = previous.shrinkSince ?? now
  return now - shrinkSince >= autoRangeSettleMs
    ? { scale: automatic, sampleTime, coupling }
    : { scale, sampleTime, coupling, shrinkSince }
}

function sampleLowerBound(times: number[], time: number, low = 0) {
  let high = times.length
  while (low < high) {
    const middle = (low + high) >>> 1
    if (times[middle] < time) low = middle + 1
    else high = middle
  }
  return low
}
/** Select an actual acquisition sample once, in the hovered pane. */
export function nearestScopeSample(
  times: number[],
  time: number,
  first = 0
): number | null {
  if (first >= times.length) return null
  const next = sampleLowerBound(times, time, first)
  if (next === first) return times[first]
  if (next === times.length) return times[next - 1]
  return time - times[next - 1] <= times[next] - time
    ? times[next - 1]
    : times[next]
}
/** Other panes must show the identical sample, never a nearby substitute. */
export function scopeSampleIndex(times: number[], time: number) {
  const index = sampleLowerBound(times, time)
  return times[index] === time ? index : -1
}
