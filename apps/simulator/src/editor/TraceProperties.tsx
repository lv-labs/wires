import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { colourPresets } from "./colourPresets"
import { EditorDialog } from "./EditorDialog"
import { core } from "./core"
import type { CircuitDocument } from "./core"
import type { ScopeTrace } from "./ScopePane"
import { formatScope, scopeMeasurements, traceDisplay } from "./scopeDisplay"
import { TraceNumberControl } from "./TraceNumberControl"
import {
  adjacentPositions,
  adjacentValueDivisions,
  minimumValueDivision,
  positionLimit,
} from "./scopeScales"

export type TraceEdits = {
  label: string
  color: string
  scale?: number
  offset: number
  coupling: string
}

export function TraceProperties({
  probe,
  channel,
  span,
  displayedScale,
  onApply,
  onDelete,
  onClose,
}: {
  probe: CircuitDocument["probes"][number]
  channel?: ScopeTrace
  span: number
  displayedScale?: number
  onApply: (settings: TraceEdits) => void
  onDelete: () => void
  onClose: () => void
}) {
  const customInput = useRef<HTMLInputElement>(null)
  const customDetails = useRef<HTMLDetailsElement>(null)
  const [color, setColor] = useState(
    probe.color || core.signals.color(probe.id)
  )
  const [scale, setScale] = useState(probe.scale)
  const [autoScale] = useState(
    () =>
      (!probe.scale ? displayedScale : undefined) ??
      (channel
        ? traceDisplay(channel).automatic
        : probe.kind === "current"
          ? 0.001
          : 1)
  )
  const value = scale ?? autoScale
  const [offset, setOffset] = useState(probe.offset ?? 0)
  const [coupling, setCoupling] = useState(probe.coupling || "dc")
  const unit = probe.kind === "current" ? "A" : "V"
  const stats = scopeMeasurements(channel?.values || [])
  return (
    <EditorDialog title="Trace properties" onClose={onClose}>
      <form
        className="grid gap-5 text-sm"
        onSubmit={(event) => {
          event.preventDefault()
          if (!CSS.supports("color", color.trim())) {
            if (customDetails.current) customDetails.current.open = true
            customInput.current?.setCustomValidity("Enter a valid CSS colour")
            customInput.current?.reportValidity()
            return
          }
          const fields = new FormData(event.currentTarget)
          onApply({
            label: String(fields.get("label") || "").trim(),
            color,
            scale,
            offset,
            coupling,
          })
        }}
      >
        <fieldset className="grid min-w-0 gap-3">
          <legend className="mb-2 text-xs font-medium text-muted-foreground">
            Appearance · {probe.kind === "current" ? "Current" : "Voltage"}
          </legend>
          <label className="grid gap-1.5">
            Name
            <Input
              name="label"
              defaultValue={probe.label || ""}
              placeholder="Trace name"
              maxLength={80}
              data-primary
            />
          </label>
          <div className="grid gap-1.5">
            <span>Colour</span>
            <div
              className="flex flex-wrap items-center gap-1"
              role="group"
              aria-label="Trace colour"
            >
              {colourPresets.map(({ name: label, hex: value }) => (
                <Button
                  key={value}
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label={label}
                  aria-pressed={color === value}
                  title={label}
                  className={color === value ? "ring-2 ring-ring" : ""}
                  onClick={() => {
                    customInput.current?.setCustomValidity("")
                    setColor(value)
                  }}
                >
                  <span
                    className="size-5 rounded-full border border-foreground/15"
                    style={{ background: value }}
                  />
                </Button>
              ))}
            </div>
            <details
              ref={customDetails}
              className="text-xs text-muted-foreground"
            >
              <summary className="cursor-pointer">Custom colour</summary>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="size-5 shrink-0 rounded-full border"
                  style={{ background: color }}
                />
                <Input
                  ref={customInput}
                  aria-label="Custom trace colour"
                  value={color}
                  onChange={(event) => {
                    event.currentTarget.setCustomValidity("")
                    setColor(event.target.value)
                  }}
                  placeholder="#80caff"
                />
              </div>
            </details>
          </div>
        </fieldset>
        <fieldset className="grid min-w-0 gap-3 border-t pt-3">
          <legend className="px-1 text-xs font-medium text-muted-foreground">
            Scale & position
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <TraceNumberControl
              label="Vertical scale"
              inputLabel={`${unit} per division`}
              value={value}
              display={`${formatScope(value, unit)}/div`}
              min={minimumValueDivision}
              steps={adjacentValueDivisions(value)}
              onChange={setScale}
              auto={{
                active: scale === undefined,
                enable: () => setScale(undefined),
              }}
            />
            <TraceNumberControl
              label="Position"
              inputLabel="Position in divisions"
              value={offset}
              display={`${offset} div`}
              min={-positionLimit}
              max={positionLimit}
              steps={adjacentPositions(offset)}
              onChange={setOffset}
            />
          </div>
          <div className="grid gap-1.5">
            <span>Coupling</span>
            <div role="group" aria-label="Coupling" className="flex">
              {["dc", "ac"].map((mode) => (
                <Button
                  key={mode}
                  type="button"
                  variant="outline"
                  aria-pressed={mode === coupling}
                  className="relative flex-1 first:rounded-r-none last:-ml-px last:rounded-l-none focus-visible:z-10 aria-pressed:z-1 aria-pressed:border-primary aria-pressed:bg-primary/15"
                  onClick={() => setCoupling(mode)}
                >
                  {mode.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
          {coupling === "ac" && (
            <p className="text-xs text-muted-foreground">
              Removes the visible mean from the waveform. Measurements use the
              original samples.
            </p>
          )}
        </fieldset>
        <details className="border-t pt-3 text-xs">
          <summary className="cursor-pointer font-medium">
            Measurements{" "}
            <span className="font-normal text-muted-foreground">
              · {formatScope(span, "s")} window
            </span>
          </summary>
          <dl className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["Mean", stats.mean],
              ["RMS", stats.rms],
              ["Peak-to-peak", stats.peakToPeak],
              ["Minimum", channel?.min],
              ["Maximum", channel?.max],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-md bg-muted/40 px-3 py-2"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-medium tabular-nums">
                  {formatScope(value as number | null | undefined, unit)}
                </dd>
              </div>
            ))}
          </dl>
        </details>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-3">
          <Button
            type="button"
            variant="ghost"
            className="mr-auto text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            Delete trace
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </EditorDialog>
  )
}
