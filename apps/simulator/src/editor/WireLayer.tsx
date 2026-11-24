import { wireSignals, voltageColour } from "./wireSignals"
import { memo, useMemo, useEffect, useRef } from "react"
import { advanceCurrentPhase, wireDisplayGeometry } from "./wireDisplay"
import { format } from "./componentValue"
import { core } from "./core"
import type { CircuitDocument, Entity, Frame } from "./core"
export const WireLayer = memo(function WireLayer({
  document,
  selection,
  highlighted,
  frame,
  showVoltage = true,
  showCurrent = true,
  running = false,
}: {
  document: CircuitDocument
  selection: Entity[]
  highlighted?: ReadonlySet<string>
  frame?: Frame | null
  showVoltage?: boolean
  showCurrent?: boolean
  running?: boolean
}) {
  const { dots, looseJunctions, wires } = useMemo(() => {
    const connections = new Map<string, number>()
    function countJunction(id: string) {
      connections.set(id, (connections.get(id) ?? 0) + 1)
    }
    const wires = document.electrical.wires.map((wire) => {
      if (wire.from.kind === "junction") countJunction(wire.from.junctionId)
      if (
        wire.to.kind === "junction" &&
        (wire.from.kind !== "junction" ||
          wire.from.junctionId !== wire.to.junctionId)
      )
        countJunction(wire.to.junctionId)
      const route = core.geometry.route(document, wire)
      const display = document.layout.wires[wire.id]
      return {
        id: wire.id,
        display,
        points: route.map((point) => `${point.x},${point.y}`).join(" "),
        geometry:
          display.showVoltage || display.showCurrent
            ? wireDisplayGeometry(route)
            : null,
      }
    })
    return {
      wires,
      dots: core.editing.junctionDots(document),
      looseJunctions: document.electrical.junctions.filter(
        ({ id }) => connections.get(id) === 1
      ),
    }
  }, [document])
  const signals = useMemo(() => wireSignals(document, frame), [document, frame])
  const liveSignals = useRef(signals)
  const phases = useRef(new Map<string, number>())
  const currentPaths = useRef(new Map<string, SVGPolylineElement>())
  useEffect(() => {
    liveSignals.current = signals
  }, [signals])
  useEffect(() => {
    const ids = new Set(wires.map(({ id }) => id))
    for (const id of phases.current.keys()) {
      if (!ids.has(id)) phases.current.delete(id)
    }
  }, [wires])
  useEffect(() => {
    if (!running || !showCurrent) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let request = 0,
      last: number | undefined
    function tick(now: number) {
      const elapsed = last === undefined ? 0 : (now - last) / 1000
      last = now
      if (!motion.matches) {
        for (const [id, path] of currentPaths.current) {
          const previous = phases.current.get(id) ?? 0
          const phase = advanceCurrentPhase(
            previous,
            liveSignals.current.currents[id],
            elapsed
          )
          if (phase !== previous) {
            phases.current.set(id, phase)
            path.setAttribute("stroke-dashoffset", String(-phase))
          }
        }
      }
      request = requestAnimationFrame(tick)
    }
    request = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(request)
  }, [running, showCurrent])
  return (
    <g fill="none" stroke="currentColor" strokeWidth={6.25}>
      {wires.map(({ id, display, points, geometry }) => {
        const isSelected = selection.some(
          (s) => s.kind === "wire" && s.id === id
        )
        const scopeHighlighted = highlighted?.has(id)
        const value = signals.voltages[id]
        const current = signals.currents[id]
        const tint = showVoltage ? voltageColour(value) : "currentColor"
        const direction = current < 0 ? -1 : 1
        const arrow = !geometry
          ? ""
          : Math.abs(geometry.midpoint.dx) >= Math.abs(geometry.midpoint.dy)
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
          <g key={id}>
            <polyline
              className={
                isSelected ? "text-blue-600 dark:text-blue-400" : undefined
              }
              stroke={
                scopeHighlighted
                  ? "var(--primary)"
                  : isSelected
                    ? undefined
                    : tint
              }
              strokeWidth={scopeHighlighted || isSelected ? 9.375 : undefined}
              points={points}
            />
            {showCurrent &&
              Number.isFinite(current) &&
              Math.abs(current) > 1e-12 && (
                <polyline
                  className="wire-current-dots"
                  ref={(path) => {
                    if (path) {
                      currentPaths.current.set(id, path)
                      if (!path.hasAttribute("stroke-dashoffset")) {
                        path.setAttribute(
                          "stroke-dashoffset",
                          String(-(phases.current.get(id) ?? 0))
                        )
                      }
                    } else currentPaths.current.delete(id)
                  }}
                  points={points}
                  stroke="#e5b735"
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray="0 50"
                  pointerEvents="none"
                />
              )}
            {label && geometry && geometry.length > 0.001 && (
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
      {looseJunctions.map(({ id }) => {
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
