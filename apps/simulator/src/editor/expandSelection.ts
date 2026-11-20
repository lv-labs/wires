import { core } from "./core"
import type { CircuitDocument, Entity, Target } from "./core"

type Connection = { wireId: string; end: string }
type Endpoint = Extract<Target, { kind: "pin" | "junction" }>

export function expandSelection(
  document: CircuitDocument,
  selection: Entity[]
) {
  const { referenceKey, token } = core.geometry
  const selected = new Set(selection.map(({ kind, id }) => token(kind, id)))
  const endpoints = new Map<string, { entity: Entity; edges: Connection[] }>()
  function addConnection(from: Endpoint, to: Endpoint, wireId: string) {
    const key = referenceKey(from)
    let endpoint = endpoints.get(key)
    if (!endpoint) {
      const entity: Entity =
        from.kind === "pin"
          ? { kind: "component", id: from.componentId }
          : { kind: "junction", id: from.junctionId }
      endpoint = { entity, edges: [] }
      endpoints.set(key, endpoint)
    }
    endpoint.edges.push({ wireId, end: referenceKey(to) })
  }
  for (const { id, from, to } of document.electrical.wires) {
    if (from.kind === "point" || from.kind === "wire") continue
    if (to.kind === "point" || to.kind === "wire") continue
    addConnection(from, to, id)
    addConnection(to, from, id)
  }

  const additions = new Map<string, Entity>()
  const visited = new Set<string>()
  for (const start of endpoints.keys()) {
    if (visited.has(start)) continue

    const queue = [start]
    visited.add(start)
    const net = new Map<string, Entity>()
    const components = new Map<string, Entity>()
    for (const key of queue) {
      const { entity, edges } = endpoints.get(key)!
      const members = entity.kind === "component" ? components : net
      members.set(token(entity.kind, entity.id), entity)

      for (const { wireId, end } of edges) {
        net.set(token("wire", wireId), { kind: "wire", id: wireId })
        if (visited.has(end)) continue
        visited.add(end)
        queue.push(end)
      }
    }

    if (
      ![...net.keys()].some((key) => selected.has(key)) &&
      ![...components.keys()].some((key) => selected.has(key))
    )
      continue

    // Complete this net before crossing through any of its components.
    const missing = [...net].filter(([key]) => !selected.has(key))
    for (const [key, entity] of missing.length ? missing : components) {
      if (!selected.has(key)) additions.set(key, entity)
    }
  }
  return additions.size ? [...selection, ...additions.values()] : selection
}
