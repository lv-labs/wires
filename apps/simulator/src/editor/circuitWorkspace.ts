import type { CircuitDocument } from "./core"

const prefix = "wires.workspace.v1."
const pointer = `${prefix}active`
export type CircuitEntry = {
  id: string
  document: CircuitDocument
  updated: number
  revision: string
}
export function readEntry(
  kind: "draft" | "circuit",
  id: string
): CircuitEntry | null {
  const raw = localStorage.getItem(`${prefix}${kind}.${id}`)
  if (!raw) return null
  const entry = JSON.parse(raw) as CircuitEntry
  if (
    entry.id !== id ||
    !entry.document ||
    typeof entry.document.title !== "string" ||
    !Number.isFinite(entry.updated) ||
    typeof entry.revision !== "string"
  )
    throw new Error("Invalid saved circuit")
  return entry
}
export function listEntries(kind: "draft" | "circuit"): CircuitEntry[] {
  const entries: CircuitEntry[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!
    if (!key.startsWith(`${prefix}${kind}.`)) continue
    try {
      const entry = readEntry(kind, key.slice(`${prefix}${kind}.`.length))
      if (entry) entries.push(entry)
    } catch {
      /* Keep other circuits accessible if one record is damaged. */
    }
  }
  return entries.sort((a, b) => b.updated - a.updated)
}
export function writeEntry(kind: "draft" | "circuit", entry: CircuitEntry) {
  localStorage.setItem(`${prefix}${kind}.${entry.id}`, JSON.stringify(entry))
}
export async function removeEntry(kind: "draft" | "circuit", id: string) {
  const remove = () => localStorage.removeItem(`${prefix}${kind}.${id}`)
  if (navigator.locks) await navigator.locks.request(`${prefix}save`, remove)
  else remove()
}
export function startWorkspace(fallback: CircuitDocument, reload = isReload()) {
  let document = fallback
  let previous: string | null = null
  try {
    previous = sessionStorage.getItem(pointer)
    const draft = previous ? readEntry("draft", previous) : null
    if (draft) document = draft.document
    // Migrate previous autosaves and library circuits into recovery, never into
    // the starting sheet of a fresh tab. Keep the originals for rollback.
    const legacy = localStorage.getItem("circuit-editor-prototype.v1")
    if (legacy && !localStorage.getItem(`${prefix}migrated`)) {
      writeEntry("draft", {
        id: "legacy-recovery",
        document: JSON.parse(legacy),
        updated: Date.now(),
        revision: crypto.randomUUID(),
      })
      localStorage.setItem(`${prefix}migrated`, "true")
    }
    for (const entry of listEntries("circuit")) {
      const marker = `${prefix}recovered-library.${entry.id}`
      if (localStorage.getItem(marker)) continue
      writeEntry("draft", { ...entry, id: `library-${entry.id}` })
      localStorage.setItem(marker, "true")
    }
    if (reload && draft) return { id: draft.id, document }
  } catch {
    /* Storage failures must not prevent opening the editor. */
  }
  // Duplicate Tab may copy sessionStorage: copy its document into a fresh
  // writer slot. Reload can reuse the slot because its old page has exited.
  return { id: crypto.randomUUID(), document }
}
function isReload() {
  if (typeof performance === "undefined") return false
  const navigation = performance.getEntriesByType("navigation")[0] as
    PerformanceNavigationTiming | undefined
  return navigation?.type === "reload"
}
export function rememberDraft(id: string) {
  sessionStorage.setItem(pointer, id)
}

export async function circuitLink(document: CircuitDocument) {
  const stream = new Blob([JSON.stringify(document)])
    .stream()
    .pipeThrough(new CompressionStream("gzip"))
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer())
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  const url = new URL(location.href)
  url.hash = `circuit=v1.${btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "")}`
  return url.href
}
export async function readCircuitLink(
  hash: string
): Promise<CircuitDocument | null> {
  if (!hash.startsWith("#circuit=v1.")) return null
  const encoded = hash.slice("#circuit=v1.".length)
  if (encoded.length > 2_000_000) throw new Error("Circuit link is too large")
  const bytes = Uint8Array.from(
    atob(encoded.replaceAll("-", "+").replaceAll("_", "/")),
    (c) => c.charCodeAt(0)
  )
  const reader = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"))
    .getReader()
  const chunks: Uint8Array<ArrayBuffer>[] = []
  let length = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      length += value.length
      if (length > 8_000_000) throw new Error("Circuit link is too large")
      chunks.push(new Uint8Array(value))
    }
  } finally {
    await reader.cancel()
  }
  return JSON.parse(await new Blob(chunks).text()) as CircuitDocument
}
