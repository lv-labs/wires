import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import type { PointerEvent, RefObject } from "react"
import {
  isPanStart,
  panCamera,
  wheelCamera,
  zoomCamera,
} from "../editor/viewport"
import type { Camera } from "../editor/viewport"

const limits = { min: 0.064, max: 16 }
export function usePreviewViewport(
  svg: RefObject<SVGSVGElement | null>,
  artwork: RefObject<SVGGElement | null>,
  symbol: string
) {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 })
  const [size, setSize] = useState({ width: 700, height: 600 })
  const [panTool, setPanTool] = useState(false)
  const [panning, setPanning] = useState(false)
  const space = useRef(false),
    over = useRef(false),
    suppressCopy = useRef(false)
  const gesture = useRef<{
    id: number
    origin: { x: number; y: number }
    camera: Camera
  } | null>(null)
  useLayoutEffect(() => {
    const element = svg.current!
    let previous = { width: 0, height: 0 }
    const resize = () => {
      const rect = element.getBoundingClientRect(),
        next = { width: rect.width, height: rect.height }
      const dx = (next.width - previous.width) / 2,
        dy = (next.height - previous.height) / 2
      previous = next
      setSize(next)
      setCamera((c) => ({ ...c, x: c.x + dx, y: c.y + dy }))
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [svg])
  function zoom(factor: number) {
    const rect = svg.current!.getBoundingClientRect()
    setCamera((c) =>
      zoomCamera(c, { x: rect.width / 2, y: rect.height / 2 }, factor, limits)
    )
  }
  function fit() {
    const rect = svg.current?.getBoundingClientRect(),
      bounds = artwork.current?.getBBox()
    if (!rect || !bounds || !rect.width || !rect.height) return
    const scale = Math.max(
      limits.min,
      Math.min(
        1.28,
        (rect.width - 80) / Math.max(bounds.width + 40, 100),
        (rect.height - 80) / Math.max(bounds.height + 40, 100)
      )
    )
    setCamera({
      scale,
      x: rect.width / 2 - (bounds.x + bounds.width / 2) * scale,
      y: rect.height / 2 - (bounds.y + bounds.height / 2) * scale,
    })
  }
  const fitLatest = useEffectEvent(fit)
  useEffect(() => {
    const id = requestAnimationFrame(() => fitLatest())
    return () => cancelAnimationFrame(id)
  }, [symbol])
  const keyDown = useEffectEvent((event: KeyboardEvent) => {
    if (
      event.target instanceof Element &&
      event.target.closest(
        "input,textarea,select,button,[contenteditable=true],[role=menu],[role=dialog]"
      )
    )
      return
    if (!over.current && !svg.current?.contains(event.target as Node)) return
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (event.key === " ") {
      event.preventDefault()
      space.current = true
    } else if (["+", "=", "-", "0"].includes(event.key)) {
      event.preventDefault()
      if (event.key === "0") fit()
      else zoom(event.key === "-" ? 1 / 1.2 : 1.2)
    }
  })
  useEffect(() => {
    const element = svg.current!
    const wheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      setCamera((c) =>
        wheelCamera(
          c,
          event,
          { x: event.clientX - rect.left, y: event.clientY - rect.top },
          limits
        )
      )
    }
    const key = (event: KeyboardEvent) => keyDown(event)
    const up = (event: KeyboardEvent) => {
      if (event.key === " ") space.current = false
    }
    const blur = () => {
      space.current = false
      gesture.current = null
      setPanning(false)
      over.current = false
    }
    element.addEventListener("wheel", wheel, { passive: false })
    window.addEventListener("keydown", key)
    window.addEventListener("keyup", up)
    window.addEventListener("blur", blur)
    return () => {
      element.removeEventListener("wheel", wheel)
      window.removeEventListener("keydown", key)
      window.removeEventListener("keyup", up)
      window.removeEventListener("blur", blur)
    }
  }, [svg])
  function down(event: PointerEvent<SVGSVGElement>) {
    suppressCopy.current = false
    if (event.button === 0 || event.button === 1) event.currentTarget.focus()
    if (!isPanStart(event.button, panTool ? "pan" : "select", space.current))
      return
    event.preventDefault()
    event.currentTarget.focus()
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = {
      id: event.pointerId,
      origin: { x: event.clientX, y: event.clientY },
      camera,
    }
    suppressCopy.current = true
    setPanning(true)
  }
  function move(event: PointerEvent<SVGSVGElement>) {
    const g = gesture.current
    if (!g || g.id !== event.pointerId) return
    setCamera(
      panCamera(g.camera, g.origin, { x: event.clientX, y: event.clientY })
    )
  }
  function up(event: PointerEvent<SVGSVGElement>) {
    if (gesture.current?.id !== event.pointerId) return
    gesture.current = null
    setPanning(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }
  return {
    camera,
    size,
    zoom,
    fit,
    panTool,
    setPanTool,
    panning,
    left: -camera.x / camera.scale,
    top: -camera.y / camera.scale,
    viewBox: `${-camera.x / camera.scale} ${-camera.y / camera.scale} ${size.width / camera.scale} ${size.height / camera.scale}`,
    consumePanClick() {
      const result = suppressCopy.current
      suppressCopy.current = false
      return result
    },
    events: {
      onPointerDown: down,
      onPointerMove: move,
      onPointerUp: up,
      onPointerCancel: up,
      onLostPointerCapture: up,
      onPointerEnter: () => {
        over.current = true
      },
      onPointerLeave: () => {
        over.current = false
      },
    },
  }
}
