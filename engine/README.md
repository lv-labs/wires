# Engine dependency

`wires` builds its electrical engine from:

- `upstream/`: pristine pfalstad/circuitjs1 Git submodule.
- `patches/`: ordered compatibility, headless and correctness patches.
- `integration/`: application-owned bridge classes, GWT modules and worker linker.

The revision in `upstream.json` must match the submodule gitlink and checkout.
The build refuses a dirty or mismatched dependency. It exports upstream to
`build/engine-source`, checks/applies patches there, and compiles those sources
with `integration`. It never patches the submodule in place.

```sh
git submodule update --init engine/upstream
pnpm engine:build
```

Java 8, Python 3.9+ and Gradle 8.7 are required. If Gradle is unavailable but GWT
2.8.2 jars are cached locally:

```sh
JAVA_TOOL_OPTIONS=-Dgwt.jjs.permutationWorkerFactory=com.google.gwt.dev.ThreadedPermutationWorkerFactory \
  python3 tools/build_engine_cached.py --java-home /path/to/jdk8
```

This repository has no customized legacy Java UI source tree. The full original
Falstad app is available inside the submodule as a reference. The separate LV Labs
reskin and its deployment stay in the old repository.

## Updating upstream

1. Fetch and inspect the desired revision in `engine/upstream`.
2. Check it out detached and update `engine/upstream.json`. Commit both pins together.
3. Run `python3 tools/prepare_engine.py`. Rebase failing patches explicitly; keep
   compatibility choices separate from headless hooks and correctness fixes.
4. Build the engine, run `pnpm check`, and inspect model/property integration gaps.
   New Java components still need bridge, document, property and symbol support.
5. Review any numerical differences from the saved engine reference. Update
   fixtures only for explained intentional behavior. Import fidelity is separate.

`build/engine-source/engine-manifest.json` records the pin and patch hashes.
No automatic upstream update, publishing or deployment is configured.
