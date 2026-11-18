// Convert preview sheet coordinates back into the coordinates used by TSX artwork.
export function sourceCoordinates(
  x: number,
  y: number,
  rotation: number,
  mirror: boolean,
  scale: number
) {
  const angle = (-rotation * Math.PI) / 180
  return {
    x:
      ((x * Math.cos(angle) - y * Math.sin(angle)) * (mirror ? -1 : 1)) / scale,
    y: (x * Math.sin(angle) + y * Math.cos(angle)) / scale,
  }
}

// Snap in artwork units, then place the crosshairs at that exact preview point.
export function snapPreviewPoint(
  x: number,
  y: number,
  rotation: number,
  mirror: boolean,
  scale: number,
  step = 1
) {
  const local = sourceCoordinates(x, y, rotation, mirror, scale)
  const sx = Math.round(local.x / step) * step * scale * (mirror ? -1 : 1)
  const sy = Math.round(local.y / step) * step * scale
  const angle = (rotation * Math.PI) / 180
  return {
    x: sx * Math.cos(angle) - sy * Math.sin(angle),
    y: sx * Math.sin(angle) + sy * Math.cos(angle),
  }
}

// Space-separated values paste directly into SVG path commands: Mx y, Lx y, etc.
export function formatCoordinates(x: number, y: number) {
  return `${Number(x.toFixed(8))} ${Number(y.toFixed(8))}`
}
