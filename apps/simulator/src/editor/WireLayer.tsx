import { wireSignals, voltageColour } from "./wireSignals"
import { memo, useMemo, useEffect, useRef, useState } from "react"
import { advanceCurrentPhase, wireDisplayGeometry } from "./wireDisplay"
import { format } from "./componentValue"
import { core } from "./core"
import type { CircuitDocument, Entity, Frame } from "./core"
export const WireLayer = memo(function WireLayer({
  document,
  selection,
  frame,
  showVoltage = true,
  showCurrent = true,
  running = false,
}: {
  document: CircuitDocument
  selection: Entity[]
  frame?: Frame | null
  showVoltage?: boolean
  showCurrent?: boolean
  running?: boolean
}) {
  const dots = core.editing.junctionDots(document)
  const signals = useMemo(() => wireSignals(document, frame), [document, frame])
  const liveSignals = useRef(signals)
  const [phases, setPhases] = useState<Record<string, number>>({})
  useEffect(() => {
    liveSignals.current = signals
  }, [signals])
  useEffect(() => {
    if (!running || !showCurrent) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let request = 0,
      last: number | undefined
    function tick(now: number) {
      const elapsed = last === undefined ? 0 : (now - last) / 1000
      last = now
      if (!motion.matches)
        setPhases((previous) =>
          Object.fromEntries(
            Object.entries(liveSignals.current.currents).map(
              ([id, current]) => [
                id,
                advanceCurrentPhase(previous[id] || 0, current, elapsed),
              ]
            )
          )
        )
      request = requestAnimationFrame(tick)
    }
    request = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(request)
  }, [running, showCurrent])
  return (
    <g fill="none" stroke="currentColor" strokeWidth={6.25}>
      {document.electrical.wires.map((w) => {
        const isSelected = selection.some(
          (s) => s.kind === "wire" && s.id === w.id
        )
        const value = signals.voltages[w.id]
        const current = signals.currents[w.id]
        const tint = showVoltage ? voltageColour(value) : "currentColor"
        const route = core.geometry.route(document, w)
        const points = route.map((p) => `${p.x},${p.y}`).join(" ")
        const geometry = wireDisplayGeometry(route, phases[w.id] || 0)
        const display = document.layout.wires[w.id]
        const direction = current < 0 ? -1 : 1
        const arrow =
          Math.abs(geometry.midpoint.dx) >= Math.abs(geometry.midpoint.dy)
            ? geometry.midpoint.dx * direction >= 0
              ? "→"
              : "←"
            : geometry.midpoint.dy * direction >= 0
              ? "↓"
              : "↑"
        const label = [
          display.showVoltage ? format(value, "V") : "",
          display.showCurrent
            ? Number.isFinite(current)
              ? `${Math.abs(current) > 1e-12 ? arrow + " " : ""}${format(Math.abs(current), "A")}`
              : "— A"
            : "",
        ]
          .filter(Boolean)
          .join(" · ")
        return (
          <g key={w.id}>
            <polyline
              className={
                isSelected ? "text-blue-600 dark:text-blue-400" : undefined
              }
              stroke={isSelected ? undefined : tint}
              strokeWidth={isSelected ? 9.375 : undefined}
              points={points}
            />
            {showCurrent &&
              Number.isFinite(current) &&
              Math.abs(current) > 1e-12 && (
                <g
                  className="wire-current-dots"
                  fill="#e5b735"
                  stroke="none"
                  pointerEvents="none"
                >
                  {geometry.dots.map((point, index) => (
                    <circle key={index} cx={point.x} cy={point.y} r={5} />
                  ))}
                </g>
              )}
            {label && geometry.length > 0.001 && (
              <text
                x={
                  geometry.midpoint.x +
                  (Math.abs(geometry.midpoint.dy) >
                  Math.abs(geometry.midpoint.dx)
                    ? 20
                    : 0)
                }
                y={
                  geometry.midpoint.y -
                  (Math.abs(geometry.midpoint.dx) >=
                  Math.abs(geometry.midpoint.dy)
                    ? 25
                    : 0)
                }
                textAnchor={
                  Math.abs(geometry.midpoint.dx) >=
                  Math.abs(geometry.midpoint.dy)
                    ? "middle"
                    : "start"
                }
                dominantBaseline="central"
                fontSize={31.25}
                fill="currentColor"
                stroke="none"
                pointerEvents="none"
                paintOrder="stroke"
                style={{
                  stroke: "var(--background)",
                  strokeWidth: 10,
                  strokeLinejoin: "round",
                }}
              >
                {label}
              </text>
            )}
          </g>
        )
      })}
      {dots.map(({ point }) => (
        <circle
          key={`${point.x},${point.y}`}
          cx={point.x}
          cy={point.y}
          r={12.5}
          fill="currentColor"
          stroke="none"
        />
      ))}
      {document.electrical.junctions
        .filter(
          (junction) =>
            document.electrical.wires.filter(
              (wire) =>
                (wire.from.kind === "junction" &&
                  wire.from.junctionId === junction.id) ||
                (wire.to.kind === "junction" &&
                  wire.to.junctionId === junction.id)
            ).length === 1
        )
        .map(({ id }) => {
          const point = document.layout.junctions[id]
          return (
            <rect
              key={`loose-${id}`}
              x={point.x - 9.375}
              y={point.y - 9.375}
              width={18.75}
              height={18.75}
              fill="var(--background)"
              stroke="currentColor"
            />
          )
        })}
      {selection
        .filter(({ kind }) => kind === "junction")
        .map(({ id }) => {
          const point = document.layout.junctions[id]
          return (
            point && (
              <circle
                key={id}
                cx={point.x}
                cy={point.y}
                r={12.5}
                className="text-blue-600 dark:text-blue-400"
                fill="currentColor"
                stroke="none"
              />
            )
          )
        })}
    </g>
  )
})
