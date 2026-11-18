/** Hit artwork, with padded body areas for switches, in sheet SVG coordinates. */
export function symbolBodyHit(
  svg: SVGSVGElement,
  x: number,
  y: number,
  paddedBodies = true
): string | null {
  const screen = svg.getScreenCTM()
  if (!screen) return null
  const point = new DOMPoint(x, y).matrixTransform(screen)
  const bodies = Array.from(
    svg.querySelectorAll<SVGGElement>("[data-symbol-body]")
  )
  for (const body of bodies.reverse()) {
    if (paddedBodies && body.dataset.symbolHitArea === "bounds") {
      const matrix = body.getScreenCTM()
      if (matrix) {
        const local = point.matrixTransform(matrix.inverse())
        const box = body.getBBox()
        // A constant screen-space allowance keeps switches easy to hit at any zoom.
        const padX = 6 / Math.hypot(matrix.a, matrix.b)
        const padY = 6 / Math.hypot(matrix.c, matrix.d)
        if (
          local.x >= box.x - padX &&
          local.x <= box.x + box.width + padX &&
          local.y >= box.y - padY &&
          local.y <= box.y + box.height + padY
        )
          return body.dataset.symbolBody ?? null
      }
    }
    for (const shape of body.querySelectorAll<SVGGraphicsElement>(
      "path,rect,circle,ellipse,line,polyline,polygon,text"
    )) {
      const matrix = shape.getScreenCTM()
      if (!matrix) continue
      const local = point.matrixTransform(matrix.inverse())
      if (shape instanceof SVGGeometryElement) {
        if (shape.isPointInFill(local) || shape.isPointInStroke(local))
          return body.dataset.symbolBody ?? null
      } else {
        const box = shape.getBBox()
        if (
          local.x >= box.x &&
          local.x <= box.x + box.width &&
          local.y >= box.y &&
          local.y <= box.y + box.height
        )
          return body.dataset.symbolBody ?? null
      }
    }
  }
  return null
}
