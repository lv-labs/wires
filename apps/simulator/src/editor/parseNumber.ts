const scales: Record<string, number> = {
  p: 1e-12,
  n: 1e-9,
  u: 1e-6,
  µ: 1e-6,
  m: 1e-3,
  k: 1e3,
  K: 1e3,
  M: 1e6,
  G: 1e9,
}

export function parseNumber(input: string, label: string) {
  const match =
    /^([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)\s*([pnuµmkKMG]?)$/.exec(
      input.trim()
    )
  const value = match ? Number(match[1]) * (scales[match[2]] ?? 1) : NaN
  if (!Number.isFinite(value))
    throw new Error(
      `${label} requires a finite number. You can use p, n, u, m, k, M or G.`
    )
  return value
}


// Keep edit fields readable without the display formatter's four-digit rounding.
export function formatNumberInput(value: number) {
  const prefixes = ["G", "M", "k", "", "m", "u", "n", "p"]
  const prefix = prefixes.find((prefix) => Math.abs(value) >= (scales[prefix] ?? 1)) ?? ""
  const scaled = value / (scales[prefix] ?? 1)
  return `${Number(scaled.toPrecision(15))}${prefix}`
}
