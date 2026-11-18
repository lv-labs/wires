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
Python 3.9+, Node 24+, pnpm 10.30.3. The Gradle wrapper/configuration live under `engine/`; root pnpm commands are unchanged. The cached
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

The migrated op-amp geometry and pin-order failures are resolved. Engine post
order is explicitly `minus`, `plus`, `out`, independent of symbol metadata order.
The new artwork remains plus-on-top by default, with visible polarity marks; both
legacy menu variants place their advertised polarity. `pnpm check` passes all 35
computational suites, React build/SSR/packaged-worker checks (including an op-amp
amplifier), and 39,067 reference API calls. `test_opamp` covers finite gain,
inversion, follower, saturation, current sign, reset and all orientations.
`docs/migration/validation.json` records the earlier migration-time results.

## Next work

Expand measured component, property and import compatibility. A strict first-subset Falstad text importer now exists; see
[FALSTAD-IMPORT.md](FALSTAD-IMPORT.md). A bundled library chooser does not yet exist. Bus/hierarchical objects and many variants are unsupported.
Frequency/period, triggering/FFT, large-scene/platform coverage and desktop packaging
remain open. Scope layout is saved in circuit JSON; property-slider configuration
is local per circuit. No browser or benchmark parity is claimed.

Use PLAN.md, REACT-PARITY.md, PROPERTY-PARITY.md, LEGACY-CATALOG.md,
DOCUMENT-ADAPTER.md, COORDINATOR.md and WORKER-PROTOCOL.md for contracts and gaps.


## Gradle layout — 2026-11-17

The build, wrappers, wrapper files, settings and Gradle cache now live under
`engine/`. Root `pnpm engine:build` delegates there. Generated assets remain under
root `build/`, so frontend and worker consumers retain their paths. Engine build,
React build/SSR/packaged-worker checks and all 39,067 reference API calls pass after
the move. The migration-time op-amp failures were subsequently resolved as described above.
