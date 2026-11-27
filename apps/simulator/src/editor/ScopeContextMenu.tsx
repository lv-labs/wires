import type { RefObject } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { formatScope, traceDisplay } from "./scopeDisplay"
import {
  minimumValueDivision,
  timeDivisions,
  valueDivisions,
} from "./scopeScales"
import type { ScopeTrace } from "./ScopePane"
export type ScopeMode = "docked" | "floating" | "sheet"
export type TracePatch = { scale?: number; offset?: number }

export function ScopeContextMenu({
  menu,
  traces,
  selectedTrace,
  onSelectTrace,
  scopes,
  mode,
  timeDivision,
  hideUi,
  owner,
  onClose,
  onTime,
  onToggleUi,
  onTrace,
  getDisplayScale,
  onMode,
  onCombine,
  onSeparate,
  onDelete,
  onArrange,
}: {
  menu: { x: number; y: number }
  traces: ScopeTrace[]
  selectedTrace?: string
  onSelectTrace: (id: string) => void
  scopes: { id: string; label: string }[]
  mode: ScopeMode
  timeDivision: number
  hideUi: boolean
  owner: RefObject<HTMLDivElement | null>
  onClose: () => void
  onTime: (value: number) => void
  onToggleUi: () => void
  onTrace: (id: string, patch: TracePatch) => void
  getDisplayScale: (id: string) => number | undefined
  onMode: (mode: ScopeMode) => void
  onCombine: (id: string) => void
  onSeparate: () => void
  onDelete: () => void
  onArrange: (axis: "horizontal" | "vertical") => void
}) {
  function scaleItems(trace: ScopeTrace) {
    const unit = trace.kind === "current" ? "A" : "V"
    const scale = () => getDisplayScale(trace.id) ?? traceDisplay(trace).scale
    return (
      <>
        <DropdownMenuItem
          onClick={() => onTrace(trace.id, { scale: undefined })}
        >
          {!trace.scale ? "✓ " : ""}Auto-fit this trace
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onTrace(trace.id, {
              scale: Math.max(minimumValueDivision, scale() / 2),
            })
          }
        >
          Zoom in ×2
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onTrace(trace.id, { scale: scale() * 2 })}
        >
          Zoom out ×2
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {valueDivisions.map((value) => (
          <DropdownMenuItem
            key={value}
            onClick={() => onTrace(trace.id, { scale: value })}
          >
            {trace.scale === value ? "✓ " : ""}
            {formatScope(value, unit)}/div
          </DropdownMenuItem>
        ))}
      </>
    )
  }
  function positionItems(trace: ScopeTrace) {
    const offset = trace.offset || 0
    return (
      <>
        <DropdownMenuItem
          onClick={() =>
            onTrace(trace.id, { offset: Math.min(8, offset + 0.5) })
          }
        >
          Move up ½ division
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onTrace(trace.id, { offset: Math.max(-8, offset - 0.5) })
          }
        >
          Move down ½ division
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {[-3, -2, -1, 0, 1, 2, 3].map((value) => (
          <DropdownMenuItem
            key={value}
            onClick={() => onTrace(trace.id, { offset: value })}
          >
            {offset === value ? "✓ " : ""}
            {value === 0
              ? "Centre"
              : `${value > 0 ? "+" : ""}${value} divisions`}
          </DropdownMenuItem>
        ))}
      </>
    )
  }
  return (
    <DropdownMenu
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DropdownMenuContent
        className="w-56"
        anchor={{
          getBoundingClientRect: () => new DOMRect(menu.x, menu.y, 0, 0),
        }}
        sideOffset={0}
        alignOffset={0}
        finalFocus={() => (owner.current?.isConnected ? owner.current : false)}
      >
        <DropdownMenuItem onClick={onToggleUi}>
          {hideUi ? "Show UI" : "Hide UI"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Time scale</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {timeDivisions.map((value) => (
              <DropdownMenuItem key={value} onClick={() => onTime(value)}>
                {timeDivision === value ? "✓ " : ""}
                {formatScope(value, "s")}/div
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {traces.map((trace) => (
          <DropdownMenuSub key={trace.id}>
            <DropdownMenuSubTrigger>
              <span style={{ color: trace.color }}>
                {selectedTrace === trace.id ? "✓ " : ""}
                {trace.label}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onSelectTrace(trace.id)}>
                Use for vertical axis
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Vertical scale</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {scaleItems(trace)}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Vertical position
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {positionItems(trace)}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
        <DropdownMenuSeparator />
        {mode === "docked" && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Dock layout</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onArrange("horizontal")}>
                Side by side
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArrange("vertical")}>
                Stack vertically
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        {mode === "docked" ? (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Undock</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onMode("floating")}>
                Floating panel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMode("sheet")}>
                Place on sheet
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : (
          <>
            <DropdownMenuItem onClick={() => onMode("docked")}>
              Dock below sheet
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onMode(mode === "sheet" ? "floating" : "sheet")}
            >
              {mode === "sheet" ? "Float over sheet" : "Place on sheet"}
            </DropdownMenuItem>
          </>
        )}
        {scopes.length > 0 && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Combine with</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {scopes.map((scope) => (
                <DropdownMenuItem
                  key={scope.id}
                  onClick={() => onCombine(scope.id)}
                >
                  {scope.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        {traces.length > 1 && (
          <DropdownMenuItem onClick={onSeparate}>
            Separate traces into scopes
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          aria-keyshortcuts="Delete Backspace"
          variant="destructive"
          onClick={onDelete}
        >
          Delete scope
          <DropdownMenuShortcut aria-hidden="true">Delete</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
