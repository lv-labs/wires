# Wires handoff

[The parity plan](PLAN.md) tracks full parity with the pinned Falstad component
catalog and example library. The pinned Circuits menu enables 291 of 367 entries
and 184 saved files have scope panes. The [import guide](FALSTAD-IMPORT.md)
describes accepted formats and limitations.

The ordinary relay batch is complete. The [plan](PLAN.md#next-batch) identifies
CCII+ and CCII− current conveyors as the next batch.

## Where to work

| Area | Source |
| --- | --- |
| Editor, file commands, scopes and menus | `apps/simulator/src/editor` |
| Component definitions, defaults and simulation mappings | `packages/circuit-core/catalog.js` |
| Falstad conversion and diagnostics | `packages/circuit-core/falstad.js`, `falstad-xml.js`, `falstad-scopes.js` |
| Menu and editable example generation | `tools/generate_falstad_examples.mjs` |
| Document, electrical projection and commands | [Circuit core](../../packages/circuit-core/README.md) |
| Simulation scheduling and worker messages | [Worker protocol](WORKER-PROTOCOL.md) |
| Native engine pin, patches and build | [Engine guide](../../engine/README.md) |
| Editor behavior and symbol ownership | [Editor contract](EDITOR-CONTRACT.md) |

Use the [root README](../../README.md) for setup and deployment. The
[migration record](../migration/README.md) records historical build and numerical
evidence. Earlier plans and handoffs are available in Git history.

## Reproduce the parity reports

Generate the component source inventory and property audit with the pinned
submodule initialized.

```sh
python3 tools/inventory_legacy_catalog.py
node tools/audit_component_properties.mjs
```

The reports are written to `build/audit/`. Use the property audit's dump-type
matches to locate candidate implementations, then verify pins, options and
behavior in the editor, importer and worker.

Verify the saved examples and import behavior with the engine built.

```sh
node tools/generate_falstad_examples.mjs --check --report
node tools/audit_falstad_import.mjs
node tools/test_falstad_import.mjs
node tools/test_falstad_basics.mjs
```

Run `pnpm examples:generate --report` after a change that affects saved examples.
Compare the blocker report before and after and check that any expected scope
channels still resolve. Run `pnpm check` for the full project checks or the
affected suites independently if an earlier suite fails.

## Verification checkpoint

The nine ordinary relay examples pass worker startup. The relay oscillator and
flip-flop have focused tests for switching and state retention. A comparison
with pinned Falstad sampled the oscillator over 265 ms and the idle flip-flop
over 110 ms with matched initial conditions. All sampled pin voltages agreed
to within 2 × 10⁻¹⁵ V.

The library also includes the nine 555 examples and the output-marker
geometry updates. All nine examples pass worker startup with their imported
scope channels. The square oscillator and a repeatably triggered monostable
matched the pinned Falstad app's output edge times over 40 ms. The import
regressions also cover timer placement, saved output, and active-low reset.

The 2026-11-23 audit verified the saved Falstad menu, text/XML import regressions,
React production build, packaged worker measurements and 39,067 exact engine
reference calls. The connected-drag package test and SPDT letter-label property
test pass with their refreshed fixtures.

`pnpm check:core` runs the saved example check first. With refreshed examples,
the earlier core run stopped at `tools/test_editor_model.mjs` on a rotated pin
position. Independent execution also found pre-existing failures in
`test_flip_connections.mjs`, `test_flip_flop_components.mjs`,
`test_live_reanalysis.mjs`, `test_output_family.mjs`, `test_pin_drag.mjs`,
`test_switch_properties.mjs`, `test_voltage_slider.mjs`, and
`test_wire_pin_contacts.mjs`. All nine failures reproduced against the
pre-cleanup checkout. Those suites remain enabled.
