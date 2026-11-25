import { useLayoutEffect, useRef } from "react"
import type { CircuitDocument } from "./core"

// The rail terminal and potentiometer wiper are below their bodies in local coordinates.
const oppositeLowerPin = ["above", "right", "below", "left"] as const

/** Keep labels upright and space them from the actual transformed artwork. */
export function SheetLabel({ pose, kind, children }: {
  pose: CircuitDocument["layout"]["components"][string]
  kind: string
  children: string
}) {
  const text = useRef<SVGTextElement>(null)
  useLayoutEffect(() => {
    const element = text.current
    const body = element?.parentElement?.querySelector<SVGGElement>("[data-symbol-body]")
    if (!element || !body) return
    const box = body.getBBox()
    const angle = pose.rotation * Math.PI / 180
    const points = [
      [box.x, box.y], [box.x + box.width, box.y],
      [box.x, box.y + box.height], [box.x + box.width, box.y + box.height],
    ].map(([x, y]) => {
      x *= pose.mirror ? -1 : 1
      return {
        x: pose.x + x * Math.cos(angle) - y * Math.sin(angle),
        y: pose.y + x * Math.sin(angle) + y * Math.cos(angle),
      }
    })
    const left = Math.min(...points.map(p => p.x))
    const right = Math.max(...points.map(p => p.x))
    const top = Math.min(...points.map(p => p.y))
    const bottom = Math.max(...points.map(p => p.y))
    const alignAbove = ["variableVoltage", "ammeter", "voltmeter", "ohmmeter", "wattmeter"].includes(kind) || right - left > bottom - top
    let side: (typeof oppositeLowerPin)[number] = alignAbove ? "above" : "right"
    if (kind === "voltageRail" || kind === "potentiometer")
      side = oppositeLowerPin[pose.rotation / 90]
    else if (kind === "voltageSource") side = "left"

    const gap = 25
    let x = (left + right) / 2
    let y = (top + bottom) / 2
    let anchor = "middle"
    if (side === "above" || side === "below") {
      const clearance = gap + element.getBBox().height / 2
      y = side === "above" ? top - clearance : bottom + clearance
    } else if (side === "left") {
      x = left - gap
      anchor = "end"
    } else {
      x = right + gap
      anchor = "start"
    }
    element.setAttribute("x", String(x))
    element.setAttribute("y", String(y))
    element.setAttribute("text-anchor", anchor)
  }, [pose, kind, children])
  return <text ref={text} dominantBaseline="central" fill="currentColor" stroke="none"
    fontSize={40} opacity={0.7} pointerEvents="none">{children}</text>
}
