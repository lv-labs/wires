export type ScopeViewport = { x: number; y: number; scale: number; top: number }

export const defaultScopeSize = { width: 640, height: 280 }
const sheetScopeContentSize = { width: 440, height: 200 }

/** Fit the full scope UI into the requested sheet rectangle with a uniform scale. */
export function sheetScopeDisplay(
  size: { width: number; height: number },
  zoom: number
) {
  const referenceScale = Math.max(
    sheetScopeContentSize.width / size.width,
    sheetScopeContentSize.height / size.height
  )
  return {
    width: size.width * referenceScale,
    height: size.height * referenceScale,
    scale: zoom / referenceScale,
  }
}

/** Camera movement notifies scope placement without rerendering the editor shell. */
export function createScopeViewport() {
  let snapshot: ScopeViewport = { x: 150, y: 100, scale: 0.448, top: 0 }
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    publish: (next: ScopeViewport) => {
      if (
        next.x === snapshot.x &&
        next.y === snapshot.y &&
        next.scale === snapshot.scale &&
        next.top === snapshot.top
      )
        return
      snapshot = next
      listeners.forEach((listener) => listener())
    },
  }
}
export type ScopeViewportStore = ReturnType<typeof createScopeViewport>
