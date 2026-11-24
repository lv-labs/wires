import {
  arrangeDock,
  dockIds,
  dockRatio,
  dockSize,
  insertDock,
  normalizeDock,
  removeDock,
  swapDock,
} from "./scopeDock"
import type { DockEdge } from "./scopeDock"
import type { ScopeDockNode } from "./core"
import { core } from "./core"
import {
  clampFloating,
  floatingBounds,
  snapFloating,
  snapFloatingSize,
  snapSheetScopeSize,
} from "./scopeSnapping"
import type { PanelBox } from "./scopeSnapping"
import { useScopeLayout } from "./scopeLayout"
import type { ScopeLayout, ScopePaneLayout, ScopeSamples } from "./core"
import { defaultScopeSize, sheetScopeDisplay } from "./scopeViewport"
import type { ScopeViewportStore } from "./scopeViewport"
import {
  memo,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import type { CSSProperties, PointerEvent, ReactNode, RefObject } from "react"
import { createPortal } from "react-dom"
import { GripIcon, GripVerticalIcon } from "lucide-react"
import { ScopeContextMenu } from "./ScopeContextMenu"
import type { ScopeMode, TracePatch } from "./ScopeContextMenu"
import { scopeWindow, nearestScopeSample } from "./scopeDisplay"
import type { ScopeRendering } from "./scopeDisplay"
import { ScopePane } from "./ScopePane"
import type { ScopeTrace } from "./ScopePane"

type ScopeDrag = {
  id: string
  source: Layout
  x: number
  y: number
  startX: number
  startY: number
  left: number
  top: number
  width: number
  height: number
  moved: boolean
  overDock: boolean
  target?: string
  edge?: DockEdge
}
type Layout = ScopePaneLayout
const ScopeGestures = createContext<{
  begin: () => void
  end: () => void
} | null>(null)
const initialLayout = (): Layout => ({
  mode: "docked",
  timeDivision: 0.02,
  x: 24,
  y: 64,
  ...defaultScopeSize,
  weight: 1,
})
const stationaryViewport = { x: 0, y: 0, scale: 1, top: 0 }
const scopeGripClass =
  "flex w-5 shrink-0 cursor-grab touch-none items-center justify-center border-r border-border/70 bg-muted/25 text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary focus-visible:outline-none active:cursor-grabbing"
const revealScopeHandle =
  "opacity-0 group-hover/scope-shell:opacity-100 group-focus-within/scope-shell:opacity-100 [@media(hover:none)]:opacity-100"
/** Pointer capture keeps resizing local, including when the pointer leaves the handle. */
function DragHandle({
  label,
  orientation,
  className,
  style,
  onStart,
  onDelta,
  onKey,
  onFinish,
  children,
}: {
  label: string
  orientation?: "horizontal" | "vertical"
  className: string
  style?: CSSProperties
  onStart: (
    element: HTMLDivElement,
    event: PointerEvent<HTMLDivElement>
  ) => void
  onDelta: (x: number, y: number, event: PointerEvent<HTMLDivElement>) => void
  onKey: (key: string) => void
  onFinish?: (cancelled: boolean) => void
  children?: ReactNode
}) {
  const gestures = useContext(ScopeGestures)
  const origin = useRef<{ x: number; y: number; pointerId: number } | null>(
    null
  )
  function end(event: PointerEvent<HTMLDivElement>) {
    if (origin.current?.pointerId !== event.pointerId) return
    origin.current = null
    onFinish?.(event.type === "pointercancel")
    gestures?.end()
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }
  return (
    <div
      role={orientation ? "separator" : "button"}
      aria-label={label}
      aria-orientation={orientation}
      tabIndex={0}
      className={className}
      style={style}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.preventDefault()
        event.stopPropagation()
        event.currentTarget.focus()
        gestures?.begin()
        onStart(event.currentTarget, event)
        origin.current = {
          x: event.clientX,
          y: event.clientY,
          pointerId: event.pointerId,
        }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (origin.current?.pointerId === event.pointerId)
          onDelta(
            event.clientX - origin.current.x,
            event.clientY - origin.current.y,
            event
          )
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={() => {
        if (origin.current) {
          onFinish?.(true)
          gestures?.end()
        }
        origin.current = null
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && origin.current) {
          event.preventDefault()
          event.stopPropagation()
          const pointerId = origin.current.pointerId
          origin.current = null
          onFinish?.(true)
          gestures?.end()
          if (event.currentTarget.hasPointerCapture(pointerId))
            event.currentTarget.releasePointerCapture(pointerId)
          return
        }
        if (!event.key.startsWith("Arrow")) return
        event.preventDefault()
        event.stopPropagation()
        onKey(event.key)
      }}
    >
      {children}
    </div>
  )
}

