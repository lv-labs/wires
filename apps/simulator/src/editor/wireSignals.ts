import { core } from "./core"
import type { CircuitDocument, Frame, Target } from "./core"

// Wire currents are unique on tree branches. Ideal wire loops and branches
// between multiple implicit ground connections remain unassigned.
export function wireSignals(document: CircuitDocument, frame?: Frame | null) {
  const components = new Map(
    document.electrical.components.map((c) => [c.id, c])
  )
  const nodes = new Map<
    string,
    {
      refs: Target[]
      edges: Set<string>
      injection: number
      known: boolean
      voltage?: number
    }
  >()
  const edges = new Map<string, { from: string; to: string }>()
  const key = core.geometry.referenceKey
  function node(ref: Target) {
    const id = key(ref)
    if (!nodes.has(id)) {
      const component =
        ref.kind === "pin" ? components.get(ref.componentId) : null
      const current =
        ref.kind === "pin"
          ? frame?.pinCurrents?.[ref.componentId]?.[ref.pinId]
          : 0
      nodes.set(id, {
        refs: [ref],
        edges: new Set(),
        injection: Number.isFinite(current) ? -current! : 0,
        known:
          ref.kind === "junction" ||
          (component?.kind !== "ground" && Number.isFinite(current)),
        voltage:
          ref.kind === "pin"
            ? frame?.pinVoltages[ref.componentId]?.[ref.pinId]
            : undefined,
      })
    }
    return nodes.get(id)!
  }
  for (const wire of document.electrical.wires) {
    edges.set(wire.id, { from: key(wire.from), to: key(wire.to) })
    node(wire.from).edges.add(wire.id)
    node(wire.to).edges.add(wire.id)
  }
  const voltages: Record<string, number> = {},
    currents: Record<string, number> = {}
  const visited = new Set<string>()
  for (const start of nodes.keys()) {
    if (visited.has(start)) continue
    const queue = [start],
      wires = new Set<string>()
    let voltage: number | undefined
    for (let i = 0; i < queue.length; i++) {
      const id = queue[i]
      if (visited.has(id)) continue
      visited.add(id)
      const n = nodes.get(id)!
      if (Number.isFinite(n.voltage)) voltage = n.voltage
      for (const edge of n.edges) {
        wires.add(edge)
        const e = edges.get(edge)!
        queue.push(e.from === id ? e.to : e.from)
      }
    }
    if (voltage !== undefined)
      for (const wire of wires) voltages[wire] = voltage
  }
  const queue = [...nodes.keys()].filter(
    (id) => nodes.get(id)!.edges.size === 1 && nodes.get(id)!.known
  )
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i],
      n = nodes.get(id)!
    if (n.edges.size !== 1 || !n.known) continue
    const edge = [...n.edges][0],
      e = edges.get(edge)!,
      otherId = e.from === id ? e.to : e.from,
      other = nodes.get(otherId)!
    if (otherId === id) continue
    currents[edge] = e.from === id ? n.injection : -n.injection
    n.edges.delete(edge)
    other.edges.delete(edge)
    other.injection += n.injection
    if (other.edges.size === 1 && other.known) queue.push(otherId)
  }
  return { voltages, currents }
}

export function voltageColour(voltage: number) {
  if (!Number.isFinite(voltage)) return "currentColor"
  const strength = Math.min(1, Math.abs(voltage) / 5)
  const target = voltage >= 0 ? [75, 200, 120] : [225, 95, 85]
  return `rgb(${target.map((value) => Math.round(145 + (value - 145) * strength)).join(" ")})`
}
