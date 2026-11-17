# Upstream engine boundary audit

Audited 2026-11-17 against committed tip `a9c07a42659b53fc9459bf2f56876e60c604eafc`. The working tree was clean
before this audit. Local Git objects and source files only; no upstream fetch,
compilation, numerical checks or browser verification were performed. This is a
patch inventory and build-proof plan. The subsequent reconstruction proof below
passed; production source separation remains unimplemented.

## Baseline established

Use `0971995d9af13e95c5bd4eb07fb4527fb4696e26` as the first reconstruction baseline. It is the second
(upstream) parent of merge `45fe910348d8ec9200c0e7c230c49a1a631dc4ce`,
“Merge upstream pfalstad/circuitjs1 updates”. The local `upstream/master` ref
also points to this exact commit. This establishes the locally recorded upstream
baseline, not the latest upstream release or remote state.

The earlier audit used `c2cd5dc2574480bd3ce90bb98aa782c6956ea1d6` (LV Labs master),
which already contains reskin, packaging and electrical behavior changes. Keep
both comparisons: upstream → master explains older customizations; master →
current tip isolates new engine integration. The latter still contains 12 modified
existing Java files (+77/−20) and 12 additive integration/module/linker files
(1,081 lines). These additions are now tracked, unlike the earlier snapshot.

## Patch groups and disposition

1. **Additive integration:** nine `Engine*.java` client classes, the worker linker
   and two GWT modules. Keep under application ownership. Candidates for a separate
   source root, retaining the same Java package for package-private model access.
   `EngineCircuitUpdate` and support classes explicitly know component fields and
   lifecycle hooks: source separation will not eliminate that integration coupling.
2. **Required headless hooks:** split initialization in `CircuitElm`; null guards
   for app callbacks, widgets, menus, mouse and fonts; bounded stepping in
   `SimulationManager`. Keep as explicit engine patches. Bounded stepping uses the
   existing numerical loop, but changes its control flow and needs regression proof.
3. **Correctness fixes:** `AnalogSwitch2Elm.getMatrixConnection` declares both
   possible conducting throws; `LogicOutputElm.hasGroundConnection` declares the
   optional 1 MΩ pulldown. Separately extract the stop-after-`stepFinished` guard
   from `SimulationManager`. These should be independently reviewable from headless
   execution and potentially suitable for upstream proposals after verification.
4. **Older intentional behavior:** AC rail/source defaults change from
   `120*sqrt(2)` to 5 V. `PotElm` expands the slider range and stamps ideal endpoint
   shorts, including voltage-source/current/connectivity handling. Preserve these
   in the current app; retain them as a separate compatibility patch for initial
   reconstruction. Do not silently describe them as pristine upstream behavior.
   React currently limits pot controls to .001–.999, so exact endpoints need explicit
   fixtures before deciding whether the worker requires that older patch.
5. **Original-app presentation and packaging:** theme/font/colour, toolbar,
   scrollbar, menus, Electron/test-system removals, URL service and example changes.
   Preserve in the existing checkout/deployment. Exclude from the minimal engine
   reconstruction initially, then let compilation and behavior reveal any actual
   dependency. Do not assume all changes in these files are cosmetic.
6. **Build integration:** retain upstream build settings as the baseline; add an
   explicit engine Java source/classpath configuration, engine/worker GWT tasks and
   runtime assembly. `tools/build_engine_cached.py` is an application-owned fallback.
   Both current builds compile all Java under `src`; both must be taught the extra
   source root. GWT also needs the Java source root on its compiler classpath, not
   just compiled classes. Module resources must retain their package-relative paths.

Mixed files must be split by hunk: `CirSim` includes original-app removals/title
changes as well as headless callbacks; `SimulationManager` includes headless
analysis/stepping and stop safety; `PotElm` includes both older endpoint behavior
and new widget guards. Copying whole files would conceal these distinctions.

## Complete changed-source inventory

Counts are Git line counts against the pinned baseline, including formatting.
Categories identify ownership for extraction, not proof of runtime reachability.

