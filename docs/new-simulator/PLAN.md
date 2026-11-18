# New circuit simulator: current plan

Updated 2026-11-17. Read [HANDOFF.md](HANDOFF.md) for build/check status and
[EDITOR-CONTRACT.md](EDITOR-CONTRACT.md) for accepted interaction requirements.
Previous milestones and the complete pre-cleanup plan are in
[PLAN-HISTORY.md](PLAN-HISTORY.md); historical instructions there are superseded.

## Direction

Complete Falstad functionality in the React/TypeScript app (`apps/simulator/`), retaining
CircuitJS electrical models and solver algorithms. Use shadcn Base Mira for the
shell and SVG for the sheet. Preserve the accepted interface, stable document
identities, explicit connectivity and authored per-symbol TSX metadata/views.
The JavaScript editor prototype is retired. Original Falstad is available through `engine/upstream` as a development reference.
The LV Labs reskin remains deployed separately from its original repository.

## Current state

| Area | Implemented | Remaining |
| --- | --- | --- |
| Engine | Editor-free Java/GWT worker, bounded stepping, stable-ID results, state-preserving live edits | Complete model/variant coverage and larger-circuit/platform verification |
| Editor | React menus, properties, file/history/clipboard actions, connected dragging, detached transforms, explicit wiring | Remaining native Falstad behavior and browser verification |
| Library | 84 authored models, including 3 graphics; generated core metadata | Unsupported components and variants; see catalog/property audits |
| Inspection | Per-step voltage/current sampling, meters, captures, saved mixed dock/floating/sheet scopes | Frequency/period, triggering/FFT, interactive verification |
| Documents | Schema v1, explicit graph, JSON save/open/autosave, scope workspace persistence | Broader Falstad import coverage, bundled-example chooser, migration policy |
| Maintenance | React runtime separated from verification harness; direct core test imports; current tests and build commands | Future upstream update automation |

## Next work

1. **Maintain the adopted upstream boundary.** `engine/upstream` pins pristine
   upstream; `engine/patches` and `engine/integration` own our isolated changes.
   Normal Gradle and cached builds prepare a disposable patched source tree and
   use a separate engine source set. See [engine maintenance](../../engine/README.md)
   for pin updates and integration-gap review. The app now lives in the standalone `wires` repository.
2. **Expand measured compatibility.** Use [LEGACY-CATALOG.md](LEGACY-CATALOG.md),
   [PROPERTY-PARITY.md](PROPERTY-PARITY.md) and [REACT-PARITY.md](REACT-PARITY.md).
   Track component/property coverage, numerical behavior and import fidelity
   separately. Preserve current UX and original equations.
3. **Expand explicit legacy import.** The text/XML subset converts 67 bundled
   circuits (64 compile), including all ten Basics examples; see [FALSTAD-IMPORT.md](FALSTAD-IMPORT.md). Continue to translate coordinate connectivity, flags, definitions/subcircuits,
   models and scopes into the explicit document graph. Diagnose unsupported
   records instead of dropping content. Type coverage alone is not import success.
4. **Automate upstream proposals.** Compile/test pinned revision updates and
   report added or changed model integration gaps. New Java components still need
   document/property mappings, authored symbols and verification.

## Maintenance checkpoint

- Workers: `packages/circuit-runtime`; shared computation: `packages/circuit-core`.
- Menus: `apps/simulator/src/editor/menu`; symbols: `packages/circuit-symbols`.
- Engine demos/reference traces: `tools/engine-harness`; no React dependency.
- Node tests import the public core directly; symbol/export/slider-property checks
  exercise active React modules. Prototype-only helpers and adapters are removed.
- Root `pnpm` commands cover dependency installation, engine/React builds and
  checks. React CI was removed in `a9c07a42`; original deployment stays in the former repository.
- Full previous plan/handoff snapshots are archived; keep these entry points short
  and record current findings rather than accumulating superseded instructions.

## Guardrails and deferred decisions

Preserve local changes. Keep solver changes separate from structural cleanup and
frontend work. Keep generated symbol metadata fresh; pin identities and native
engine post order are distinct. Scope display must not change sampling cadence.
Save/open and undo must preserve the explicit graph and saved workspace.

No renderer rewrite, Rust/GPUI migration or solver rewrite is planned. Desktop
packaging (Tauri/Electron/platforms) and schema migration policy remain undecided.
The engine uses a submodule; the application stays in this repository. Custom
simulation-time control events/ramps, analysis tools and
automation APIs follow native Falstad compatibility; existing manual property
sliders remain supported. Do not launch browser verification unless requested.
