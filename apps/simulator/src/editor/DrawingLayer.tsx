import type { PointerEvent } from "react"
import type { Drawing } from "./core"
export function DrawingShape({ drawing: d }: { drawing: Drawing }) {
  const p = d.points
  const style = {
    stroke: d.stroke,
    fill: d.fill,
    strokeWidth: d.strokeWidth,
    strokeDasharray:
      d.strokeStyle === "dashed"
        ? `${d.strokeWidth * 3} ${d.strokeWidth * 2}`
        : d.strokeStyle === "dotted"
          ? `0 ${Math.max(6, d.strokeWidth * 2)}`
          : undefined,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  if (d.kind === "text")
    return (
      <text
        x={p[0].x}
        y={p[0].y}
        transform={`rotate(${d.rotation || 0} ${p[0].x} ${p[0].y})`}
        fill={d.fill}
        stroke="none"
        fontSize={d.fontSize}
        fontFamily="var(--font-sans)"
        dominantBaseline="hanging"
      >
        {d.text.split("\n").map((line, i) => (
          <tspan key={i} x={p[0].x} dy={i ? d.fontSize * 1.3 : 0}>
            {line || " "}
          </tspan>
        ))}
      </text>
    )
  if (d.kind === "line")
    return (
      <line
        x1={p[0].x}
        y1={p[0].y}
        x2={p[1].x}
        y2={p[1].y}
        {...style}
        fill="none"
      />
    )
  if (d.kind === "ellipse") {
    const rx = Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y),
      ry = Math.hypot(p[2].x - p[0].x, p[2].y - p[0].y),
      angle = (Math.atan2(p[1].y - p[0].y, p[1].x - p[0].x) * 180) / Math.PI
    return (
      <ellipse
        cx={p[0].x}
        cy={p[0].y}
        rx={rx}
        ry={ry}
        transform={`rotate(${angle} ${p[0].x} ${p[0].y})`}
        {...style}
      />
    )
  }
  return <polygon points={p.map((p) => `${p.x},${p.y}`).join(" ")} {...style} />
}
export function DrawingLayer({
  drawings,
  selected = [],
}: {
  drawings: Drawing[]
  selected?: string[]
}) {
  return (
    <g data-sheet-drawings="" pointerEvents="none">
      {drawings.map((d) => (
        <g
          key={d.id}
          className={
            selected.includes(d.id)
              ? "text-blue-600 dark:text-blue-400"
              : undefined
          }
          data-selected={selected.includes(d.id) || undefined}
        >
          <DrawingShape
            drawing={
              selected.includes(d.id)
                ? {
                    ...d,
                    stroke: d.stroke === "none" ? "none" : "currentColor",
                    fill: d.fill === "none" ? "none" : "currentColor",
                  }
                : d
            }
          />
        </g>
      ))}
    </g>
  )
}
export function DrawingHandles({
  drawing,
  scale,
  onHandle,
}: {
  drawing: Drawing
  scale: number
  onHandle: (index: number, event: PointerEvent<SVGCircleElement>) => void
}) {
  return (
    <g className="text-blue-600 dark:text-blue-400">
      {drawing.points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={5 / scale}
          fill="var(--background)"
          stroke="currentColor"
          strokeWidth={1.5 / scale}
          onPointerDown={(e) => onHandle(i, e)}
          style={{ cursor: "crosshair" }}
        />
      ))}
    </g>
  )
}
