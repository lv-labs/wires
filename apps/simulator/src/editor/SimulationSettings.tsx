import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditorDialog } from "./EditorDialog"

export function SimulationSettings({
  timeStep,
  onApply,
  onClose,
}: {
  timeStep: number
  onApply: (seconds: number) => void
  onClose: () => void
}) {
  const [error, setError] = useState("")
  return (
    <EditorDialog title="Simulation settings" onClose={onClose}>
      <form
        className="grid gap-4 text-sm"
        onSubmit={(event) => {
          event.preventDefault()
          try {
            const seconds =
              Number(new FormData(event.currentTarget).get("timeStep")) / 1e6
            if (!Number.isFinite(seconds) || seconds <= 0)
              throw new Error("Time step must be a positive, finite number.")
            onApply(seconds)
            onClose()
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause))
          }
        }}
      >
        <label className="grid gap-1.5">
          Time step (µs)
          <Input
            name="timeStep"
            type="number"
            step="any"
            min={0}
            required
            defaultValue={Number((timeStep * 1e6).toPrecision(15))}
            data-primary
          />
        </label>
        <p className="text-xs text-muted-foreground">
          Default: 5 µs. Smaller steps improve time resolution and require more
          computation.
        </p>
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
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
