import { memo } from "react"
import { ChevronDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatScope } from "./scopeDisplay"

const auto = "auto"

export const ScopeScaleMenu = memo(function ScopeScaleMenu({
  label,
  unit,
  value,
  division,
  ac,
  presets,
  color,
  traceId,
  allowAuto,
  onChange,
}: {
  label: string
  unit: string
  value: number | undefined
  division: number
  ac?: boolean
  presets: number[]
  color?: string
  traceId?: string
  allowAuto?: boolean
  onChange: (value: number | undefined, traceId?: string) => void
}) {
  const display = `${formatScope(division, unit)}/div${ac ? " AC" : ""}`
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={`${label}, ${display}`}
        title={label}
        data-select-trace={traceId}
        className="pointer-events-auto inline-flex min-h-5 shrink-0 cursor-pointer items-center gap-0.5 rounded px-1 tabular-nums hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring data-popup-open:bg-accent"
        style={{ color }}
      >
        {display}
        <ChevronDownIcon aria-hidden="true" className="size-3 opacity-75" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        aria-label={label}
        align="end"
        className="w-max tabular-nums"
      >
        <DropdownMenuRadioGroup
          value={value === undefined ? auto : String(value)}
          onValueChange={(next) =>
            onChange(next === auto ? undefined : Number(next), traceId)
          }
        >
          {allowAuto && (
            <>
              <DropdownMenuRadioItem value={auto} closeOnClick>
                Auto
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
            </>
          )}
          {presets.map((preset) => (
            <DropdownMenuRadioItem
              key={preset}
              value={String(preset)}
              closeOnClick
            >
              {formatScope(preset, unit)}/div
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
