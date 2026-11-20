function paddedSymbolBounds(body: SVGGElement, matrix: DOMMatrix) {
  const box = body.getBBox()
  // Include the open blade's reach even when the blade is closed.
  const top = Math.min(box.y, Number(body.dataset.symbolHitTop ?? box.y))
  // Use the same screen-space padding at every zoom level.
  const padX = 10 / Math.hypot(matrix.a, matrix.b)
  const padY = 10 / Math.hypot(matrix.c, matrix.d)
  return {
    x: box.x - padX,
    y: top - padY,
    width: box.width + 2 * padX,
    height: box.y + box.height - top + 2 * padY,
  }
}

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
        const box = paddedSymbolBounds(body, matrix)
        if (
          local.x >= box.x &&
          local.x <= box.x + box.width &&
          local.y >= box.y &&
          local.y <= box.y + box.height
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

/** Draw the additional DOM hit regions in the overlay's coordinate system. */
export function drawArtworkHitAreas(overlay: SVGGElement): void {
  const svg = overlay.ownerSVGElement
  const overlayMatrix = overlay.getScreenCTM()
  if (!svg || !overlayMatrix) return
  const inverse = overlayMatrix.inverse()
  const ns = "http://www.w3.org/2000/svg"
  overlay.replaceChildren()
  const append = (shape: SVGGraphicsElement, area: SVGElement) => {
    const matrix = shape.getScreenCTM()
    if (!matrix) return
    const group = document.createElementNS(ns, "g")
    const m = inverse.multiply(matrix)
    group.setAttribute(
      "transform",
      `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`
    )
    group.append(area)
    overlay.append(group)
  }
  const rectangle = (box: Pick<DOMRect, "x" | "y" | "width" | "height">) => {
    const rect = document.createElementNS(ns, "rect")
    rect.setAttribute("x", String(box.x))
    rect.setAttribute("y", String(box.y))
    rect.setAttribute("width", String(box.width))
    rect.setAttribute("height", String(box.height))
    return rect
  }
  for (const body of svg.querySelectorAll<SVGGElement>("[data-symbol-body]")) {
    const matrix = body.getScreenCTM()
    if (body.dataset.symbolHitArea === "bounds" && matrix) {
      append(body, rectangle(paddedSymbolBounds(body, matrix)))
    }
    for (const shape of body.querySelectorAll<SVGGraphicsElement>(
      "path,rect,circle,ellipse,line,polyline,polygon,text"
    )) {
      if (shape instanceof SVGGeometryElement) {
        // isPointInFill tests geometric fill even for artwork painted with fill="none".
        const area = shape.cloneNode(false) as SVGElement
        const style = getComputedStyle(shape)
        area.removeAttribute("id")
        area.removeAttribute("transform")
        area.removeAttribute("class")
        area.removeAttribute("style")
        area.setAttribute("fill", "#ec4899")
        area.setAttribute("fill-rule", style.fillRule)
        area.setAttribute("stroke", "#ec4899")
        area.setAttribute("stroke-width", style.strokeWidth)
        area.setAttribute("stroke-linecap", style.strokeLinecap)
        area.setAttribute("stroke-linejoin", style.strokeLinejoin)
        area.setAttribute("stroke-miterlimit", style.strokeMiterlimit)
        area.setAttribute("stroke-dasharray", style.strokeDasharray)
        area.setAttribute("stroke-dashoffset", style.strokeDashoffset)
        append(shape, area)
      } else append(shape, rectangle(shape.getBBox()))
    }
  }
}
