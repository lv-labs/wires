import { core } from "../editor/core"
import "../editor/menu/legacy-component-menu.js"
import "../editor/menu/component-menu.js"

type MenuEntry = { label: string; children?: MenuEntry[]; tool?: string | null }
const menu = (
  globalThis as typeof globalThis & {
    CircuitComponentMenu: {
      entries(
        definitions: typeof core.catalog.placementDefinitions
      ): MenuEntry[]
    }
  }
).CircuitComponentMenu

// Use the Add menu's hierarchy and ordering; placement presets share a source file.
export function libraryGroups(kinds: string[]) {
  const remaining = new Set(kinds)
  const groups: { label: string; kinds: string[] }[] = []
  function add(label: string, entries: MenuEntry[]) {
    const members: string[] = []
    for (const entry of entries) {
      if (entry.children) {
        add(entry.label, entry.children)
        continue
      }
      if (!entry.tool) continue
      const kind =
        core.catalog.placementDefinitions[entry.tool]?.kind ?? entry.tool
      if (remaining.delete(kind)) members.push(kind)
    }
    if (members.length) groups.push({ label, kinds: members })
  }
  const entries = menu.entries(core.catalog.placementDefinitions)
  // The ungrouped entries (such as Resistor) appear first in the Add menu.
  add(
    "Components",
    entries.filter((entry) => !entry.children)
  )
  for (const entry of entries)
    if (entry.children) add(entry.label, entry.children)
  if (remaining.size)
    groups.push({ label: "Other symbols", kinds: [...remaining] })
  return groups
}
