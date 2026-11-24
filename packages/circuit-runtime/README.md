# Circuit runtime

Classic dedicated-worker entry points for the retained CircuitJS engine. No editor
DOM, rendering or prototype compatibility adapters are required.

- `revision-worker.js`: React's revision-aware document/session worker.
- `document-worker.js`: direct document-session worker used by engine verification.
- `worker.js`: direct low-level engine worker used by engine verification.

The revision worker loads `core/catalog.js`, `core/adapter.js`, `core/protocol.js`
and `circuitjsworker/engine-worker.js` relative to its own URL. The core modules
register their APIs in `CircuitCoreModules`; the worker calls them directly.

`apps/simulator/scripts/engine-assets.ts` serves these dependencies at `/engine/` during
development and packages the revision worker, core and compiled engine for
production. `makeEngineSite` assembles all three entry points plus the independent
verification harness from `tools/engine-harness`. Both it and the cached build
fallback remove stale assets from the assembled engine site.

Build from the root with `pnpm engine:build`. The
[engine guide](../../engine/README.md) documents the cached build fallback.
See [worker protocol](../../docs/new-simulator/WORKER-PROTOCOL.md) for session
identity and message handling.
