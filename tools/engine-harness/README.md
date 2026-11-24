# Engine verification harness

Development-only engine demos, reference traces and browser verification scripts.
The harness is assembled into the engine verification site. The React app
lives in `apps/simulator/` and the pinned Falstad reference lives in
`engine/upstream/`.

Node regression tests import `packages/circuit-core/index.mjs` directly. The three
small `document-adapter`, `simulation-coordinator` and `revision-client` browser
adapters remain for the HTML demos/verification page. They contain no old editor
implementation. React tests cover symbol orientation, capture exports and slider properties.

`pnpm engine:build` (or `tools/build_engine_cached.py`) assembles these files,
`packages/circuit-runtime`, core and compiled GWT assets in `build/engine-site`.
Run `python3 tools/verify_engine.py` for browser engine checks.