/** Presentation-only grouping: new trace IDs get their own scope without changing acquisition. */
export function ScopeWorkspace({
  channels,
  times,
  cursor,
  open,
  rendering,
  sheet,
  onCursorCommit,
  onLeave,
  onHoverTrace,
  onProperties,
  viewport,
  onTraceSettings,
  onTimeWindow,
  onDeleteScope,
  savedLayout,
  onLayoutChange,
  onDockOpen,
}: {
  channels: ScopeTrace[]
  times: ScopeSamples
  cursor: number | null
  open: boolean
  rendering: ScopeRendering
  sheet: RefObject<HTMLDivElement | null>
  onCursorCommit: (time: number | null) => void
  onLeave: () => void
  onHoverTrace: (id: string | null) => void
  onProperties: (id: string, span: number, scale?: number) => void
  viewport: ScopeViewportStore
  onTraceSettings: (id: string, patch: TracePatch) => void
  onTimeWindow: (division: number) => void
  onDeleteScope: (traceIds: string[]) => void
  onDockOpen: () => void
  savedLayout?: ScopeLayout
  onLayoutChange: (layout: Omit<ScopeLayout, "version" | "open">) => void
}) {
  const [holding, setHolding] = useState<{
    id: string
    fraction: number
    mode: "hover" | "sample"
    sample: number | null
  } | null>(null)
  const hoverFrame = useRef<number | null>(null)
  const pendingHover = useRef<{ id: string; fraction: number } | null>(null)
  const cancelHoverFrame = useCallback(() => {
    if (hoverFrame.current !== null) cancelAnimationFrame(hoverFrame.current)
    hoverFrame.current = null
    pendingHover.current = null
  }, [])
  useEffect(() => cancelHoverFrame, [cancelHoverFrame])
  const [dragging, setDragging] = useState(false)
  const [hoveredScope, setHoveredScope] = useState<{
    id: string
    trace?: string
  } | null>(null)
  const paneScales = useRef(new Map<string, ReadonlyMap<string, number>>())
  const reportScales = useCallback(
    (id: string, scales: ReadonlyMap<string, number> | null) => {
      if (scales) paneScales.current.set(id, scales)
      else paneScales.current.delete(id)
    },
    []
  )
  const gestures = useMemo(
    () => ({ begin: () => setDragging(true), end: () => setDragging(false) }),
    []
  )
  const {
    assignments,
    activeTraces,
    panes: layouts,
    height,
    dock,
    setDock,
    setAssignments,
    setActiveTraces,
    setLayouts,
    setHeight,
  } = useScopeLayout(savedLayout, dragging, onLayoutChange)
  const [menu, setMenu] = useState<{ id: string; x: number; y: number } | null>(
    null
  )
  const menuOwner = useRef<HTMLDivElement | null>(null)
  const [front, setFront] = useState<string | null>(null)
  const [surface, setSurface] = useState<HTMLDivElement | null>(null)
  const [bounds, setBounds] = useState({ width: 800, height: 600 })
  const [scopeDrag, setScopeDrag] = useState<ScopeDrag | null>(null)
  const dragScope = useRef<ScopeDrag | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const resizeStart = useRef({ height: 260 })
  const splitStart = useRef<{
    tree: ScopeDockNode | null
    ratio: number
    span: number
  }>({ tree: null, ratio: 0.5, span: 1 })
  const floatStart = useRef<Layout>(initialLayout())
  const snapTargets = useRef<PanelBox[]>([])
  const groups = useMemo(() => {
    const result = new Map<string, ScopeTrace[]>()
    for (const channel of channels) {
      const group = Object.hasOwn(assignments, channel.id)
        ? assignments[channel.id]
        : channel.id
      const traces = result.get(group)
      if (traces) traces.push(channel)
      else result.set(group, [channel])
    }
    return result
  }, [channels, assignments])
  const selectTrace = useCallback(
    (group: string, trace: string) => {
      setActiveTraces((current) =>
        current[group] === trace ? current : { ...current, [group]: trace }
      )
    },
    [setActiveTraces]
  )
  const layoutFor = (id: string) =>
    Object.hasOwn(layouts, id) ? layouts[id] : initialLayout()
  const hoveredGroup =
    hoveredScope && (open || layoutFor(hoveredScope.id).mode !== "docked")
      ? groups.get(hoveredScope.id)
      : undefined
  const hoveredTrace =
    hoveredScope &&
    (hoveredGroup?.find((trace) => trace.id === hoveredScope.trace) ||
      hoveredGroup?.find(
        (trace) => trace.id === activeTraces[hoveredScope.id]
      ) ||
      hoveredGroup?.[0])
  const hoveredTraceId = hoveredTrace?.id ?? null
  useLayoutEffect(() => {
    onHoverTrace(hoveredTraceId)
  }, [hoveredTraceId, onHoverTrace])
  useLayoutEffect(() => () => onHoverTrace(null), [onHoverTrace])
  useEffect(() => {
    if (hoveredScope && !hoveredGroup) setHoveredScope(null)
  }, [hoveredGroup, hoveredScope])
  const docked = [...groups.keys()]
    .filter((id) => layoutFor(id).mode === "docked")
    .sort(
      (a, b) =>
        (layoutFor(a).order ?? Number.MAX_SAFE_INTEGER) -
        (layoutFor(b).order ?? Number.MAX_SAFE_INTEGER)
    )
  const floating = [...groups.keys()].filter(
    (id) => layoutFor(id).mode !== "docked"
  )

  const dockTree = normalizeDock(dock, docked, (id) => layoutFor(id).weight)
  const dockMinimum = dockSize(dockTree)
  const maxTimeDivision = groups.size
    ? Math.max(
        ...[...groups.keys()].map((id) => {
          const { timeDivision, trigger } = layoutFor(id)
          return timeDivision * (trigger && trigger.mode !== "off" ? 2 : 1)
        })
      )
    : 0.02
  useEffect(() => {
    onTimeWindow(maxTimeDivision)
  }, [maxTimeDivision, onTimeWindow])

  const followsSheet = [...groups.keys()].some(
    (id) => layoutFor(id).mode === "sheet"
  )
  const getViewport = useCallback(
    () => (followsSheet ? viewport.getSnapshot() : stationaryViewport),
    [viewport, followsSheet]
  )
  const camera = useSyncExternalStore(
    viewport.subscribe,
    getViewport,
    getViewport
  )

  useEffect(() => {
    const deselect = (event: globalThis.PointerEvent) => {
      if (
        event.target instanceof Element &&
        !event.target.closest(
          "[data-scope-workspace], [role=menu], [role=dialog]"
        )
      )
        setFront(null)
    }
    document.addEventListener("pointerdown", deselect)
    return () => document.removeEventListener("pointerdown", deselect)
  }, [])

  useLayoutEffect(() => {
    const element = sheet.current
    setSurface(element)
    if (!element) return
    const observer = new ResizeObserver(() =>
      setBounds({ width: element.clientWidth, height: element.clientHeight })
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [sheet])

  const updateLayout = useCallback(
    (id: string, change: Partial<Layout>) => {
      setLayouts((current) => ({
        ...current,
        [id]: { ...(current[id] || initialLayout()), ...change },
      }))
    },
    [setLayouts]
  )
  function position(
    layout: Pick<Layout, "width" | "height">,
    x: number,
    y: number
  ) {
    return clampFloating(layout, x, y, bounds)
  }
  function collectSnapTargets(id: string) {
    if (!surface) return
    const origin = surface.getBoundingClientRect()
    snapTargets.current = [
      ...surface.querySelectorAll<HTMLElement>(
        "[data-floating-scope], [data-component-slider-panel]"
      ),
    ]
      .filter((element) => element.dataset.floatingScope !== id)
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          x: rect.left - origin.left,
          y: rect.top - origin.top,
          width: rect.width,
          height: rect.height,
        }
      })
  }
  useEffect(() => {
    if (dragScope.current) collectSnapTargets(dragScope.current.id)
  }, [bounds.width, bounds.height])

  function floatingPosition(
    layout: Pick<Layout, "width" | "height">,
    x: number,
    y: number
  ) {
    return snapFloating(layout, x, y, bounds, snapTargets.current)
  }
  function boundedPanelHeight(value: number) {
    const maximum = window.innerHeight * 0.5
    return Math.min(maximum, Math.max(Math.min(180, maximum), value))
  }
  function resizePanel(next: number) {
    setHeight(boundedPanelHeight(next))
  }
  function paneData(id: string) {
    return scopeWindow(
      groups.get(id) || [],
      times,
      layoutFor(id).timeDivision * 10,
      layoutFor(id).trigger
    )
  }
  const hoverWindow =
    holding?.mode === "hover" ? { ...paneData(holding.id), index: 0 } : null
  const effectiveCursor =
    holding?.mode === "sample"
      ? holding.sample
      : hoverWindow && holding
        ? nearestScopeSample(
            times,
            hoverWindow.start +
              holding.fraction * (hoverWindow.end - hoverWindow.start),
            hoverWindow.index
          )
        : cursor
  const hoverCursor = useCallback((id: string, fraction: number) => {
    pendingHover.current = { id, fraction }
    if (hoverFrame.current !== null) return
    hoverFrame.current = requestAnimationFrame(() => {
      const hover = pendingHover.current
      hoverFrame.current = null
      pendingHover.current = null
      if (hover)
        setHolding((current) =>
          current?.mode === "hover" &&
          current.id === hover.id &&
          current.fraction === hover.fraction
            ? current
            : { ...hover, mode: "hover", sample: null }
        )
    })
  }, [])
  const leaveCursor = useCallback(() => {
    cancelHoverFrame()
    setHolding(null)
    onLeave()
  }, [cancelHoverFrame, onLeave])
  const changeTimeScale = useCallback(
    (id: string, timeDivision: number) => {
      updateLayout(id, { timeDivision })
      leaveCursor()
    },
    [updateLayout, leaveCursor]
  )
  const holdCursor = useCallback(
    (id: string, fraction: number | null) => {
      cancelHoverFrame()
      if (fraction !== null) {
        const window = scopeWindow(
          groups.get(id) || [],
          times,
          (layouts[id]?.timeDivision ?? 0.02) * 10,
          layouts[id]?.trigger
        )
        const sample = nearestScopeSample(
          times,
          window.start + fraction * (window.end - window.start),
          0
        )
        setHolding({ id, fraction, mode: "sample", sample })
        onCursorCommit(sample)
      } else {
        setHolding((current) =>
          current ? { ...current, mode: "hover", sample: null } : null
        )
      }
    },
    [cancelHoverFrame, times, layouts, groups, onCursorCommit]
  )
  function renderPane(id: string) {
    const layout = layoutFor(id)
    return (
      <ScopeContent
        id={id}
        channels={groups.get(id)!}
        times={times}
        rendering={rendering}
        timeDivision={layout.timeDivision}
        trigger={layout.trigger}
        hideUi={layout.hideUi}
        onTrigger={(trigger) => {
          updateLayout(id, { trigger })
          leaveCursor()
        }}
        cursor={effectiveCursor}
        liveFraction={
          holding?.id === id && holding.mode === "hover"
            ? holding.fraction
            : undefined
        }
        onHold={holdCursor}
        selectedTrace={activeTraces[id]}
        onSelectTrace={selectTrace}
        onProperties={onProperties}
        onDisplayScales={reportScales}
        onTimeScale={changeTimeScale}
        onTraceSettings={onTraceSettings}
        onCursor={hoverCursor}
        onLeave={leaveCursor}
      />
    )
  }
  function deleteScope(id: string) {
    const traces = groups.get(id)
    if (!traces?.length) return
    onDeleteScope(traces.map((trace) => trace.id))
    leaveCursor()
    setMenu(null)
    setFront(null)
  }

  function contextEvents(id: string) {
    return {
      tabIndex: 0,
      onPointerOver: (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "touch") return
        const trace =
          event.target instanceof Element
            ? event.target.closest<SVGElement | HTMLElement>(
                "[data-select-trace]"
              )?.dataset.selectTrace
            : undefined
        setHoveredScope((current) =>
          current?.id === id && current.trace === trace
            ? current
            : { id, trace }
        )
      },
      onPointerLeave: () => {
        setHoveredScope((current) => (current?.id === id ? null : current))
      },
      onPointerDownCapture: (event: React.PointerEvent<HTMLDivElement>) => {
        setFront(id)
        if (
          event.target instanceof Element &&
          !event.target.closest(
            "button, input, textarea, select, [role=button], [role=checkbox], [contenteditable=true]"
          )
        )
          event.currentTarget.focus({ preventScroll: true })
      },
      onFocusCapture: () => setFront(id),
      onContextMenu: (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setFront(id)
        const hit =
          event.target instanceof Element
            ? event.target.closest<SVGElement>("[data-select-trace]")?.dataset
                .selectTrace
            : undefined
        if (hit) setActiveTraces((current) => ({ ...current, [id]: hit }))
        menuOwner.current = event.currentTarget
        setMenu({ id, x: event.clientX, y: event.clientY })
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
          (event.key === "Backspace" || event.key === "Delete") &&
          !event.defaultPrevented &&
          !(
            event.target instanceof Element &&
            event.target.closest(
              "input, textarea, select, [contenteditable=true], [role=menu], [role=dialog]"
            )
          )
        ) {
          event.preventDefault()
          event.stopPropagation()
          deleteScope(id)
          return
        }
        if (
          event.key === "ContextMenu" ||
          (event.shiftKey && event.key === "F10")
        ) {
          event.preventDefault()
          event.stopPropagation()
          menuOwner.current = event.currentTarget
          const rect = event.currentTarget.getBoundingClientRect()
          setMenu({ id, x: rect.left + 16, y: rect.top + 16 })
        }
      },
    }
  }
  function beginScopeDrag(
    id: string,
    handle: HTMLDivElement,
    event: PointerEvent<HTMLDivElement>
  ) {
    collectSnapTargets(id)
    const card = handle.parentElement!
    const rect = card.getBoundingClientRect()
    const next: ScopeDrag = {
      id,
      source: { ...layoutFor(id) },
      x: event.clientX,
      y: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      moved: false,
      overDock: false,
    }
    dragScope.current = next
    setScopeDrag(next)
    setMenu(null)
    onLeave()
    setFront(id)
  }
  function moveScopeDrag(event: PointerEvent<HTMLDivElement>) {
    const start = dragScope.current
    if (!start) return
    const moved =
      start.moved ||
      Math.hypot(event.clientX - start.startX, event.clientY - start.startY) >=
        5
    const rect = panel.current?.getBoundingClientRect()
    const overDock =
      !!rect &&
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top - 12 &&
      event.clientY <= rect.bottom + 12
    const cards = [
      ...(panel.current?.querySelectorAll<HTMLElement>("[data-docked-scope]") ||
        []),
    ].filter((card) => card.dataset.dockedScope !== start.id)
    const hit = cards.find((card) => {
      const box = card.getBoundingClientRect()
      return (
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom
      )
    })
    const target = hit?.dataset.dockedScope
    let edge: DockEdge = "right"
    if (hit) {
      const box = hit.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width,
        y = (event.clientY - box.top) / box.height
      edge = (
        [
          ["left", x],
          ["right", 1 - x],
          ["top", y],
          ["bottom", 1 - y],
        ] as [DockEdge, number][]
      ).sort((a, b) => a[1] - b[1])[0][0]
    }
    const next = {
      ...start,
      x: event.clientX,
      y: event.clientY,
      moved,
      overDock,
      target,
      edge,
    }
    dragScope.current = next
    setScopeDrag(next)
  }
  function reorderScope(
    id: string,
    index: number,
    dockChange?: Partial<Layout>
  ) {
    const order = dockIds(dockTree)
    const other = order[Math.max(0, Math.min(index, order.length - 1))]
    if (dockTree && other && other !== id)
      setDock(swapDock(dockTree, id, other))
    if (dockChange) updateLayout(id, dockChange)
  }

  function finishScopeDrag(cancelled: boolean) {
    const drag = dragScope.current
    dragScope.current = null
    setScopeDrag(null)
    if (!drag) return
    if (cancelled) {
      if (drag.source.mode !== "docked") updateLayout(drag.id, drag.source)
      return
    }
    if (!drag.moved) return
    if (drag.overDock) {
      if (drag.source.mode === "docked" && !drag.target) return
      const scale =
        drag.source.mode === "sheet" ? viewport.getSnapshot().scale : 1
      const next = insertDock(
        removeDock(dockTree, drag.id),
        drag.id,
        drag.target,
        drag.edge
      )
      setDock(next)
      updateLayout(drag.id, {
        mode: "docked",
        width: drag.source.width * scale,
        height: drag.source.height * scale,
      })
      if (drag.edge === "top" || drag.edge === "bottom")
        setHeight((current) =>
          boundedPanelHeight(Math.max(current, dockSize(next).height + 8))
        )
      if (!open) onDockOpen()
    } else if (drag.source.mode === "docked" && surface) {
      const box = surface.getBoundingClientRect()
      const dimensions = {
        width: Math.min(
          floatingBounds(bounds).width,
          Math.max(320, drag.width)
        ),
        height: Math.min(
          floatingBounds(bounds).height,
          Math.max(220, drag.height)
        ),
      }
      updateLayout(drag.id, {
        mode: "floating",
        ...dimensions,
        ...floatingPosition(
          dimensions,
          drag.left + drag.x - drag.startX - box.left,
          drag.top + drag.y - drag.startY - box.top
        ),
      })
    }
  }
  function changeMode(id: string, mode: ScopeMode) {
    const camera = viewport.getSnapshot()
    const saved = layoutFor(id)
    const wasSheet = saved.mode === "sheet"
    const screen = wasSheet
      ? {
          x: saved.x * camera.scale + camera.x,
          y: saved.y * camera.scale + camera.y,
          width: saved.width * camera.scale,
          height: saved.height * camera.scale,
        }
      : saved
    collectSnapTargets(id)
    const dimensions = {
      width: Math.min(screen.width, floatingBounds(bounds).width),
      height: Math.min(screen.height, floatingBounds(bounds).height),
    }
    if (mode === "sheet") {
      const size = snapSheetScopeSize(
        dimensions.width / camera.scale,
        dimensions.height / camera.scale
      )
      const point = floatingPosition(
        {
          width: size.width * camera.scale,
          height: size.height * camera.scale,
        },
        screen.x,
        screen.y
      )
      updateLayout(id, {
        mode,
        x: core.geometry.snap((point.x - camera.x) / camera.scale),
        y: core.geometry.snap((point.y - camera.y) / camera.scale),
        ...size,
      })
    } else {
      const point = floatingPosition(dimensions, screen.x, screen.y)
      updateLayout(id, { mode, ...point, ...dimensions })
    }
    setFront(id)
    setMenu(null)
  }
  function renderDock(node: ScopeDockNode, path = ""): ReactNode {
    if (node.type === "scope") {
      const id = node.id
      const preview =
        scopeDrag?.moved && scopeDrag.overDock && scopeDrag.target === id
          ? scopeDrag.edge
          : undefined
      const previewStyle: CSSProperties =
        preview === "left"
          ? { left: 0, top: 0, width: "50%", height: "100%" }
          : preview === "right"
            ? { right: 0, top: 0, width: "50%", height: "100%" }
            : preview === "top"
              ? { left: 0, top: 0, width: "100%", height: "50%" }
              : { left: 0, bottom: 0, width: "100%", height: "50%" }
      return (
        <div
          key={id}
          data-docked-scope={id}
          className="group/scope-shell relative flex h-full min-h-0 min-w-0 outline-none data-[selected=true]:ring-2 data-[selected=true]:ring-primary data-[selected=true]:ring-inset"
          data-selected={front === id}
          {...contextEvents(id)}
          style={{
            opacity: scopeDrag?.moved && scopeDrag.id === id ? 0.45 : 1,
          }}
        >
          <DragHandle
            label={`Reorder or undock scope ${groups.get(id)?.[0].label}`}
            className={
              layoutFor(id).hideUi
                ? `${scopeGripClass} ${revealScopeHandle} absolute inset-y-0 left-0 z-10`
                : scopeGripClass
            }
            onStart={(handle, event) => beginScopeDrag(id, handle, event)}
            onDelta={(_, __, event) => moveScopeDrag(event)}
            onFinish={finishScopeDrag}
            onKey={(key) => {
              if (key === "ArrowLeft" || key === "ArrowRight")
                reorderScope(
                  id,
                  dockIds(dockTree).indexOf(id) + (key === "ArrowLeft" ? -1 : 1)
                )
            }}
          >
            <GripVerticalIcon className="size-3.5" aria-hidden="true" />
          </DragHandle>
          <div className="min-h-0 min-w-0 flex-1">{renderPane(id)}</div>
          {preview && (
            <div
              className="pointer-events-none absolute z-40 border-2 border-primary bg-primary/15"
              style={previewStyle}
            />
          )}
        </div>
      )
    }
    const horizontal = node.axis === "horizontal"
    return (
      <div
        className={`flex h-full min-h-0 min-w-0 ${horizontal ? "flex-row" : "flex-col"}`}
      >
        <div
          className="min-h-0 min-w-0 overflow-hidden"
          style={{ flex: `${node.ratio} 1 0` }}
        >
          {renderDock(node.first, path + "a")}
        </div>
        <DragHandle
          label={`Resize ${horizontal ? "horizontal" : "vertical"} scope split`}
          orientation={horizontal ? "vertical" : "horizontal"}
          className={`shrink-0 touch-none bg-border/50 hover:bg-primary/30 focus-visible:bg-primary/30 ${horizontal ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize"}`}
          onStart={(handle) => {
            const rect = handle.parentElement!.getBoundingClientRect()
            splitStart.current = {
              tree: dockTree,
              ratio: node.ratio,
              span: Math.max(1, (horizontal ? rect.width : rect.height) - 8),
            }
          }}
          onDelta={(x, y) => {
            if (splitStart.current.tree)
              setDock(
                dockRatio(
                  splitStart.current.tree,
                  path,
                  splitStart.current.ratio +
                    (horizontal ? x : y) / splitStart.current.span
                )
              )
          }}
          onKey={(key) => {
            const delta = horizontal
              ? key === "ArrowRight"
                ? 0.05
                : key === "ArrowLeft"
                  ? -0.05
                  : 0
              : key === "ArrowDown"
                ? 0.05
                : key === "ArrowUp"
                  ? -0.05
                  : 0
            if (dockTree) setDock(dockRatio(dockTree, path, node.ratio + delta))
          }}
        />
        <div
          className="min-h-0 min-w-0 overflow-hidden"
          style={{ flex: `${1 - node.ratio} 1 0` }}
        >
          {renderDock(node.second, path + "b")}
        </div>
      </div>
    )
  }
  const selected = menu ? groups.get(menu.id) : undefined
  return (
    <ScopeGestures.Provider value={gestures}>
      {((open && docked.length > 0) || scopeDrag?.moved) && (
        <div
          ref={panel}
          className="relative flex min-h-0 shrink-0 flex-col border-b data-[drop=true]:ring-2 data-[drop=true]:ring-primary data-[drop=true]:ring-inset"
          data-drop={scopeDrag?.moved && scopeDrag.overDock}
          style={{
            height: open && docked.length ? height : 80,
            maxHeight: "50vh",
          }}
          aria-label="Docked scopes"
          data-scope-workspace
        >
          <DragHandle
            label="Resize scope panel"
            orientation="horizontal"
            className="h-2 shrink-0 cursor-row-resize touch-none bg-border/50 hover:bg-primary/30 focus-visible:bg-primary/30"
            onStart={() => {
              resizeStart.current = {
                height: panel.current?.getBoundingClientRect().height || height,
              }
            }}
            onDelta={(_, y) => resizePanel(resizeStart.current.height - y)}
            onKey={(key) =>
              resizePanel(
                (panel.current?.getBoundingClientRect().height || height) +
                  (key === "ArrowUp" ? 20 : key === "ArrowDown" ? -20 : 0)
              )
            }
          />
          {scopeDrag?.moved && (
            <div className="pointer-events-none absolute inset-x-0 top-2 z-40 mx-auto w-fit rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
              {scopeDrag.overDock
                ? `Drop to ${scopeDrag.edge === "top" ? "split above" : scopeDrag.edge === "bottom" ? "split below" : scopeDrag.edge === "left" ? "split left" : "split right"}`
                : "Drop here to dock"}
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-auto">
            {dockTree && (
              <div
                className="h-full w-full"
                style={{
                  minWidth: dockMinimum.width,
                  minHeight: dockMinimum.height,
                }}
              >
                {renderDock(dockTree)}
              </div>
            )}
          </div>
        </div>
      )}
      {surface &&
        floating.map((id) => {
          const saved = layoutFor(id)
          const anchored = saved.mode === "sheet"
          const layout = anchored
            ? saved
            : {
                ...saved,
                width: Math.min(saved.width, floatingBounds(bounds).width),
                height: Math.min(saved.height, floatingBounds(bounds).height),
              }
          const point = anchored
            ? {
                x: saved.x * camera.scale + camera.x,
                y: saved.y * camera.scale + camera.y,
              }
            : position(layout, layout.x, layout.y)
          const display = anchored
            ? sheetScopeDisplay(layout, camera.scale)
            : null
          const inView =
            !anchored ||
            (point.x + layout.width * camera.scale > 0 &&
              point.x < bounds.width &&
              point.y + layout.height * camera.scale > camera.top &&
              point.y < bounds.height)
          return createPortal(
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{
                zIndex: anchored
                  ? front === id
                    ? 11
                    : 10
                  : front === id
                    ? 30
                    : 20,
                clipPath: anchored ? `inset(${camera.top}px 0 0 0)` : undefined,
              }}
            >
              <div
                className="group/scope-shell pointer-events-auto absolute flex min-h-0 overflow-hidden rounded-lg border bg-background shadow-xl outline-none data-[selected=true]:ring-2 data-[selected=true]:ring-primary"
                data-selected={front === id}
                {...contextEvents(id)}
                data-scope-workspace
                data-sheet-scope={anchored ? "" : undefined}
                data-floating-scope={anchored ? undefined : id}
                style={{
                  zIndex: anchored
                    ? front === id
                      ? 11
                      : 10
                    : front === id
                      ? 30
                      : 20,
                  left: point.x,
                  top: point.y,
                  width: display?.width ?? layout.width,
                  height: display?.height ?? layout.height,
                  transform: display ? `scale(${display.scale})` : undefined,
                  transformOrigin: "top left",
                }}
                role="region"
                aria-label={`${anchored ? "Sheet" : "Floating"} scope: ${groups
                  .get(id)
                  ?.map((c) => c.label)
                  .join(", ")}`}
              >
                <DragHandle
                  label={`Move scope ${groups.get(id)?.[0].label}`}
                  className={
                    saved.hideUi
                      ? `${scopeGripClass} ${revealScopeHandle} absolute inset-y-0 left-0 z-10`
                      : scopeGripClass
                  }
                  onStart={(handle, event) => {
                    beginScopeDrag(id, handle, event)
                    floatStart.current = { ...layout, ...point }
                  }}
                  onDelta={(x, y, event) => {
                    moveScopeDrag(event)
                    if (anchored) {
                      updateLayout(id, {
                        x: core.geometry.snap(
                          (floatStart.current.x + x - camera.x) / camera.scale
                        ),
                        y: core.geometry.snap(
                          (floatStart.current.y + y - camera.y) / camera.scale
                        ),
                      })
                    } else
                      updateLayout(
                        id,
                        floatingPosition(
                          floatStart.current,
                          floatStart.current.x + x,
                          floatStart.current.y + y
                        )
                      )
                  }}
                  onFinish={finishScopeDrag}
                  onKey={(key) => {
                    collectSnapTargets(id)
                    const x =
                      key === "ArrowLeft" ? -16 : key === "ArrowRight" ? 16 : 0
                    const y =
                      key === "ArrowUp" ? -16 : key === "ArrowDown" ? 16 : 0
                    updateLayout(
                      id,
                      anchored
                        ? {
                            x: core.geometry.snap(
                              layout.x + (x / 16) * core.geometry.grid
                            ),
                            y: core.geometry.snap(
                              layout.y + (y / 16) * core.geometry.grid
                            ),
                          }
                        : floatingPosition(layout, point.x + x, point.y + y)
                    )
                  }}
                >
                  <GripVerticalIcon className="size-3.5" aria-hidden="true" />
                </DragHandle>
                <div className="relative min-h-0 min-w-0 flex-1">
                  {inView && renderPane(id)}
                </div>
                <DragHandle
                  label={`Resize ${anchored ? "sheet" : "floating"} scope ${groups.get(id)?.[0].label}`}
                  className={`absolute right-0 bottom-0 z-10 h-4 w-4 cursor-nwse-resize touch-none border-r-2 border-b-2 border-muted-foreground ${saved.hideUi ? revealScopeHandle : ""}`}
                  onStart={() => {
                    collectSnapTargets(id)
                    floatStart.current = { ...layout, ...point }
                  }}
                  onDelta={(x, y) =>
                    updateLayout(
                      id,
                      anchored
                        ? snapSheetScopeSize(
                            floatStart.current.width + x / camera.scale,
                            floatStart.current.height + y / camera.scale
                          )
                        : snapFloatingSize(
                            floatStart.current.width + x,
                            floatStart.current.height + y,
                            point,
                            bounds,
                            snapTargets.current
                          )
                    )
                  }
                  onKey={(key) => {
                    collectSnapTargets(id)
                    const x =
                      key === "ArrowLeft" ? -1 : key === "ArrowRight" ? 1 : 0
                    const y =
                      key === "ArrowUp" ? -1 : key === "ArrowDown" ? 1 : 0
                    updateLayout(
                      id,
                      anchored
                        ? snapSheetScopeSize(
                            layout.width + x * core.geometry.grid,
                            layout.height + y * core.geometry.grid
                          )
                        : snapFloatingSize(
                            layout.width + x * 16,
                            layout.height + y * 16,
                            point,
                            bounds,
                            snapTargets.current
                          )
                    )
                  }}
                />
              </div>
            </div>,
            surface,
            id
          )
        })}
      {scopeDrag?.moved &&
        scopeDrag.source.mode === "docked" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[100] flex items-center gap-2 rounded-md border bg-background/95 px-3 py-2 text-xs shadow-xl"
            style={{
              left: scopeDrag.left + scopeDrag.x - scopeDrag.startX,
              top: scopeDrag.top + scopeDrag.y - scopeDrag.startY,
              width: Math.max(180, Math.min(480, scopeDrag.width)),
            }}
          >
            <GripIcon className="size-4 shrink-0" />
            <span className="truncate">
              {groups
                .get(scopeDrag.id)
                ?.map((trace) => trace.label)
                .join(" · ")}
            </span>
            <span className="ml-auto shrink-0 text-muted-foreground">
              {scopeDrag.overDock ? "Reorder" : "Undock"}
            </span>
          </div>,
          window.document.body
        )}
      {menu && selected && (open || layoutFor(menu.id).mode !== "docked") && (
        <ScopeContextMenu
          menu={menu}
          traces={paneData(menu.id).channels}
          scopes={[...groups]
            .filter(([id]) => id !== menu.id)
            .map(([id, traces]) => ({
              id,
              label: traces.map((c) => c.label).join(" · "),
            }))}
          mode={layoutFor(menu.id).mode}
          timeDivision={layoutFor(menu.id).timeDivision}
          hideUi={!!layoutFor(menu.id).hideUi}
          onToggleUi={() => {
            updateLayout(menu.id, { hideUi: !layoutFor(menu.id).hideUi })
            leaveCursor()
            setMenu(null)
          }}
          owner={menuOwner}
          onClose={() => setMenu(null)}
          onDelete={() => deleteScope(menu.id)}
          onArrange={(axis) => {
            const tree = arrangeDock(dockIds(dockTree), axis)
            setDock(tree)
            if (axis === "vertical")
              setHeight((current) =>
                boundedPanelHeight(Math.max(current, dockSize(tree).height + 8))
              )
          }}
          selectedTrace={
            selected.some((trace) => trace.id === activeTraces[menu.id])
              ? activeTraces[menu.id]
              : selected[0]?.id
          }
          onSelectTrace={(trace) =>
            setActiveTraces((current) => ({ ...current, [menu.id]: trace }))
          }
          onTrace={(id, patch) => {
            setActiveTraces((current) => ({ ...current, [menu.id]: id }))
            onTraceSettings(id, patch)
          }}
          getDisplayScale={(id) => paneScales.current.get(menu.id)?.get(id)}
          onTime={(value) => changeTimeScale(menu.id, value)}
          onMode={(mode) => changeMode(menu.id, mode)}
          onCombine={(id) => {
            setAssignments((current) => ({
              ...current,
              ...Object.fromEntries(selected.map((c) => [c.id, id])),
            }))
            setMenu(null)
          }}
          onSeparate={() => {
            const split = selected.map((trace) => ({
              trace,
              group: crypto.randomUUID(),
            }))
            setAssignments((current) => ({
              ...current,
              ...Object.fromEntries(
                split.map(({ trace, group }) => [trace.id, group])
              ),
            }))
            setLayouts((current) => ({
              ...current,
              ...Object.fromEntries(
                split.map(({ group }) => [
                  group,
                  {
                    ...initialLayout(),
                    timeDivision: layoutFor(menu.id).timeDivision,
                  },
                ])
              ),
            }))
            setMenu(null)
          }}
        />
      )}
    </ScopeGestures.Provider>
  )
}

