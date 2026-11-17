# wires

A React circuit editor and simulator backed by the CircuitJS/Falstad electrical
engine. This is an independent repository; the LV Labs Falstad reskin and its
existing short-link deployment remain in the original `circuitjs` repository.

## Layout

| Path | Purpose |
| --- | --- |
| `apps/simulator` | React/TypeScript editor, UI, SVG sheet and Vite entries |
| `packages/circuit-core` | Documents, connectivity, history, compilation and simulation coordination |
| `packages/circuit-symbols` | Authored component symbols and metadata |
| `packages/circuit-runtime` | Worker entry points |
| `engine/upstream` | Pristine CircuitJS/Falstad submodule at a pinned revision |
| `engine/patches` | Our isolated upstream adjustments |
| `engine/integration` | Engine bridge, model integration and worker linker |
| `tools` | Builds, generators, computational tests and development harness |
| `docs` | Contracts, plans, examples and migration provenance |

## Run

Requirements: Java 8, Python 3.9+, Node 24+ and pnpm 10.30.3. The Gradle 8.7
wrapper and build configuration live under `engine/`. From a fresh clone:

```sh
git submodule update --init engine/upstream
pnpm deps:install
pnpm engine:build
pnpm dev
```

`pnpm build` builds the engine and production app in `apps/simulator/dist`.
`pnpm check` runs computational tests, React build/SSR/packaged-worker checks, and
39,067 saved reference engine API calls. `pnpm verify` rebuilds the engine first.
Browser interaction checks are separate and are not run automatically.

Use `pnpm --dir apps/simulator build` for a frontend-only build with an existing
compiled worker. See [engine maintenance](engine/README.md) for patch/pin updates
and the cached build fallback. [The current handoff](docs/new-simulator/HANDOFF.md)
records known failures and remaining compatibility work.

## Origin and license

Migrated from [lv-labs/circuitjs](https://github.com/lv-labs/circuitjs), including
uncommitted editor and engine work. The [migration record](docs/migration/README.md)
and input-file hashes retain provenance. The prior fork history remains there;
this repository starts with a standalone migration snapshot.

CircuitJS was created by Paul Falstad and Iain Sharp, with contributions from the
CircuitJS community. The pinned dependency is
[pfalstad/circuitjs1](https://github.com/pfalstad/circuitjs1).
Existing copyright and license notices are preserved. See [LICENSE](LICENSE)
and the source headers. This repository contains no production deployment workflow
and has no remote configured at migration time.
