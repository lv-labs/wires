import { useId } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { ProbeDisplay } from "./core"
import { EditorDialog } from "./EditorDialog"

export function ProbeProperties({
  label,
  display,
  onApply,
  onClose,
}: {
  label?: string
  display: ProbeDisplay
  onApply: (label: string, display: Required<ProbeDisplay>) => void
  onClose: () => void
}) {
  const showLabelId = useId()
  return (
    <EditorDialog title="Voltage probe properties" onClose={onClose}>
      <form
        className="grid gap-4 text-sm"
        onSubmit={(event) => {
          event.preventDefault()
          const fields = new FormData(event.currentTarget)
          onApply(String(fields.get("label") ?? "").trim(), {
            decimals: Number(fields.get("decimals")),
            showLabel: fields.has("showLabel"),
          })
        }}
      >
        <label className="grid gap-1.5">
          Name
          <Input
            name="label"
            defaultValue={label ?? ""}
            maxLength={80}
            data-primary
          />
        </label>
        <label className="grid gap-1.5">
          Decimal places
          <Input
            name="decimals"
            type="number"
            min={0}
            max={6}
            step={1}
            required
            defaultValue={display.decimals ?? 3}
          />
        </label>
        <div className="flex items-center gap-2">
          <Checkbox
            id={showLabelId}
            name="showLabel"
            defaultChecked={display.showLabel ?? false}
          />
          <label htmlFor={showLabelId}>Show label</label>
        </div>
        <div className="flex justify-end gap-2 border-t pt-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </EditorDialog>
  )
}
