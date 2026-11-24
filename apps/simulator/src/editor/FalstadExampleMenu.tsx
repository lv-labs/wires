import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import menuJson from "./menu/falstad-example-menu.json"

type Entry =
  | { title: string; file: string; enabled: boolean; scopeWarning?: boolean }
  | { title: string; children: Entry[] }

const menu: Entry[] = menuJson

type OpenExample = (file: string, title: string, scopeWarning?: boolean) => void

function ExampleItems({
  entries,
  onOpen,
}: {
  entries: Entry[]
  onOpen: OpenExample
}) {
  return entries.map((entry) => {
    if ("children" in entry) {
      return (
        <MenubarSub key={entry.title}>
          <MenubarSubTrigger>{entry.title}</MenubarSubTrigger>
          <MenubarSubContent>
            <ExampleItems entries={entry.children} onOpen={onOpen} />
          </MenubarSubContent>
        </MenubarSub>
      )
    }
    return (
      <MenubarItem
        key={`${entry.file}:${entry.title}`}
        disabled={!entry.enabled}
        onClick={() => onOpen(entry.file, entry.title, entry.scopeWarning)}
      >
        {entry.title}
      </MenubarItem>
    )
  })
}

export function FalstadExampleMenu({ onOpen }: { onOpen: OpenExample }) {
  return (
    <MenubarMenu>
      <MenubarTrigger>Circuits</MenubarTrigger>
      <MenubarContent>
        <ExampleItems entries={menu} onOpen={onOpen} />
      </MenubarContent>
    </MenubarMenu>
  )
}
