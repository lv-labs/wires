# Wires handoff

[The parity plan](PLAN.md) is the active work list. The pinned Falstad Circuits
menu enables 270 of 367 entries and 171 saved files have scope panes. The
[import guide](FALSTAD-IMPORT.md) describes accepted formats and limitations.

## Where to work

| Area | Source |
| --- | --- |
| Editor, file commands, scopes and menus | `apps/simulator/src/editor` |
| Falstad conversion and diagnostics | `packages/circuit-core/falstad.js`, `falstad-xml.js`, `falstad-scopes.js` |
| Menu and editable example generation | `tools/generate_falstad_examples.mjs` |
| Document, electrical projection and commands | [Circuit core](../../packages/circuit-core/README.md) |
| Simulation scheduling and worker messages | [Worker protocol](WORKER-PROTOCOL.md) |
| Native engine pin, patches and build | [Engine guide](../../engine/README.md) |
| Editor behavior and symbol ownership | [Editor contract](EDITOR-CONTRACT.md) |

Use the [root README](../../README.md) for setup and deployment. The
[migration record](../migration/README.md) records historical build and numerical
evidence. Earlier plans and handoffs are available in Git history.

## Reproduce the import checkpoint

With the pinned submodule initialized and the engine built:

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

The 2026-11-23 audit verified the saved Falstad menu, text/XML import regressions,
React production build, packaged worker measurements and 39,067 exact engine
reference calls. The connected-drag package test and SPDT letter-label property
test pass with their refreshed fixtures.

`pnpm check:core` currently stops at `tools/test_editor_model.mjs` on a rotated
pin position. Independent execution also found pre-existing failures in
`test_flip_connections.mjs`, `test_flip_flop_components.mjs`,
`test_live_reanalysis.mjs`, `test_output_family.mjs`, `test_pin_drag.mjs`,
`test_switch_properties.mjs`, `test_voltage_slider.mjs`, and
`test_wire_pin_contacts.mjs`. All nine failures reproduced against the
pre-cleanup checkout. Those suites remain enabled.
