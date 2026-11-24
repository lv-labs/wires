# Editor and worker protocol

The editor submits the canonical electrical projection from
[the circuit core](../../packages/circuit-core/README.md). The worker compiles the
projection to CircuitJS records and maps results back to stable component and pin
IDs. Layout, wire routes, selection and labels stay in the document/editor.

- `packages/circuit-core/simulation.js` owns the coordinator, accepted revisions,
  worker replacement, Run/Pause scheduling and result gating.
- `packages/circuit-core/protocol.js` validates the request envelope and dispatches
  operations through the adapter. `browser-transport.js` owns request timeouts.
- `packages/circuit-runtime/revision-worker.js` is the app entry point. The
  [verification harness](../../tools/engine-harness/README.md) also exercises
  the direct document and engine entry points.

## Identity and requests

The first `initialize` request establishes `protocolVersion: 1`, a fresh
`sessionId`, and capabilities. Requests carry monotonically increasing positive
`requestId` values. Later requests also carry an exact `base` of
`{documentId, circuitRevision, runEpoch}`. Operations that change circuit/run
identity carry a `target` with the same fields. The worker rejects stale bases
and duplicate requests before mutating the engine.

| Operation | Effect |
| --- | --- |
| `installCircuit` | Load a canonical electrical projection into a fresh worker and adopt its target identity. |
| `step` | Advance a bounded step count and optionally sample channels at each completed step. |
| `updateCircuit` | Apply a supported electrical edit and advance the circuit revision while preserving the run epoch. |
| `setSwitch`, `setContact`, `setVariableVoltage`, `setSourceFrequency` | Apply a negotiated live update and advance the revision while preserving the run epoch. |
| `snapshot`, `readCapture` | Read the last completed frame or a component capture. |
| `reset` | Restore initial state and advance the run epoch at the same circuit revision. |
| `dispose` | End the session. |

Replies echo protocol, session and request IDs and include the accepted `state`.
Success includes `result`. Failure includes a code, message and disposition.
An engine failure faults the session. Recovery creates a new worker instead of
automatically retrying a mutation with uncertain outcome.

## Scheduling and results

Layout-only edits keep the electrical revision and solver state. The coordinator
serializes bounded steps and live updates. A worker that cannot apply a
state-preserving change can be replaced with a freshly installed candidate.
Only results for the active worker, accepted circuit/run and current result
sequence may update the editor. Pause/resume retains the run epoch. Saved JSON
does not store worker sessions, revisions or epochs.

Frames carry time, timestep, sequence, pin voltages, available component
currents/measurements and diagnostics. Optional terminal currents map to public
pin IDs and support wire-current presentation. Scope acquisition requests up to
32 signed voltage/current channels. Step results contain aligned samples keyed
by channel ID. The renderer can change its display rate without changing the
simulation's sampling cadence.

See `tools/test_simulation_coordinator.mjs`, `tools/test_running_edits.mjs`,
`tools/test_live_reanalysis.mjs`, and `tools/test_scope_sampling.mjs` for
executable request and result examples.
