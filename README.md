# wires

A browser-based circuit editor and simulator powered by CircuitJS/Falstad.
Build circuits on an SVG sheet, run simulations in a dedicated Web Worker, and
inspect signals with probes and an oscilloscope. The interface uses React and
TypeScript; simulation runs locally in your browser.

## Development

Requirements: Java 8, Python 3.9+, Node 24+ and pnpm 10.30.3.

```sh
git submodule update --init engine/upstream
pnpm deps:install
pnpm engine:build
pnpm dev
```

Open the URL printed by Vite. `/editor.html` provides an example preview with
autosave disabled.

## Build and check

```sh
pnpm build
pnpm check
```

`pnpm build` compiles the engine and creates the complete static site in
`apps/simulator/dist`, including the simulation worker and its dependencies.
`pnpm check` runs computational regression suites, the React production build,
server-rendering and packaged-worker checks, and saved engine reference replays.
`pnpm verify` rebuilds the engine before running those checks. Browser interaction
checks are separate.

For frontend-only changes with an already compiled engine, use
`pnpm --dir apps/simulator build`.

## Deploy to Cloudflare Pages

Build locally and commit `apps/simulator/dist` alongside the source. This directory
is intentionally tracked so Cloudflare can publish the site without compiling it.
After each release build, include new assets and removed old assets in the commit:

```sh
pnpm build
git add -A apps/simulator/dist
```

Commit the source and built files, then push to the connected GitHub repository.
Configure the Pages project as follows:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Root directory | Repository root (leave blank) |
| Build command | `exit 0` |
| Build output directory | `apps/simulator/dist` |
| Environment variable | `SKIP_DEPENDENCY_INSTALL=true` |

See Cloudflare's [static site deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
and [dependency installation settings](https://developers.cloudflare.com/pages/configuration/build-image/#skip-dependency-install).
Source changes reach the live site when the updated build is committed and pushed.

## Repository layout

| Path | Purpose |
| --- | --- |
| `apps/simulator` | React editor, UI, SVG sheet and Vite entries |
| `packages/circuit-core` | Circuit documents, connectivity, history and simulation coordination |
| `packages/circuit-symbols` | Component symbols and metadata |
| `packages/circuit-runtime` | Simulation worker entry points |
| `engine/upstream` | Pinned CircuitJS source submodule |
| `engine/patches` | Engine patches |
| `engine/integration` | Engine bridge, model integration and worker linker |
| `tools` | Builds, generators, computational tests and development harness |
| `docs` | Design contracts, examples and development notes |

See [engine maintenance](engine/README.md) for engine builds and patch updates,
and the [editor contract](docs/new-simulator/EDITOR-CONTRACT.md) for editor behavior.

## Acknowledgements and license

CircuitJS was created by Paul Falstad and Iain Sharp, with contributions from the
CircuitJS community. Wires uses a pinned version of
[pfalstad/circuitjs1](https://github.com/pfalstad/circuitjs1).
See [LICENSE](LICENSE) and the source headers for license and copyright notices.
