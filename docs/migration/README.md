# Migration to wires

Prepared locally on 2026-11-17 from the working tree of the LV Labs CircuitJS fork
at `a9c07a42659b53fc9459bf2f56876e60c604eafc`, including uncommitted work.
The new repository starts with a migration snapshot; it does not duplicate the
fork's full history. The original history remains in lv-labs/circuitjs.

`source-snapshot.json` lists the SHA-256 of every copied input file and its new
path before import/build-path and documentation changes. The local op-amp symbol
and generated catalog edits were copied without changing their geometry or pin
ordering. Engine integration files and patches retain their original contents.

The new application lives under `apps/simulator`. The engine has its own pristine
upstream submodule, plus our patches and integration layer. Build/test/generation
paths now refer only to this repository. Dependencies and the submodule have their
own installations; nothing links to the original checkout.

The legacy repository keeps its reskin, Java source, web assets, short-link service
configuration and deployment workflows. No short-link records, domains, redirects,
hosted assets or deployments were changed during this migration.

Older design reports and archived handoffs under `docs/new-simulator` describe
previous repository layouts. README, engine/README and the current HANDOFF take
precedence over those historical paths and instructions. Historical proof artifacts
are preserved under `engine-proof`; saved reference transcripts are portable under
`tools/upstream-boundary/reference`.

The repository remains local, named `wires`, with no remote or deployment configured.

The former fork's menu differs from upstream by hiding the unsupported Norton amp
and calling Latch/Register simply Latch. These two UI choices are explicit in
`apps/simulator/src/editor/menu/legacy-menu-overrides.json`; generation/tests apply
them to upstream source so migration preserves the existing menu exactly.
Source preparation supports Python 3.9+ by extracting only regular files and
directories, rejecting archive links and traversal.
