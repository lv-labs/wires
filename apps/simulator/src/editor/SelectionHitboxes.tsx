import { core } from "./core"
import type { CircuitDocument } from "./core"
import { useLayoutEffect, useRef } from "react"
import { drawArtworkHitAreas } from "./symbolHit"

function ArtworkHitAreas() {
  const ref = useRef<SVGGElement>(null)
  useLayoutEffect(() => {
    const overlay = ref.current
    if (!overlay) return
    const update = () => drawArtworkHitAreas(overlay)
    update()
    const observer = new MutationObserver(update)
    overlay.ownerSVGElement
      ?.querySelectorAll("[data-symbol-body]")
      .forEach((body) => {
        observer.observe(body, {
          attributes: true,
          childList: true,
          subtree: true,
        })
      })
    return () => observer.disconnect()
  })
  return (
    <g
      ref={ref}
      fill="#ec4899"
      fillOpacity={0.12}
      strokeOpacity={0.35}
      data-artwork-hit-areas=""
    />
  )
}

/** Uses the same geometry as pointer and marquee selection. */
export function SelectionHitboxes({
  document,
  scale,
}: {
  document: CircuitDocument
  scale: number
}) {
  return (
    <g pointerEvents="none" data-selection-hitboxes="">
      <ArtworkHitAreas />
      {document.electrical.components.map((component) => {
        const pose = document.layout.components[component.id]
        const bounds = core.geometry.bounds(document, component)
        const graphic = core.catalog.graphic(component.kind)
        const size = graphic ? core.geometry.graphicSize(component) : null
        const body = core.geometry.componentHitBox(component)
        return (
          <g key={component.id}>
            <rect
              x={bounds.x}
              y={bounds.y}
              width={bounds.right - bounds.x}
              height={bounds.bottom - bounds.y}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={1 / scale}
              strokeDasharray={`${5 / scale} ${4 / scale}`}
            />
            <g
              transform={`translate(${pose.x} ${pose.y}) rotate(${pose.rotation}) scale(${pose.mirror ? -1 : 1} 1)`}
              stroke="#ec4899"
              fill="#ec4899"
              fillOpacity={0.12}
              strokeWidth={1 / scale}
            >
              {size && component.kind === "line" ? (
                <line
                  x1={-size.width / 2}
                  y1={-Number(component.parameters.height) / 2}
                  x2={size.width / 2}
                  y2={Number(component.parameters.height) / 2}
                  strokeWidth={16 / scale}
                  strokeOpacity={0.25}
                />
              ) : size && component.kind === "box" ? (
                <rect
                  x={-size.width / 2}
                  y={-size.height / 2}
                  width={size.width}
                  height={size.height}
                  fill="none"
                  strokeWidth={16 / scale}
                  strokeOpacity={0.25}
                />
              ) : (
                <rect
                  x={size ? -size.width / 2 - 6 : -body.x}
                  y={size ? -size.height / 2 - 6 : -body.y}
                  width={size ? size.width + 12 : body.x * 2}
                  height={size ? size.height + 12 : body.y * 2}
                />
              )}
            </g>
            {Object.keys(core.catalog.componentPins(component)).map((pinId) => {
              const p = core.geometry.pin(document, {
                kind: "pin",
                componentId: component.id,
                pinId,
              })
              return (
                <circle
                  key={pinId}
                  cx={p.x}
                  cy={p.y}
                  r={Math.min(10 / scale, 20)}
                  stroke="#f59e0b"
                  strokeWidth={1 / scale}
                  fill="#f59e0b"
                  fillOpacity={0.15}
                />
              )
            })}
          </g>
        )
      })}
    </g>
  )
}