| Source path | Added/removed | Classification |
| --- | --- | --- |
| `src/com/lushprojects/circuitjs1/client/ACRailElm.java` | +1/−1 | Older source defaults |
| `src/com/lushprojects/circuitjs1/client/ACVoltageElm.java` | +1/−1 | Older source defaults |
| `src/com/lushprojects/circuitjs1/client/AnalogSwitch2Elm.java` | +6/−0 | Electrical correctness |
| `src/com/lushprojects/circuitjs1/client/AudioOutputElm.java` | +1/−0 | Headless hooks |
| `src/com/lushprojects/circuitjs1/client/CirSim.java` | +12/−28 | Mixed: split by hunk (see below) |
| `src/com/lushprojects/circuitjs1/client/CircuitElm.java` | +7/−1 | Headless hooks |
| `src/com/lushprojects/circuitjs1/client/Color.java` | +23/−34 | Original-app presentation/interaction |
| `src/com/lushprojects/circuitjs1/client/CommandManager.java` | +1/−68 | Original-app packaging/service changes |
| `src/com/lushprojects/circuitjs1/client/Dialog.java` | +1/−1 | Original-app presentation/interaction |
| `src/com/lushprojects/circuitjs1/client/EngineCircuitUpdate.java` | +64/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/client/EngineDiodeSupport.java` | +47/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/client/EngineEntryPoint.java` | +464/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/client/EngineOutputSupport.java` | +112/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/client/EnginePassiveSupport.java` | +97/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/client/EngineSemiconductorSupport.java` | +64/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/client/EngineSourceSupport.java` | +107/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/client/EngineSwitchSupport.java` | +33/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/client/EngineTransistorSupport.java` | +38/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/client/ExportAsUrlDialog.java` | +21/−15 | Original-app packaging/service changes |
| `src/com/lushprojects/circuitjs1/client/Font.java` | +3/−3 | Original-app presentation/interaction |
| `src/com/lushprojects/circuitjs1/client/GateElm.java` | +1/−1 | Headless hooks |
| `src/com/lushprojects/circuitjs1/client/LDRElm.java` | +2/−1 | Headless hooks |
| `src/com/lushprojects/circuitjs1/client/LogicOutputElm.java` | +3/−0 | Electrical correctness |
| `src/com/lushprojects/circuitjs1/client/Menus.java` | +14/−35 | Original-app packaging/service changes |
| `src/com/lushprojects/circuitjs1/client/MouseManager.java` | +10/−4 | Original-app presentation/interaction |
| `src/com/lushprojects/circuitjs1/client/OpAmpElm.java` | +4/−2 | Headless hooks |
| `src/com/lushprojects/circuitjs1/client/PotElm.java` | +50/−9 | Mixed: split by hunk (see below) |
| `src/com/lushprojects/circuitjs1/client/ScopePlot.java` | +4/−9 | Original-app presentation/interaction |
| `src/com/lushprojects/circuitjs1/client/Scrollbar.java` | +182/−190 | Original-app presentation/interaction |
| `src/com/lushprojects/circuitjs1/client/SimulationManager.java` | +37/−15 | Mixed: split by hunk (see below) |
| `src/com/lushprojects/circuitjs1/client/SwitchElm.java` | +0/−1 | Original-app packaging/service changes |
| `src/com/lushprojects/circuitjs1/client/TestCreator.java` | +0/−101 | Original-app packaging/service changes |
| `src/com/lushprojects/circuitjs1/client/TestManager.java` | +0/−419 | Original-app packaging/service changes |
| `src/com/lushprojects/circuitjs1/client/Theme.java` | +174/−0 | Original-app presentation/interaction |
| `src/com/lushprojects/circuitjs1/client/ThermistorNTCElm.java` | +2/−1 | Headless hooks |
| `src/com/lushprojects/circuitjs1/client/Toolbar.java` | +308/−271 | Original-app presentation/interaction |
| `src/com/lushprojects/circuitjs1/client/UIManager.java` | +1459/−1396 | Original-app presentation/interaction |
| `src/com/lushprojects/circuitjs1/client/VarRailElm.java` | +2/−0 | Headless hooks |
| `src/com/lushprojects/circuitjs1/client/XMLDeserializer.java` | +0/−31 | Original-app packaging/service changes |
| `src/com/lushprojects/circuitjs1/client/circuitjs1.java` | +3/−8 | Original-app packaging/service changes |
| `src/com/lushprojects/circuitjs1/engine.gwt.xml` | +10/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/public/circuits/lvlabs-inverting-amplifier.txt` | +21/−0 | Original-app assets/examples |
| `src/com/lushprojects/circuitjs1/public/setuplist.txt` | +4/−1 | Original-app assets/examples |
| `src/com/lushprojects/circuitjs1/public/style.css` | +7/−7 | Original-app assets/examples |
| `src/com/lushprojects/circuitjs1/rebind/EngineWorkerLinker.java` | +35/−0 | Additive engine integration |
| `src/com/lushprojects/circuitjs1/worker.gwt.xml` | +10/−0 | Additive engine integration |

## Bounded build-proof plan

