import { useCallback, useRef, useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TraceNumberControl({
  label,
  inputLabel,
  value,
  display,
  min,
  max,
  steps,
  onChange,
  auto,
}: {
  label: string
  inputLabel: string
  value: number
  display: string
  min: number
  max?: number
  steps: { smaller?: number; larger?: number }
  onChange: (value: number) => void
  auto?: { active: boolean; enable: () => void }
}) {
  const [editing, setEditing] = useState(false)
  const valueButton = useRef<HTMLButtonElement>(null)
  const focusInput = useCallback((input: HTMLInputElement | null) => {
    input?.focus()
    input?.select()
  }, [])

  function closeInput(restoreFocus: boolean) {
    setEditing(false)
    if (restoreFocus) requestAnimationFrame(() => valueButton.current?.focus())
  }

  return (
    <div className="grid min-w-0 content-start gap-1.5">
      <div className="flex items-center justify-between gap-1">
        <span>{label}</span>
        {auto && (
          <button
            type="button"
            aria-pressed={auto.active}
            className="cursor-pointer rounded px-1 text-xs text-muted-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground"
            onClick={() => {
              auto.enable()
              closeInput(false)
            }}
          >
            Auto
          </button>
        )}
      </div>
      <div
        role="group"
        aria-label={label}
        className="flex min-w-0 [&_button]:relative [&_button]:focus-visible:z-10"
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 rounded-r-none"
          aria-label={`Decrease ${label.toLowerCase()}`}
          title="Previous preset"
          disabled={steps.smaller === undefined}
          onClick={() => {
            if (steps.smaller !== undefined) onChange(steps.smaller)
            closeInput(false)
          }}
        >
          <MinusIcon aria-hidden="true" />
        </Button>
        {editing ? (
          <Input
            ref={focusInput}
            aria-label={inputLabel}
            className="relative z-10 h-7 min-w-0 flex-1 [appearance:textfield] rounded-none border-x-0 px-1 text-center tabular-nums [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            min={min}
            max={max}
            step="any"
            defaultValue={value}
            required
            onBlur={(event) => {
              const input = event.currentTarget
              if (!input.validity.valid) return
              if (input.valueAsNumber !== value) onChange(input.valueAsNumber)
              closeInput(false)
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault()
                event.stopPropagation()
                closeInput(true)
              }
              if (event.key === "Enter") {
                event.preventDefault()
                if (!event.currentTarget.reportValidity()) return
                onChange(event.currentTarget.valueAsNumber)
                closeInput(true)
              }
            }}
          />
        ) : (
          <Button
            ref={valueButton}
            type="button"
            variant="outline"
            className="min-w-0 flex-1 cursor-pointer rounded-none border-x-0 px-1 tabular-nums"
            aria-label={`Edit ${label.toLowerCase()}, ${display}`}
            title="Enter an exact value"
            onClick={() => setEditing(true)}
          >
            <span className="truncate">{display}</span>
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 rounded-l-none"
          aria-label={`Increase ${label.toLowerCase()}`}
          title="Next preset"
          disabled={steps.larger === undefined}
          onClick={() => {
            if (steps.larger !== undefined) onChange(steps.larger)
            closeInput(false)
          }}
        >
          <PlusIcon aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
