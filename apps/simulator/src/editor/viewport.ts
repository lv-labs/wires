export type Camera = { x: number; y: number; scale: number }
export type ScreenPoint = { x: number; y: number }
export type ZoomLimits = { min: number; max: number }
const sheetLimits = { min: 0.064, max: 1.28 }

export function zoomCamera(
  camera: Camera,
  point: ScreenPoint,
  factor: number,
  limits: ZoomLimits = sheetLimits
): Camera {
  const scale = Math.max(
    limits.min,
    Math.min(limits.max, camera.scale * factor)
  )
  return {
    scale,
    x: point.x - ((point.x - camera.x) * scale) / camera.scale,
    y: point.y - ((point.y - camera.y) * scale) / camera.scale,
  }
}
export function wheelCamera(
  camera: Camera,
  event: { deltaX: number; deltaY: number; ctrlKey: boolean; metaKey: boolean },
  point: ScreenPoint,
  limits?: ZoomLimits
): Camera {
  if (!event.ctrlKey && !event.metaKey)
    return { ...camera, x: camera.x - event.deltaX, y: camera.y - event.deltaY }
  return zoomCamera(camera, point, Math.exp(-event.deltaY * 0.008), limits)
}
export function panCamera(
  camera: Camera,
  origin: ScreenPoint,
  point: ScreenPoint
): Camera {
  return {
    ...camera,
    x: camera.x + point.x - origin.x,
    y: camera.y + point.y - origin.y,
  }
}
export function isPanStart(button: number, tool: string, space: boolean) {
  return button === 1 || (button === 0 && (tool === "pan" || space))
}
