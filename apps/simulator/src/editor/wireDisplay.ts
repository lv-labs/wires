import type { Point } from "./core"

// Advance in the wire's from→to direction for positive conventional current.
// Limit travel per paint so a slow frame cannot make a repeating dot pattern
// appear to run backwards (temporal aliasing).
export function advanceCurrentPhase(
  phase: number,
  current: number,
  seconds: number
) {
  if (!Number.isFinite(current) || Math.abs(current) < 1e-12) return phase
  const speed = Math.min(
    150,
    Math.max(10, Math.sqrt(Math.abs(current) * 1000) * 50)
  )
  return (
    (((phase +
      Math.sign(current) * speed * Math.min(0.05, Math.max(0, seconds))) %
      50) +
      50) %
    50
  )
}
export function wireDisplayGeometry(points: Point[], phase = 0) {
  const segments = points
    .slice(1)
    .map((b, i) => ({
      a: points[i],
      b,
      length: Math.hypot(b.x - points[i].x, b.y - points[i].y),
    }))
  const length = segments.reduce((sum, s) => sum + s.length, 0)
  function at(distance: number) {
    for (const s of segments) {
      if (!s.length) continue
      if (distance <= s.length)
        return {
          x: s.a.x + ((s.b.x - s.a.x) * distance) / s.length,
          y: s.a.y + ((s.b.y - s.a.y) * distance) / s.length,
          dx: s.b.x - s.a.x,
          dy: s.b.y - s.a.y,
        }
      distance -= s.length
    }
    return { ...(points.at(-1) || { x: 0, y: 0 }), dx: 1, dy: 0 }
  }
  const dots: Point[] = []
  if (length > 0.001)
    for (let distance = phase; distance < length; distance += 50)
      dots.push(at(distance))
  return { dots, midpoint: at(length / 2), length }
}
