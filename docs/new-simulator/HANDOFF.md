# wires: current handoff

Updated 2026-11-17. This is the new standalone local repository, migrated from the
LV Labs CircuitJS fork. Read the root README, engine/README and EDITOR-CONTRACT.md.
Older handoffs/design reports describe previous layouts and are historical context.

## Layout and build

- `apps/simulator`: active React editor and `/editor.html` fixture preview.
- `packages/circuit-core`, `circuit-symbols`, `circuit-runtime`: shared computation,
  authored symbols and worker entry points.
- `engine/upstream`: pristine pinned Falstad source; `engine/patches` and
  `engine/integration`: our explicit patches and bridge sources.
- `tools`: builds, generators, computational tests, portable numerical references
  and development-only engine harness. React does not ship the harness.

Initialize the submodule, then use `pnpm deps:install`, `pnpm engine:build`,
`pnpm dev`, `pnpm build`, `pnpm check` and `pnpm verify`. Requirements: Java 8,
Python 3.9+, Node 24+, pnpm 10.30.3. The Gradle wrapper is included. The cached
fallback uses the same engine-source preparation as Gradle.

There is no legacy reskin/deployment source tree here. The original fork keeps
that app and its short-link/deployment configuration. This repo stays local with
no remote or deployment configured. See docs/migration for snapshot provenance.

## Contracts and validation limits

Preserve all migrated local React, symbol, core and engine work. Keep stable IDs,
explicit connectivity and exact history behavior. Accepted scope, slider, meter
and interaction requirements remain in EDITOR-CONTRACT.md. Do not restore the
retired JavaScript frontend. No browser verification unless requested; headless
checks do not certify pointer behavior. No subagents are needed.

The two existing computational failures concern the concurrent op-amp geometry
and pin-order edits (`test_component_menu` and `test_document_adapter`); migration
preserves those edits and assertions. See docs/migration/validation.json for the
actual migration checks. Do not describe the full test command as passing until
these failures are resolved intentionally.

## Next work

Resolve the op-amp contract with its ongoing author, then expand measured component,
property and import compatibility. No general Falstad text importer or bundled
library chooser exists. Bus/hierarchical objects and many variants are unsupported.
Frequency/period, triggering/FFT, large-scene/platform coverage and desktop packaging
remain open. Scope layout is saved in circuit JSON; property-slider configuration
is local per circuit. No browser or benchmark parity is claimed.

Use PLAN.md, REACT-PARITY.md, PROPERTY-PARITY.md, LEGACY-CATALOG.md,
DOCUMENT-ADAPTER.md, COORDINATOR.md and WORKER-PROTOCOL.md for contracts and gaps.
