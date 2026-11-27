import { Component, useEffect, useRef, useState } from "react"
import type { ComponentType, ReactNode } from "react"
import type { SymbolProps } from "../../../../packages/circuit-symbols/svg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { waveformChoices, previewWaveform } from "./waveformPreview"
import type { WaveformKind } from "./waveformPreview"
import { usePreviewViewport } from "./usePreviewViewport"
import { CodeEditor } from "./CodeEditor"
import { LedGlowControl } from "../editor/LedGlowControl"
import { useLedGlow } from "../editor/useLedGlow"
import { core } from "../editor/core"
import { libraryGroups } from "./libraryGroups"
import {
  sourceCoordinates,
  snapPreviewPoint,
  formatCoordinates,
} from "./previewGeometry"
import "./style.css"

type Entry = {
  kind: string
  metadata: {
    name: string
    drawingScale?: number
    pins: Record<string, [number, number]>
    parameters?: Record<string, unknown>
  }
  Symbol: ComponentType<SymbolProps>
}
const library = Object.values(
  import.meta.glob("../../../../packages/circuit-symbols/src/*.tsx", {
    eager: true,
  })
) as Entry[]
library.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name))
type Workspace = { source: string; draft: string }
type Preview = { source: string; entry: Entry }
type Failure = { source: string; message: string }
const groups = libraryGroups(library.map((entry) => entry.kind))
const bitDisplays = new Set(["decimalDisplay", "instructionDisplay"])

function previewPins(entry: Entry, parameters?: Record<string, unknown>) {
  const scale = entry.metadata.drawingScale ?? 1
  const pins = Object.fromEntries(
    Object.entries(entry.metadata.pins).map(([id, point]) => [
      id,
      point.map((value) => value * scale),
    ])
  )
  return core.catalog.componentPins(
    {
      kind: entry.kind,
      parameters: { ...entry.metadata.parameters, ...parameters },
    },
    { pins }
  )
}

