import { core } from "./core"
import type { CircuitDocument, Target } from "./core"

export function scopeSource(document: CircuitDocument, traceId: string | null) {
  const probe = document.probes.find(({ id }) => id === traceId)
  if (!probe) return null

  const components = new Set<string>()
  const wires = new Set<string>()
  const terminals = new Map<string, Target>()
  const queue: string[] = []
  const hasMarker = !!document.layout.probes?.[probe.id]
  const key = core.geometry.referenceKey

  if (probe.kind === "current" && probe.componentId) {
    components.add(probe.componentId)
  } else if (probe.kind === "voltage") {
    for (const terminal of [
      probe.positive,
      probe.reference === "ground" ? undefined : probe.negative,
    ]) {
      if (terminal?.kind !== "pin" && terminal?.kind !== "junction") continue
      const terminalKey = key(terminal)
      terminals.set(terminalKey, terminal)
      if (terminal.kind === "pin" && !hasMarker)
        components.add(terminal.componentId)
      else
        queue.push(terminalKey)
    }
  }

  if (queue.length) {
    const connections = new Map<string, { id: string; other: string }[]>()
    for (const wire of document.electrical.wires) {
      const from = key(wire.from)
      const to = key(wire.to)
      for (const [end, other] of [[from, to], [to, from]]) {
        const edges = connections.get(end) ?? []
        edges.push({ id: wire.id, other })
        connections.set(end, edges)
      }
    }
    const visited = new Set(queue)
    for (const end of queue) {
      for (const { id, other } of connections.get(end) ?? []) {
        wires.add(id)
        if (visited.has(other)) continue
        visited.add(other)
        queue.push(other)
      }
    }
  }

  // The visible marker already identifies the positive terminal.
  if (hasMarker && probe.positive) terminals.delete(key(probe.positive))
  return { components, wires, terminals }
}
