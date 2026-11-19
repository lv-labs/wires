import { Slider } from "@/components/ui/slider"

export function LedGlowControl({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const percent = Math.round(value * 100)
  return (
    <div
      className="w-48 space-y-3 px-2 py-2"
      onKeyDown={(event) => {
        if (
          [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End",
            "PageUp",
            "PageDown",
          ].includes(event.key)
        )
          event.stopPropagation()
      }}
    >
      <div className="flex items-center justify-between gap-4 text-xs">
        <span>Glow intensity</span>
        <output className="text-muted-foreground tabular-nums">
          {percent === 0 ? "Off" : `${percent}%`}
        </output>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[percent]}
        getAriaLabel={() => "LED glow intensity"}
        getAriaValueText={(_formatted, value) =>
          value === 0 ? "Off" : `${value}%`
        }
        onValueChange={(values) =>
          onChange((Array.isArray(values) ? values[0] : values) / 100)
        }
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Off</span>
        <span>Maximum</span>
      </div>
    </div>
  )
}
