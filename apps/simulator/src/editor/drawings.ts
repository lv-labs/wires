import type { Drawing, DrawingKind, DrawingStyle, Point } from "./core"
export const drawingTools: { kind: DrawingKind; label: string }[] = [
  { kind: "text", label: "Text" },
  { kind: "line", label: "Line" },
  { kind: "box", label: "Box" },
  { kind: "ellipse", label: "Ellipse" },
  { kind: "polygon", label: "Polygon" },
]
export const defaultDrawingStyle: DrawingStyle = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: 6.25,
  strokeStyle: "solid",
  fontSize: 50,
}
export function makeDrawing(
  kind: DrawingKind,
  a: Point,
  b: Point,
  style: DrawingStyle
): Drawing {
  const points =
    kind === "text"
      ? [a]
      : kind === "box"
        ? [a, { x: b.x, y: a.y }, b, { x: a.x, y: b.y }]
        : kind === "ellipse"
          ? [
              { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
              { x: b.x, y: (a.y + b.y) / 2 },
              { x: (a.x + b.x) / 2, y: b.y },
            ]
          : [a, b]
  return {
    id: "drawing-preview",
    kind,
    points: structuredClone(points),
    text: "Text",
    ...style,
    ...(kind === "text" && style.fill === "none" ? { fill: style.stroke } : {}),
  }
}
export function moveDrawingPoint(
  drawing: Drawing,
  index: number,
  target: Point
): Drawing {
  const next = structuredClone(drawing),
    ps = next.points
  if (drawing.kind === "box") {
    const source = drawing.points,
      opposite = source[(index + 2) % 4]
    const u = { x: source[1].x - source[0].x, y: source[1].y - source[0].y },
      v = { x: source[3].x - source[0].x, y: source[3].y - source[0].y }
    const ul = Math.hypot(u.x, u.y) || 1,
      vl = Math.hypot(v.x, v.y) || 1
    u.x /= ul
    u.y /= ul
    v.x /= vl
    v.y /= vl
    const dx = target.x - opposite.x,
      dy = target.y - opposite.y
    const rawA = dx * u.x + dy * u.y,
      rawB = dx * v.x + dy * v.y
    const signA =
      Math.sign(
        (source[index].x - opposite.x) * u.x +
          (source[index].y - opposite.y) * u.y
      ) || 1
    const signB =
      Math.sign(
        (source[index].x - opposite.x) * v.x +
          (source[index].y - opposite.y) * v.y
      ) || 1
    const a = Math.abs(rawA) < 25 ? (Math.sign(rawA) || signA) * 25 : rawA
    const b = Math.abs(rawB) < 25 ? (Math.sign(rawB) || signB) * 25 : rawB
    const xs = [0, 1, 1, 0],
      ys = [0, 0, 1, 1]
    next.points = source.map((_, i) => ({
      x:
        opposite.x +
        (xs[i] === xs[index] ? a * u.x : 0) +
        (ys[i] === ys[index] ? b * v.x : 0),
      y:
        opposite.y +
        (xs[i] === xs[index] ? a * u.y : 0) +
        (ys[i] === ys[index] ? b * v.y : 0),
    }))
  } else if (drawing.kind === "ellipse") {
    const c = ps[0]
    if (index === 0) {
      const dx = target.x - c.x,
        dy = target.y - c.y
      next.points = ps.map((p) => ({ x: p.x + dx, y: p.y + dy }))
    } else if (index === 1) {
      const rx = target.x - c.x,
        ry = target.y - c.y,
        length = Math.hypot(rx, ry) || 1,
        radius = Math.hypot(ps[2].x - c.x, ps[2].y - c.y)
      ps[1] = target
      ps[2] = {
        x: c.x - (ry / length) * radius,
        y: c.y + (rx / length) * radius,
      }
    } else {
      const rx = ps[1].x - c.x,
        ry = ps[1].y - c.y,
        length = Math.hypot(rx, ry) || 1,
        nx = -ry / length,
        ny = rx / length,
        radius = (target.x - c.x) * nx + (target.y - c.y) * ny
      ps[2] = { x: c.x + nx * radius, y: c.y + ny * radius }
    }
  } else ps[index] = target
  return next
}