1. Export the pinned upstream tree to a disposable directory. Leave both working
   checkouts and their original deployment paths intact. Record the current tip,
   tool versions, baseline hash and patch checksums in a reconstruction manifest.
2. Extract separate headless, correctness and older-compatibility patches. Check
   each applies to the baseline with `git apply --check`. Place additive Java and
   GWT sources in a separate source root with their existing package names.
3. Compile upstream plus that root using Java 8/GWT 2.8.2 into a fresh output tree.
   Start with the cached compiler path if sandbox sockets still prevent Gradle.
   Use fresh class directories; never allow old classes or compiled workers to
   satisfy missing dependencies. Record any required original-app customization
   individually rather than copying the reskin wholesale.
4. Build an unchanged current-tree reference worker separately using the same
   toolchain. Compare observable results, not generated JavaScript byte identity.
   Route tests explicitly to each build; current tests must not silently read the
   existing `build/engine-site` while claiming to test reconstruction.
5. Run the computational suite against reconstructed assets. Focus comparison on
   divider/RC, passive/output families, diode/transistor/MOS behavior, switch and
   pulldown connectivity, model-stop handling, and state-preserving live reanalysis.
   Verify time/current polarity, retained capacitor/inductor state, fault handling
   and revision ordering. Add focused fixtures only where current tests miss the
   extracted changes (especially exact pot endpoints and stop safety).
6. Package the reconstructed worker with React and run build, SSR and packaged
   divider/RC checks. Success means the same public worker contract and regression
   outcomes without reskin sources/patches, with reproducible clean assembly.
   Interactive browser checks remain outside this proof unless requested.

Only after this passes choose an in-repository vendor tree or submodule. The
expected engine boundary is small, but independent source-root compilation remains
unproven. No repository conversion, source move, commit or deployment is part of
this audit.

## Documentation drift found

Tip `a9c07a42` deletes `.github/workflows/react.yml`. HANDOFF previously described
that workflow as present. Restore CI only as an intentional subsequent change;
this audit does not undo that deletion. The pinned refs above are local evidence,
so a future upstream-update audit should fetch explicitly and report the new pin.


## Reconstruction proof passed — 2026-11-17

The [reproducible proof tool](../../tools/upstream-boundary/README.md) built pinned
upstream plus three isolated patches and 12 additive Java/GWT files in a separate
source root. Both the engine's five permutations and the worker compiled with Java
8/GWT 2.8.2 using cached jars and in-process permutation workers. A fresh current-tip
reference was compiled separately. No existing classes or worker output were reused.
No additional reskin, Electron-removal, URL-service or original-app asset changes
were needed. Original upstream UI sources remain in the upstream compilation tree;
this proves exclusion of our UI customizations, not removal of upstream UI types.

- All 33 computational suites passed independently on both workers.
- 39,067 reference engine API calls were replayed on reconstructed engine instances.
  Returned JSON values and error messages matched exactly, including the existing
  pot-endpoint, reverse-capacitor stop, connectivity and live-reanalysis fixtures.
- React's symbol check, TypeScript/Vite build, SSR and packaged divider/RC checks
  passed using only the newly reconstructed worker in a disposable application copy.
- The existing large-chunk warning remained. No browser verification was run.

The initial attempt to compare independent suite transcripts exposed random
component IDs affecting element ordering. Exact reference-call replay replaced that
invalid comparison; no solver or regression assertions were weakened.

The [saved manifest](../../tools/upstream-boundary/proof-2026-11-17.json) records pins,
patch/addition hashes, toolchain/dependency evidence and per-suite call counts and
transcript hashes. Full local evidence is in
`/private/tmp/circuitjs-boundary-proof-20261117` (temporary; not a durable artifact).
The three extracted patches are retained under `tools/upstream-boundary/patches`.

This is sufficient evidence that a pinned-upstream dependency plus a small patch
layer is workable. It does not verify a revised Gradle source configuration, hosted
CI, latest-upstream compatibility or universal numerical parity. Production sources,
build paths and original deployment remain unchanged. Next choose how to adopt
this proven boundary; a submodule is now a viable packaging option, not a prerequisite.


## Production adoption — 2026-11-17

The previously proven boundary is now used by normal Gradle and cached builds.
See [engine maintenance](../../engine/README.md) and the current HANDOFF for
layout, update instructions and validation. Both `makeEngineSite` and original
`makeSite` passed via offline Gradle. The normal Gradle worker also matched the
same 39,067 saved reference API calls exactly. React build/SSR/packaging passed;
two computational suites remain affected by concurrent op-amp symbol edits.
The bridge files were moved byte-for-byte; no solver rewrite occurred.