function Artwork({
  entry,
  rotation = 0,
  mirror = false,
  parameters,
  current = 0,
  highlighted = false,
  glow = 1,
}: {
  entry: Entry
  rotation?: number
  mirror?: boolean
  parameters?: Record<string, unknown>
  current?: number
  highlighted?: boolean
  glow?: boolean | number
}) {
  const scale = entry.metadata.drawingScale ?? 1
  const pinPositions =
    bitDisplays.has(entry.kind) ||
    entry.kind === "sevenSegment" ||
    core.catalog.counterKind(entry.kind) ||
    core.catalog.discreteChipKind(entry.kind) ||
    core.catalog.gateKind(entry.kind)
      ? Object.fromEntries(
          Object.entries(previewPins(entry, parameters)).map(([id, [x, y]]) => [
            id,
            [x / scale, y / scale] as const,
          ])
        )
      : undefined
  return (
    <g
      transform={`rotate(${rotation}) scale(${mirror ? -1 : 1} 1)`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform={`scale(${scale})`} strokeWidth={6.25 / scale}>
        <entry.Symbol
          parameters={{ ...entry.metadata.parameters, ...parameters }}
          pinPositions={pinPositions}
          pose={{ rotation, mirror }}
          current={current}
          highlighted={highlighted}
          glow={glow}
        />
      </g>
    </g>
  )
}
function PinMarkers({
  entry,
  parameters,
  rotation,
  mirror,
  zoom,
}: {
  entry: Entry
  parameters: Record<string, unknown>
  rotation: number
  mirror: boolean
  zoom: number
}) {
  const positions = previewPins(entry, parameters)
  return (
    <g transform={`rotate(${rotation}) scale(${mirror ? -1 : 1} 1)`}>
      {Object.entries(positions).map(([id, p]) => {
        const x = p[0],
          y = p[1]
        return (
          <g key={id}>
            <circle
              cx={x}
              cy={y}
              r={6 / zoom}
              fill="var(--background)"
              stroke="var(--muted-foreground)"
              strokeWidth={2 / zoom}
            />
            <text
              x={x + 12 / zoom}
              y={y + 4 / zoom}
              fontSize={12 / zoom}
              fill="var(--muted-foreground)"
            >
              {id}
            </text>
          </g>
        )
      })}
    </g>
  )
}
class PreviewBoundary extends Component<
  { children: ReactNode; onError?: (message: string) => void },
  { error: string | null }
> {
  state: { error: string | null } = { error: null }
  static getDerivedStateFromError(error: unknown) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
  componentDidCatch(error: Error) {
    this.props.onError?.(error.message)
  }
  render() {
    return this.state.error ? (
      <g>
        <text x="0" y="0" textAnchor="middle" fontSize="13" fill="#a34535">
          Preview error — check the source panel
        </text>
      </g>
    ) : (
      this.props.children
    )
  }
}
export default function App() {
  const [kind, setKind] = useState("resistor"),
    [query, setQuery] = useState("")
  const [ledGlow, setLedGlow] = useLedGlow()
  const [ledHovered, setLedHovered] = useState(false)
  const [sourceTab, setSourceTab] = useState<"symbol" | "glyphs">("symbol")
  const [workspaces, setWorkspaces] = useState<Record<string, Workspace>>({})
  const [previews, setPreviews] = useState<Record<string, Preview>>({})
  const [failures, setFailures] = useState<Record<string, Failure | undefined>>(
    {}
  )
  const [busy, setBusy] = useState(false),
    [previewing, setPreviewing] = useState(false)
  const [status, setStatus] = useState("Loading symbol source…")
  const [rotation, setRotation] = useState(0),
    [mirror, setMirror] = useState(false)
  const [pins, setPins] = useState(true),
    [grid, setGrid] = useState(true)
  const [snapStep, setSnapStep] = useState(10)
  const [parameters, setParameters] = useState<Record<string, unknown>>({}),
    [current, setCurrent] = useState(0)
  const saveInFlight = useRef(false),
    svg = useRef<SVGSVGElement>(null),
    artwork = useRef<SVGGElement>(null)
  const [pointer, setCursor] = useState<{ x: number; y: number } | null>(null)
  const viewport = usePreviewViewport(svg, artwork, kind)
  const canvasSize = viewport.size,
    zoom = viewport.camera.scale
  const original = library.find((e) => e.kind === kind)!
  const entry = previews[kind]?.entry ?? original
  const hasWaveform = !!entry.metadata.parameters?.waveform
  const usesGlyphs = hasWaveform || kind === "sweepSource"
  const resource =
    sourceTab === "glyphs" && usesGlyphs ? "waveformGlyphs" : kind
  const workspace = workspaces[resource]
  const symbolSource = workspaces[kind]?.draft
  const glyphSource = usesGlyphs ? workspaces.waveformGlyphs?.draft : undefined
  const loaded = !!workspaces[kind] && !!workspaces[resource]
  const previewCode = JSON.stringify([symbolSource, glyphSource])
  const waveform = (parameters.waveform ??
    entry.metadata.parameters?.waveform) as Record<string, unknown> | undefined
  const cursor = pointer
    ? snapPreviewPoint(
        (pointer.x - viewport.camera.x) / zoom,
        (pointer.y - viewport.camera.y) / zoom,
        rotation,
        mirror,
        entry.metadata.drawingScale ?? 1,
        snapStep
      )
    : null
  const coordinate = cursor
    ? sourceCoordinates(
        cursor.x,
        cursor.y,
        rotation,
        mirror,
        entry.metadata.drawingScale ?? 1
      )
    : null
  const gridSpacing = snapStep * (entry.metadata.drawingScale ?? 1)
  const number = (value: number) => Number(value.toFixed(2))
  const currentDirty = !!workspace && workspace.source !== workspace.draft
  const dirty = Object.values(workspaces).some((w) => w.source !== w.draft)
  const failure = failures[kind],
    error = failure && failure.source === previewCode ? failure.message : null
  const previewMatches = previews[kind]?.source === previewCode
  useEffect(() => {
    if (loaded) return
    const controller = new AbortController()
    const resources = [...new Set([kind, resource])].filter(
      (key) => !workspaces[key]
    )
    Promise.all(
      resources.map(async (key) => {
        const response = await fetch(`/__symbols/${key}`, {
          signal: controller.signal,
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        return [key, { source: data.source, draft: data.source }] as const
      })
    )
      .then((items) => {
        setWorkspaces((all) => ({ ...all, ...Object.fromEntries(items) }))
        setStatus("Source loaded")
      })
      .catch((error) => {
        if (!controller.signal.aborted) setStatus(String(error))
      })
    return () => controller.abort()
    // Only load on resource changes; text edits keep their existing draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, resource, loaded])
  useEffect(() => {
    if (symbolSource === undefined) return
    let active = true
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setPreviewing(true)
      try {
        const response = await fetch(`/__symbols/${kind}/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            draft: symbolSource,
            glyphDraft: glyphSource,
          }),
          signal: controller.signal,
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        const module = (await import(/* @vite-ignore */ data.url)) as Entry
        if (typeof module.Symbol !== "function" || !module.metadata?.pins)
          throw new Error("Preview needs named Symbol and metadata exports")
        if (!active) return
        setPreviews((all) => ({
          ...all,
          [kind]: { source: previewCode, entry: module },
        }))
        setFailures((all) => ({ ...all, [kind]: undefined }))
      } catch (error) {
        if (active && !controller.signal.aborted)
          setFailures((all) => ({
            ...all,
            [kind]: {
              source: previewCode,
              message: String(error instanceof Error ? error.message : error),
            },
          }))
      } finally {
        if (active) setPreviewing(false)
      }
    }, 350)
    return () => {
      active = false
      controller.abort()
      clearTimeout(timer)
    }
  }, [kind, symbolSource, glyphSource, previewCode])
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty && !saveInFlight.current) event.preventDefault()
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])
  function select(next: string) {
    if (busy) return
    setKind(next)
    setLedHovered(false)
    setSourceTab("symbol")
    setRotation(0)
    setMirror(false)
    setCurrent(0)
    setParameters({
      ...library.find((e) => e.kind === next)!.metadata.parameters,
    })
    setPreviewing(false)
  }
  async function save() {
    if (!workspace || busy || error || !previewMatches) return
    const sent = workspace.draft
    saveInFlight.current = true
    setBusy(true)
    setStatus("Saving source and regenerating pin catalog…")
    try {
      const response = await fetch(`/__symbols/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: workspace.source, draft: sent }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setWorkspaces((all) => ({
        ...all,
        [resource]: { ...all[resource], source: data.source },
      }))
      setStatus(
        `Saved ${resource === "waveformGlyphs" ? "shared waveforms.tsx" : kind + ".tsx"} and regenerated pin catalog`
      )
    } catch (error) {
      setStatus(String(error))
    } finally {
      saveInFlight.current = false
      setBusy(false)
    }
  }
  async function reload() {
    if (
      currentDirty &&
      !window.confirm("Discard this symbol’s unsaved edits and reload source?")
    )
      return
    try {
      const response = await fetch(`/__symbols/${resource}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setWorkspaces((all) => ({
        ...all,
        [resource]: { source: data.source, draft: data.source },
      }))
      setStatus("Source reloaded")
    } catch (error) {
      setStatus(String(error))
    }
  }
  const previewStatus = error
    ? "Preview error"
    : previewing || !previewMatches
      ? "Updating preview…"
      : "Live preview"
  return (
    <div
      className="symbol-workbench"
      onKeyDown={(event) => {
        if (
          (event.metaKey || event.ctrlKey) &&
          event.key.toLowerCase() === "s"
        ) {
          event.preventDefault()
          void save()
        }
      }}
    >
      <header>
        <div className="brand">
          w<span>↗</span>
        </div>
        <div>
          <strong>Symbol workbench</strong>
          <small>WIRES / DEVELOPMENT</small>
        </div>
        <div className="header-note">Source + live preview</div>
        <Button variant="ghost" render={<a href="/editor" />}>
          Circuit editor
        </Button>
        <Button
          className="save-symbol"
          disabled={!currentDirty || busy || !!error || !previewMatches}
          onClick={() => void save()}
        >
          {busy
            ? "Saving…"
            : currentDirty
              ? resource === "waveformGlyphs"
                ? "Save shared glyphs"
                : "Save symbol"
              : "Saved"}
        </Button>
      </header>
      <aside className="library">
        <div className="section-label">
          LIBRARY <span>{library.length}</span>
        </div>
        <Input
          className="search"
          aria-label="Search symbols"
          placeholder="Find a symbol…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <nav>
          {groups.map((group) => {
            const entries = group.kinds
              .map((kind) => library.find((e) => e.kind === kind)!)
              .filter((e) =>
                `${group.label} ${e.metadata.name} ${e.kind}`
                  .toLowerCase()
                  .includes(query.trim().toLowerCase())
              )
            if (!entries.length) return null
            return (
              <section
                className="library-group"
                key={group.label}
                aria-label={group.label}
              >
                <h2>{group.label}</h2>
                {entries.map((e) => (
                  <Button
                    variant="outline"
                    disabled={busy}
                    className={`symbol-row ${kind === e.kind ? "active" : ""}`}
                    key={e.kind}
                    onClick={() => select(e.kind)}
                  >
                    <svg viewBox="-200 -200 400 400">
                      <PreviewBoundary key={previews[e.kind]?.source ?? e.kind}>
                        <Artwork
                          entry={previews[e.kind]?.entry ?? e}
                          glow={ledGlow}
                        />
                      </PreviewBoundary>
                    </svg>
                    <span>{e.metadata.name}</span>
                    {workspaces[e.kind] &&
                      workspaces[e.kind].draft !==
                        workspaces[e.kind].source && <i>EDITED</i>}
                  </Button>
                ))}
              </section>
            )
          })}
        </nav>
        <div className="library-footer">
          All symbols · Full TSX source
          <br />
          Drafts stay while you browse.
        </div>
      </aside>
      <main>
        <div className="canvas-heading">
          <div>
            <div className="section-label">LIVE PREVIEW</div>
            <h1>
              {entry.metadata.name}
              {currentDirty && <span className="unsaved">Unsaved</span>}
            </h1>
          </div>
          <div className="toolbar">
            <Button
              variant="outline"
              onClick={() => setRotation((r) => (r + 90) % 360)}
            >
              Rotate {rotation}°
            </Button>
            <Button
              variant="outline"
              aria-pressed={mirror}
              onClick={() => setMirror((v) => !v)}
            >
              Mirror
            </Button>
          </div>
        </div>
        <div
          className={`canvas coordinate-canvas ${viewport.panning ? "is-panning" : viewport.panTool ? "pan-tool" : ""}`}
        >
          <svg
            ref={svg}
            tabIndex={0}
            {...viewport.events}
            aria-label={`${entry.metadata.name} live preview`}
            onPointerMove={(event) => {
              viewport.events.onPointerMove(event)
              const bounds = event.currentTarget.getBoundingClientRect()
              setCursor({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
              })
            }}
            onPointerLeave={() => {
              viewport.events.onPointerLeave()
              setCursor(null)
            }}
            onClick={async (event) => {
              if (
                viewport.consumePanClick() ||
                viewport.panTool ||
                event.button !== 0
              )
                return
              const matrix = event.currentTarget.getScreenCTM()
              if (!matrix) return
              const point = new DOMPoint(
                event.clientX,
                event.clientY
              ).matrixTransform(matrix.inverse())
              const bounds = event.currentTarget.getBoundingClientRect()
              setCursor({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
              })
              const snapped = snapPreviewPoint(
                point.x,
                point.y,
                rotation,
                mirror,
                entry.metadata.drawingScale ?? 1,
                snapStep
              )
              const local = sourceCoordinates(
                snapped.x,
                snapped.y,
                rotation,
                mirror,
                entry.metadata.drawingScale ?? 1
              )
              const text = formatCoordinates(local.x, local.y)
              try {
                await navigator.clipboard.writeText(text)
                setStatus(`Copied ${text} — paste into SVG path data`)
              } catch {
                setStatus(`Could not access clipboard. Coordinates: ${text}`)
              }
            }}
            viewBox={viewport.viewBox}
          >
            <defs>
              <pattern
                id="grid"
                width={gridSpacing}
                height={gridSpacing}
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="0"
                  cy="0"
                  r={Math.min(1.7 / zoom, gridSpacing / 6)}
                  fill="var(--border)"
                />
              </pattern>
            </defs>
            {grid && (
              <rect
                x={viewport.left}
                y={viewport.top}
                width={canvasSize.width / zoom}
                height={canvasSize.height / zoom}
                fill="url(#grid)"
              />
            )}
            <path
              d="M-10000 0H10000M0-10000V10000"
              stroke="var(--border)"
              strokeWidth={1 / zoom}
            />
            <g
              ref={artwork}
              onPointerEnter={() => {
                if (kind === "led") setLedHovered(true)
              }}
              onPointerLeave={() => setLedHovered(false)}
            >
              <PreviewBoundary
                key={`${kind}:${previews[kind]?.source ?? ""}:${JSON.stringify(parameters)}:${current}`}
                onError={(message) =>
                  setFailures((all) => ({
                    ...all,
                    [kind]: {
                      source: previews[kind]?.source ?? previewCode,
                      message,
                    },
                  }))
                }
              >
                <Artwork
                  entry={entry}
                  rotation={rotation}
                  mirror={mirror}
                  parameters={parameters}
                  current={current}
                  highlighted={ledHovered}
                  glow={ledGlow}
                />
                {pins && (
                  <PinMarkers
                    entry={entry}
                    parameters={parameters}
                    rotation={rotation}
                    mirror={mirror}
                    zoom={zoom}
                  />
                )}
              </PreviewBoundary>
            </g>
            {cursor && (
              <g
                className="preview-crosshairs"
                pointerEvents="none"
                stroke="var(--muted-foreground)"
                strokeWidth={1 / zoom}
                strokeDasharray={`${4 / zoom} ${4 / zoom}`}
              >
                <line
                  x1={viewport.left}
                  y1={cursor.y}
                  x2={viewport.left + canvasSize.width / zoom}
                  y2={cursor.y}
                />
                <line
                  x1={cursor.x}
                  y1={viewport.top}
                  x2={cursor.x}
                  y2={viewport.top + canvasSize.height / zoom}
                />
              </g>
            )}
          </svg>
          {coordinate && cursor && (
            <div className="coordinate-readout">
              <strong>SVG</strong> X {Math.round(coordinate.x)} · Y{" "}
              {Math.round(coordinate.y)}
              {(entry.metadata.drawingScale ?? 1) !== 1 && (
                <small>
                  Sheet X {number(cursor.x)} · Y {number(cursor.y)}
                </small>
              )}
            </div>
          )}
          <div className="canvas-caption">
            {previewStatus}
            {error ? " · Check the source panel" : " · Click to copy X Y"}
          </div>
          <div className="zoom">
            <Button
              variant="ghost"
              aria-label="Fit symbol"
              onClick={viewport.fit}
            >
              Fit
            </Button>
            <Button
              variant="ghost"
              aria-label="Pan preview"
              aria-pressed={viewport.panTool}
              onClick={() => viewport.setPanTool((value) => !value)}
            >
              Pan
            </Button>
            <Button
              variant="outline"
              aria-label="Zoom out"
              onClick={() => viewport.zoom(1 / 1.2)}
            >
              −
            </Button>
            <span>{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              aria-label="Zoom in"
              onClick={() => viewport.zoom(1.2)}
            >
              +
            </Button>
          </div>
        </div>
        <div className="viewport-help">
          Scroll to pan · Ctrl/⌘ scroll to zoom · Space/middle-drag to pan · + /
          − / 0
        </div>
        <div className="preview-controls">
          {hasWaveform && (
            <label>
              Waveform
              <NativeSelect
                aria-label="Preview waveform"
                value={String(waveform?.kind ?? "dc")}
                onChange={(event) =>
                  setParameters((previous) => ({
                    ...previous,
                    waveform: previewWaveform(
                      event.target.value as WaveformKind,
                      waveform
                    ),
                  }))
                }
              >
                {waveformChoices.map(([value, label]) => (
                  <NativeSelectOption key={value} value={value}>
                    {label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>
          )}
          <label title="Snap spacing in SVG source units">
            Snap
            <Input
              className="snap-step"
              aria-label="Snap grid spacing"
              type="number"
              min="1"
              max="1000"
              step="1"
              list="snap-presets"
              key={snapStep}
              defaultValue={snapStep}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur()
              }}
              onBlur={(event) => {
                const step = Number(event.currentTarget.value)
                if (Number.isInteger(step) && step >= 1 && step <= 1000)
                  setSnapStep(step)
                else event.currentTarget.value = String(snapStep)
              }}
            />
            <datalist id="snap-presets">
              {[1, 5, 10, 25, 50].map((value) => (
                <option key={value} value={value} />
              ))}
            </datalist>
          </label>
          <label>
            <Checkbox checked={grid} onCheckedChange={setGrid} /> Grid
          </label>
          <label>
            <Checkbox checked={pins} onCheckedChange={setPins} /> Pins
          </label>
          {kind === "led" && (
            <LedGlowControl value={ledGlow} onChange={setLedGlow} />
          )}
          <details>
            <summary>Preview parameters</summary>
            <div className="parameter-fields">
              {hasWaveform &&
                Object.entries(
                  previewWaveform(
                    (waveform?.kind ?? "dc") as WaveformKind,
                    waveform
                  )
                )
                  .filter(([, value]) => typeof value === "number")
                  .map(([field, value]) => (
                    <label key={`waveform-${field}`}>
                      {(
                        {
                          voltage: "DC voltage (V)",
                          amplitude: "Amplitude (V)",
                          frequency: "Frequency (Hz)",
                          offset: "DC offset (V)",
                          phase: "Phase (rad)",
                          dutyCycle: "Duty cycle",
                        } as Record<string, string>
                      )[field] ?? field}
                      <Input
                        aria-label={`Preview waveform ${field}`}
                        type="number"
                        step="any"
                        value={String(value)}
                        onChange={(event) => {
                          const value = Number(event.target.value)
                          if (Number.isFinite(value))
                            setParameters((previous) => ({
                              ...previous,
                              waveform: {
                                ...previewWaveform(
                                  (waveform?.kind ?? "dc") as WaveformKind,
                                  waveform
                                ),
                                [field]: value,
                              },
                            }))
                        }}
                      />
                    </label>
                  ))}
              {Object.entries(entry.metadata.parameters ?? {})
                .filter(([, v]) =>
                  ["boolean", "number", "string"].includes(typeof v)
                )
                .map(([key, value]) => (
                  <label key={key}>
                    {key}
                    {key === "bitCount" && bitDisplays.has(entry.kind) ? (
                      <NativeSelect
                        value={String(parameters[key] ?? value)}
                        onChange={(event) =>
                          setParameters((p) => ({
                            ...p,
                            [key]: Number(event.target.value),
                          }))
                        }
                      >
                        {Array.from({ length: 16 }, (_, index) => index + 1).map((bits) => (
                          <NativeSelectOption key={bits} value={String(bits)}>
                            {bits}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    ) : typeof value === "boolean" ? (
                      <Checkbox
                        checked={Boolean(parameters[key] ?? value)}
                        onCheckedChange={(checked) =>
                          setParameters((p) => ({ ...p, [key]: checked }))
                        }
                      />
                    ) : (
                      <Input
                        type={typeof value === "number" ? "number" : "text"}
                        value={String(parameters[key] ?? value)}
                        onChange={(e) =>
                          setParameters((p) => ({
                            ...p,
                            [key]:
                              typeof value === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                          }))
                        }
                      />
                    )}
                  </label>
                ))}
              <label>
                Current (A)
                <Input
                  type="number"
                  value={current}
                  step="0.01"
                  onChange={(e) => setCurrent(Number(e.target.value))}
                />
              </label>
            </div>
          </details>
        </div>
      </main>
      <section className="source-pane">
        <div className="source-heading">
          <div>
            <div className="section-label">SOURCE · TSX</div>
            <code>
              {resource === "waveformGlyphs"
                ? "waveforms.tsx (shared)"
                : `src/${kind}.tsx`}
            </code>
          </div>
          <Button
            variant="outline"
            disabled={!workspace || busy}
            onClick={() => void reload()}
          >
            Reload
          </Button>
        </div>
        {usesGlyphs && (
          <div className="source-tabs" role="group" aria-label="Source to edit">
            <Button
              variant={sourceTab === "symbol" ? "secondary" : "ghost"}
              disabled={busy}
              onClick={() => setSourceTab("symbol")}
            >
              Symbol
            </Button>
            <Button
              variant={sourceTab === "glyphs" ? "secondary" : "ghost"}
              disabled={busy}
              onClick={() => setSourceTab("glyphs")}
            >
              Shared waveform glyphs
            </Button>
          </div>
        )}
        <p className="source-guidance">
          {resource === "waveformGlyphs" ? (
            "Edit waveform paths or DC polarity artwork. These glyphs are shared by voltage sources; select a waveform in the preview controls."
          ) : (
            <>
              Paste JSX shapes inside <code>Symbol()</code>. Keep the existing
              leads and metadata.
            </>
          )}
        </p>
        {workspace ? (
          <CodeEditor
            key={resource}
            source={workspace.draft}
            disabled={busy}
            onChange={(draft) =>
              setWorkspaces((all) => ({
                ...all,
                [resource]: { ...all[resource], draft },
              }))
            }
          />
        ) : (
          <p className="hint">Loading source…</p>
        )}
        <div
          className={`source-feedback ${error ? "has-error" : ""}`}
          role="status"
        >
          {error ? (
            <pre>{error}</pre>
          ) : (
            <span>{previewStatus} · Drafts preview without writing files.</span>
          )}
        </div>
        <div className="source-actions">
          <span>Tab: indent · Ctrl/⌘ S: save</span>
          <Button
            variant="outline"
            disabled={!currentDirty || busy}
            onClick={() => {
              if (workspace)
                setWorkspaces((all) => ({
                  ...all,
                  [resource]: { ...workspace, draft: workspace.source },
                }))
            }}
          >
            Reset to saved
          </Button>
        </div>
      </section>
      <footer role="status">
        <span className={dirty ? "status-dot dirty" : "status-dot"} />
        {status}
        <span className="footer-right">DEVELOPMENT ONLY</span>
      </footer>
    </div>
  )
}
