import type { CircuitDocument } from "./core"

export function splitLegacyProbes(document: CircuitDocument): CircuitDocument {
  if (!document.layout.probes) return document
  const layout = { ...document.layout.probes }
  const markers: CircuitDocument["probes"] = []
  const sourceIds = new Map<string, string>()
  const usedIds = new Set(document.probes.map(({ id }) => id))
  for (const probe of document.probes) {
    if (
      probe.kind !== "voltage" ||
      probe.scope !== undefined ||
      !Object.hasOwn(layout, probe.id)
    )
      continue
    // Keep the trace ID so saved scope assignments still point to it.
    let id = `${probe.id}:marker`
    while (usedIds.has(id)) id += ":marker"
    usedIds.add(id)
    sourceIds.set(probe.id, id)
    const { label, positive, negative, reference } = probe
    markers.push(
      structuredClone({
        id,
        kind: "voltage",
        label,
        positive,
        negative,
        reference,
        scope: false,
      })
    )
    layout[id] = layout[probe.id]
    delete layout[probe.id]
  }
  return markers.length
    ? {
        ...document,
        layout: { ...document.layout, probes: layout },
        probes: [
          ...document.probes.map((trace) => {
            const sourceProbeId = sourceIds.get(trace.id)
            return sourceProbeId ? { ...trace, sourceProbeId } : trace
          }),
          ...markers,
        ],
      }
    : document
}

export function formatProbeVoltage(
  voltage: number | undefined,
  decimals: number
) {
  if (voltage === undefined) return { magnitude: "—", negative: false }
  const magnitude = Math.abs(voltage).toFixed(decimals)
  return {
    magnitude: `${magnitude} V`,
    negative: voltage < 0 && Number(magnitude) !== 0,
  }
}
