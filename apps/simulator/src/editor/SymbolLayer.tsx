import { memo, useState } from "react"
import * as symbols from "../../../../packages/circuit-symbols/index.ts"
import type { SymbolProps } from "../../../../packages/circuit-symbols/svg"
import type { CircuitDocument, Component, Frame } from "./core"
import { core } from "./core"
import { sliderField, setProperty } from "./componentSliders"
import type { SliderAdjustment } from "./componentSliders"
import { sheetValue } from "./componentValue"
import { SheetLabel } from "./SheetLabel"

export function SymbolBody({
  component,
  pose,
  current = 0,
  measured = {},
  running = false,
  highlighted = false,
  ledGlow = 1,
}: {
  component: Component
  pose: NonNullable<SymbolProps["pose"]>
  current?: number
  ledGlow?: boolean | number
  highlighted?: boolean
  measured?: SymbolProps["measured"]
  running?: boolean
}) {
  if (!Object.hasOwn(symbols, component.kind))
    throw new Error(`Unsupported React symbol: ${component.kind}`)
  const View = symbols[component.kind as keyof typeof symbols]
  const drawingScale =
    core.catalog.definitions[component.kind].drawingScale ?? 1
  const isGraphic = core.catalog.graphic(component.kind)
  return (
    <g
      transform={`scale(${drawingScale})`}
      style={
        {
          strokeWidth: `calc(var(--symbol-stroke, 6.25px) / ${drawingScale})`,
          "--symbol-text-scale": isGraphic ? 1 : 1.25,
        } as React.CSSProperties
      }
    >
      <View
        parameters={component.parameters}
        pose={pose}
        current={current}
        measured={measured}
        running={running}
        highlighted={highlighted}
        glow={ledGlow}
        graphicSize={
          isGraphic
            ? core.geometry.graphicSize(component)
            : undefined
        }
      />
    </g>
  )
}

export const SymbolLayer = memo(function SymbolLayer({
  document,
  selected,
  highlighted,
  frame,
  sliderPreview,
  running = false,
  ledGlow = 1,
}: {
  document: CircuitDocument
  selected: string[]
  highlighted?: ReadonlySet<string>
  frame?: Frame | null
  ledGlow?: boolean | number
  sliderPreview?: SliderAdjustment | null
  running?: boolean
}) {
  const [hoveredLed, setHoveredLed] = useState<string | null>(null)
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={6.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {document.electrical.components.map((component) => {
        const pose = document.layout.components[component.id]
        const isSelected = selected.includes(component.id)
        const scopeHighlighted = highlighted?.has(component.id)
        const current = frame?.componentCurrents?.[component.id] ?? 0
        const measured = {
          ...frame?.componentMeasurements?.[component.id],
          voltage: frame?.pinVoltages[component.id]?.in ?? NaN,
        }
        const displayComponent =
          sliderPreview?.id === component.id &&
          sliderPreview.kind === component.kind
            ? structuredClone(component)
            : component
        if (displayComponent !== component && sliderPreview)
          setProperty(
            displayComponent.parameters,
            sliderField(sliderPreview),
            sliderPreview.value
          )
        const value = sheetValue(displayComponent, {
          pinVoltages: frame?.pinVoltages[component.id],
          measurement: measured,
        })
        return (
          <g
            key={component.id}
            className={
              scopeHighlighted
                ? "text-primary"
                : isSelected
                  ? "text-blue-600 dark:text-blue-400"
                  : undefined
            }
            style={
              {
                "--symbol-stroke":
                  scopeHighlighted || isSelected ? "9.375px" : "6.25px",
              } as React.CSSProperties
            }
          >
            <g
              data-symbol-body={component.id}
              onPointerEnter={
                component.kind === "led"
                  ? () => setHoveredLed(component.id)
                  : undefined
              }
              onPointerLeave={
                component.kind === "led" ? () => setHoveredLed(null) : undefined
              }
              data-symbol-hit-area={
                core.catalog.switchKind(component.kind) ||
                ["analogSwitch", "analogSpdtSwitch"].includes(component.kind)
                  ? "bounds"
                  : undefined
              }
              data-symbol-hit-top={
                component.kind === "switch" ? -50 : undefined
              }
              transform={`translate(${pose.x} ${pose.y}) rotate(${pose.rotation}) scale(${pose.mirror ? -1 : 1} 1)`}
            >
              <SymbolBody
                component={displayComponent}
                pose={pose}
                current={current}
                measured={measured}
                running={running}
                highlighted={isSelected || hoveredLed === component.id}
                ledGlow={ledGlow}
              />
            </g>
            {/* Sheet labels are positioned outside the symbol's pose transform. */}
            {!core.catalog.graphic(component.kind) && value && (
              <SheetLabel pose={pose} kind={component.kind}>
                {value}
              </SheetLabel>
            )}
          </g>
        )
      })}
    </g>
  )
})