/** Camera/selection/window placement changes never recrop samples or rebuild SVG paths. */
const ScopeContent = memo(function ScopeContent({
  id,
  channels,
  times,
  rendering,
  hideUi,
  timeDivision,
  trigger,
  onTrigger,
  cursor,
  liveFraction,
  onHold,
  selectedTrace,
  onSelectTrace,
  onProperties,
  onDisplayScales,
  onTimeScale,
  onTraceSettings,
  onCursor,
  onLeave,
}: {
  id: string
  channels: ScopeTrace[]
  times: ScopeSamples
  rendering: ScopeRendering
  hideUi?: boolean
  trigger?: ScopePaneLayout["trigger"]
  onTrigger: (trigger: NonNullable<ScopePaneLayout["trigger"]>) => void
  timeDivision: number
  cursor: number | null
  liveFraction?: number
  onHold: (id: string, fraction: number | null) => void
  selectedTrace?: string
  onSelectTrace: (group: string, trace: string) => void
  onProperties: (trace: string, span: number, scale?: number) => void
  onDisplayScales: (
    id: string,
    scales: ReadonlyMap<string, number> | null
  ) => void
  onTimeScale: (id: string, division: number) => void
  onTraceSettings: (id: string, patch: TracePatch) => void
  onCursor: (id: string, fraction: number) => void
  onLeave: () => void
}) {
  const window = useMemo(
    () => scopeWindow(channels, times, timeDivision * 10, trigger),
    [channels, times, timeDivision, trigger]
  )
  const select = useCallback(
    (trace: string) => onSelectTrace(id, trace),
    [id, onSelectTrace]
  )
  const hold = useCallback(
    (fraction: number | null) => onHold(id, fraction),
    [id, onHold]
  )
  const hover = useCallback(
    (fraction: number) => onCursor(id, fraction),
    [id, onCursor]
  )
  const properties = useCallback(
    (trace: string, scale?: number) =>
      onProperties(trace, timeDivision * 10, scale),
    [onProperties, timeDivision]
  )
  const displayScales = useCallback(
    (scales: ReadonlyMap<string, number>) => onDisplayScales(id, scales),
    [id, onDisplayScales]
  )
  const timeScale = useCallback(
    (division: number) => onTimeScale(id, division),
    [id, onTimeScale]
  )
  useLayoutEffect(() => () => onDisplayScales(id, null), [id, onDisplayScales])
  return (
    <ScopePane
      id={id}
      {...window}
      rendering={rendering}
      hideUi={hideUi}
      timeDivision={timeDivision}
      trigger={trigger}
      onTrigger={onTrigger}
      cursor={cursor}
      liveFraction={liveFraction}
      onHold={hold}
      selectedTrace={selectedTrace}
      onSelectTrace={select}
      onRenameChannel={properties}
      onDisplayScales={displayScales}
      onTimeScale={timeScale}
      onTraceSettings={onTraceSettings}
      onCursor={hover}
      onLeave={onLeave}
    />
  )
})
