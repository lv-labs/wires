const namespace = "http://www.w3.org/2000/svg"
const properties = [
  "color",
  "fill",
  "fill-opacity",
  "fill-rule",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "stroke-dashoffset",
  "opacity",
  "font-size",
  "font-weight",
  "font-style",
  "text-anchor",
  "dominant-baseline",
  "visibility",
  "paint-order",
  "vector-effect",
  "stop-color",
  "stop-opacity",
  "filter",
  "clip-path",
] as const

/** Snapshot the complete sheet in world coordinates, independent of pan/zoom. */
export function circuitSvg(sheet: SVGSVGElement, title: string) {
  const source = sheet.querySelector<SVGGElement>("[data-circuit-content]")
  if (!source) throw new Error("Circuit drawing is unavailable")
  const content = source.cloneNode(true) as SVGGElement
  const originals = [source, ...source.querySelectorAll<SVGElement>("*")]
  const copies = [content, ...content.querySelectorAll<SVGElement>("*")]
  originals.forEach((original, index) => {
    const copy = copies[index]
    const style = getComputedStyle(original)
    for (const property of properties)
      copy.style.setProperty(property, style.getPropertyValue(property))
    copy.style.fontFamily =
      style.fontFamily.includes("Mono") ||
      style.fontFamily.includes("monospace")
        ? "monospace"
        : "Arial, sans-serif"
    copy.removeAttribute("class")
    // Exported images have no focus, event or editor metadata.
    for (const attribute of [...copy.attributes])
      if (
        attribute.name.startsWith("data-") ||
        attribute.name.startsWith("aria-") ||
        attribute.name === "tabindex"
      )
        copy.removeAttribute(attribute.name)
  })
  // Use corresponding source nodes because editor metadata has been stripped.
  originals.forEach((original, index) => {
    if (original.hasAttribute("data-export-ignore")) copies[index].remove()
  })
  content.removeAttribute("transform")
  const svg = document.createElementNS(namespace, "svg")
  svg.setAttribute("xmlns", namespace)
  const caption = document.createElementNS(namespace, "title")
  caption.textContent = title
  svg.append(caption, content)
  // Measure the cleaned clone, including text outside the visible viewport.
  svg.style.cssText =
    "position:fixed;left:-100000px;top:0;overflow:visible;pointer-events:none"
  document.body.append(svg)
  let bounds: DOMRect
  try {
    bounds = content.getBBox()
  } finally {
    svg.remove()
    svg.removeAttribute("style")
  }
  const padding = 40
  const width = Math.max(320, Math.ceil(bounds.width + padding * 2))
  const height = Math.max(200, Math.ceil(bounds.height + padding * 2))
  const x = bounds.x - (width - bounds.width) / 2
  const y = bounds.y - (height - bounds.height) / 2
  svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`)
  svg.setAttribute("width", String(width))
  svg.setAttribute("height", String(height))
  const background = document.createElementNS(namespace, "rect")
  background.setAttribute("x", String(x))
  background.setAttribute("y", String(y))
  background.setAttribute("width", String(width))
  background.setAttribute("height", String(height))
  background.setAttribute(
    "fill",
    getComputedStyle(sheet).getPropertyValue("--background").trim() || "white"
  )
  svg.insertBefore(background, content)
  return {
    blob: new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml",
    }),
    width,
    height,
  }
}

export async function circuitImage(
  sheet: SVGSVGElement,
  title: string,
  format: "svg" | "png"
) {
  await document.fonts.ready
  const { blob, width, height } = circuitSvg(sheet, title)
  if (format === "svg") return blob
  const url = URL.createObjectURL(blob)
  try {
    const image = new Image()
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () =>
        reject(new Error("Could not render the circuit image"))
      image.src = url
    })
    const scale = Math.min(2, 4096 / Math.max(width, height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Image export is unavailable in this browser")
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("Could not encode the PNG image")),
        "image/png"
      )
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}
