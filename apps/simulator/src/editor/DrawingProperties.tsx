import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { EditorDialog } from "./EditorDialog"
import type { Drawing } from "./core"
export function DrawingProperties({
  drawing,
  title,
  styleOnly = false,
  onApply,
  onClose,
}: {
  drawing: Drawing
  title?: string
  styleOnly?: boolean
  onApply: (drawing: Drawing) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState(drawing),
    [error, setError] = useState("")
  function update(values: Partial<Drawing>) {
    setDraft((d) => ({ ...d, ...values }))
  }
  return (
    <EditorDialog
      title={
        title ??
        `${drawing.kind === "box" ? "Box" : drawing.kind.charAt(0).toUpperCase() + drawing.kind.slice(1)} appearance`
      }
      onClose={onClose}
    >
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (
            !Number.isFinite(draft.strokeWidth) ||
            draft.strokeWidth < 0 ||
            draft.strokeWidth > 50 ||
            !Number.isFinite(draft.fontSize) ||
            draft.fontSize < 8 ||
            draft.fontSize > 300
          ) {
            setError("Use a line width from 0–50 and a font size from 8–300.")
            return
          }
          onApply(draft)
        }}
      >
        {(draft.kind === "text" || styleOnly) && (
          <>
            {!styleOnly && (
              <label className="grid gap-2 text-xs">
                Text
                <Textarea
                  data-primary
                  aria-label="Drawing text"
                  value={draft.text}
                  maxLength={4096}
                  onChange={(e) => update({ text: e.target.value })}
                />
              </label>
            )}
            <label className="grid gap-2 text-xs">
              Font size
              <Input
                aria-label="Drawing font size"
                type="number"
                min="8"
                max="300"
                value={draft.fontSize}
                onChange={(e) => update({ fontSize: Number(e.target.value) })}
              />
            </label>
          </>
        )}
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2 text-xs">
            Stroke colour
            <Input
              aria-label="Stroke colour"
              type="color"
              value={draft.stroke.startsWith("#") ? draft.stroke : "#808080"}
              onChange={(e) => update({ stroke: e.target.value })}
            />
          </label>
          <label className="grid gap-2 text-xs">
            Fill / text colour
            <Input
              aria-label="Fill colour"
              type="color"
              value={draft.fill.startsWith("#") ? draft.fill : "#d9e5c9"}
              onChange={(e) => update({ fill: e.target.value })}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={draft.stroke === "currentColor"}
              onCheckedChange={(checked) =>
                update({ stroke: checked ? "currentColor" : "#808080" })
              }
            />
            Theme stroke
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={draft.fill === "none"}
              onCheckedChange={(checked) =>
                update({ fill: checked ? "none" : "#d9e5c9" })
              }
            />
            No fill
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={draft.fill === "currentColor"}
              onCheckedChange={(checked) =>
                update({ fill: checked ? "currentColor" : "#d9e5c9" })
              }
            />
            Theme fill
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2 text-xs">
            Line width
            <Input
              aria-label="Drawing line width"
              type="number"
              min="0"
              max="50"
              step="0.25"
              value={draft.strokeWidth}
              onChange={(e) => update({ strokeWidth: Number(e.target.value) })}
            />
          </label>
          <label className="grid gap-2 text-xs">
            Line style
            <NativeSelect
              aria-label="Drawing line style"
              value={draft.strokeStyle}
              onChange={(e) =>
                update({
                  strokeStyle: e.target.value as Drawing["strokeStyle"],
                })
              }
            >
              {["solid", "dashed", "dotted"].map((style) => (
                <NativeSelectOption key={style} value={style}>
                  {style}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Drag the drawing to move it. Select it to resize using its handles.
        </p>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Apply</Button>
        </div>
      </form>
    </EditorDialog>
  )
}
