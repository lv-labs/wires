import { useCallback, useEffect, useRef, useState } from "react"
import { core } from "./core"
import type { CircuitDocument, Command, Run, RunState } from "./core"
import { defaultSimulationSpeed, simulationPacing } from "./simulationSpeed"
import { splitLegacyProbes } from "./voltageProbes"

import { startWorkspace, rememberDraft, writeEntry } from "./circuitWorkspace"

const editingOptions = { wireSections: true, componentReferences: false }

export function useCircuitSession(
  initialDocument = core.document.empty(),
  autosave = true
) {
  const [workspace, setWorkspace] = useState(() =>
    autosave
      ? startWorkspace(initialDocument)
      : {
          id: crypto.randomUUID(),
          document: initialDocument,
        }
  )
  const [document, setDocument] = useState(() => {
    try {
      return core.editing.create(
        splitLegacyProbes(core.document.validate(workspace.document)),
        () => {},
        editingOptions
      ).document
    } catch {
      return core.editing.create(
        splitLegacyProbes(initialDocument),
        () => {},
        editingOptions
      ).document
    }
  })
  const [session] = useState(() =>
    core.editing.create(document, setDocument, editingOptions)
  )
  const [simulation, setSimulation] = useState<RunState>({ status: "loading" })
  const [simulationSpeed, setSimulationSpeed] = useState(defaultSimulationSpeed)
  const [scope] = useState(() =>
    core.signals.create({ capacity: 20000, historySpan: 0.2 })
  )
  // React's development profiler can describe typed arrays without diffing
  // every sample when a full history reaches the scope components.
  const [scopeData, setScopeData] = useState(() =>
    scope.window(0.002, { typed: true })
  )
  const scopeSpan = useRef(0.2)
  const [error, setError] = useState("")
  const [savedLocally, setSavedLocally] = useState<boolean | null>(null)
  const run = useRef<Run | null>(null)
  useEffect(() => {
    let active = true
    let displayFrame: number | null = null
    let latestState: RunState | null = null
    let scopeDirty = false
    let previewReady = false
    let lastPreviewDisplay = -Infinity
    function display() {
      if (scopeDirty) {
        scopeDirty = false
        setScopeData(scope.window(scopeSpan.current, { typed: true }))
      }
      if (latestState) {
        setSimulation(latestState)
        latestState = null
      }
    }
    function scheduleDisplay() {
      if (!active || displayFrame !== null) return
      displayFrame = requestAnimationFrame((now) => {
        displayFrame = null
        if (!active) return
        // A preview has already presented the latest data for this display
        // interval. Keep acquiring samples and coalesce the next regular paint.
        if (latestState?.status === "running" && now - lastPreviewDisplay < 16)
          scheduleDisplay()
        else display()
      })
    }
    const coordinator = core.simulation.create({
      ...simulationPacing(defaultSimulationSpeed),
      autoBatchBudgetMs: 16,
      retainSampleBatches: false,
      workerFactory: core.browserTransport.factory({
        url: new URL(
          `${import.meta.env.BASE_URL}engine/revision-worker.js`,
          location.href
        ),
      }),
      onFrame: (frame, metadata) => {
        if (!active) return
        if (metadata?.preview) previewReady = true
        if (scope.append(frame)) scopeDirty = true
      },
      onState: (state) => {
        if (!active) return
        const samples = scope.count
        scope.followState(state)
        if (scope.count !== samples) scopeDirty = true
        // An automatic batch leaves the Running UI unchanged until it produces a frame.
        if (state.status === "stepping" && state.runRequested) return
        latestState = state
        if (previewReady) {
          previewReady = false
          if (displayFrame !== null) cancelAnimationFrame(displayFrame)
          displayFrame = null
          lastPreviewDisplay = performance.now()
          display()
        } else scheduleDisplay()
      },
    })
    run.current = coordinator
    return () => {
      active = false
      if (displayFrame !== null) cancelAnimationFrame(displayFrame)
      coordinator.dispose()
      run.current = null
    }
  }, [scope])
  useEffect(() => {
    const { batchSteps, intervalMs } = simulationPacing(simulationSpeed)
    run.current?.setRunPacing(batchSteps, intervalMs)
  }, [scope, simulationSpeed])
  useEffect(() => {
    let current = true
    const channels = core.geometry.scopeChannels(document).channels.slice(0, 32)
    scope.setChannels(channels)
    setScopeData(scope.window(scopeSpan.current, { typed: true }))
    const coordinator = run.current
    coordinator?.setSampleChannels(
      channels.map(({ id, kind, componentId, positive, negative, polarity }) =>
        kind === "current"
          ? { id, kind, componentId, ...(polarity !== undefined ? { polarity } : {}) }
          : { id, positive, negative }
      )
    )
    void coordinator
      ?.setDocument(document)
      .then((result) => {
        if (
          current &&
          result.activated &&
          coordinator.getState().status === "paused"
        )
          return coordinator.step(1)
      })
      .catch(() => {
        /* Coordinator publishes diagnostics. */
      })
    return () => {
      current = false
    }
  }, [document, scope])
  useEffect(() => {
    if (!autosave) return
    try {
      writeEntry("draft", {
        id: workspace.id,
        document,
        updated: Date.now(),
        revision: crypto.randomUUID(),
      })
      rememberDraft(workspace.id)
      setSavedLocally(true)
    } catch {
      setSavedLocally(false)
    }
  }, [autosave, document, workspace.id])
  const execute = useCallback(
    (command: Command) => {
      try {
        const result = session.execute(command)
        setError("")
        return result
      } catch (cause) {
        setError(String(cause))
      }
    },
    [session]
  )
  const setScopeTime = useCallback(
    (seconds: number) => {
      scopeSpan.current = seconds * 10
      scope.setHistorySpan(Math.max(0.2, scopeSpan.current))
      setScopeData(scope.window(scopeSpan.current, { typed: true }))
    },
    [scope]
  )
  const clearScope = useCallback(() => {
    scope.clear()
    setScopeData(scope.window(scopeSpan.current, { typed: true }))
  }, [scope])
  function openDocument(next: CircuitDocument) {
    const validated = splitLegacyProbes(core.document.validate(next))
    session.replace(validated)
    setWorkspace({ id: crypto.randomUUID(), document: validated })
  }
  return {
    openDocument,
    draftId: workspace.id,
    document,
    session,
    execute,
    simulation,
    simulationSpeed,
    setSimulationSpeed,
    run,
    error,
    savedLocally,
    scopeData,
    setScopeTime,
    clearScope,
  }
}
