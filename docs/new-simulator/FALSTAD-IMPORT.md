# Falstad text and XML import

Implemented first subset, 2026-11-17. The old JSON examples have not been repaired
or replaced. Upstream circuits are the compatibility corpus for this work.

Use **File → Import Falstad…** to paste Falstad's exported text or XML and inspect
line-numbered diagnostics before importing. **File → Open…** also accepts `.txt`, `.xml`
and `.cir` alongside Wires JSON. A failed import preserves the current circuit.
Successful imports remain ordinary editable Wires JSON documents.

The pure API is `core.falstad.importText(text, {id, title})`, returning
`{document, diagnostics}`. Any error returns `document: null`; warnings explicitly
identify omitted presentation settings or reset-state semantics. Both package
entry points expose the same API. Files need not contain a `$` header; omitted
headers use the native 5 µs default.

## Supported first subset

- `r`, `c`, `l`: resistor, linear capacitor/inductor and integration mode.
- `v`, `R`: DC, sine, square, triangle, sawtooth, pulse and one-terminal rails;
  source phase, old cosine flags and legacy pulse-duty defaults.
- `g`, `i`, `s`, `S`: ground, current source, SPST/push and two-throw SPDT switches.
- `172`, `174`: variable voltage and potentiometers, including native post geometry.
- `a`: small/large, swapped and low/explicit-gain op-amps, all orthogonal directions.
- `d`: default, bundled named and legacy forward-drop diode models.
- `O`, `L`, `M`: output markers, nonmomentary logic inputs and logic outputs.

Posts at identical original coordinates become one explicit junction. Wires join
only their endpoints: interior contacts and wire crossings do not invent nodes.
Op-amp posts come from upstream geometry, independently of the new artwork's
polarity. The first voltage source's first post is explicitly grounded when
Falstad's no-ground/no-rail fallback applies. Layout is scaled uniformly to leave
room for fixed Wires symbols and to survive editor grid preparation unchanged.
Electrical connections are established before layout adaptation.

Capacitors/inductors start at saved **initial** values; saved running state is not
restored. Scope (`o`), hint (`h`) and slider (`&`/`38`) records warn rather than silently
disappearing. Unknown records, unsupported flags/variants, model definitions,
nonzero capacitor ESR, inductor saturation, adaptive timestep, automatic DC
operating point and diagonal op-amps/SPDT switches block import. Diagonal two-pin
parts retain their original connections using orthogonal Wires symbols and leads.

XML exports use the same supported component set, including `VarRail` and `pt`.
The DOM-free XML reader decodes attributes/entities, validates structure, preserves
source line diagnostics and maps XML defaults separately from legacy text defaults.
Unsupported XML components and attributes produce specific errors. DTDs and entity
declarations are rejected. Scope/hint/adjustable XML records warn as in text.

## Measured coverage and next work

Run `node tools/audit_falstad_import.mjs` to inspect the current pinned corpus.
Of 373 `.txt` files, 67 convert to validated documents; 64 also compile for the
current worker. Three inductor-kick examples encounter the existing ideal
capacitor/source-loop preflight restriction. Conversion and simulation support
are intentionally reported separately; neither certifies browser interaction or
numerical parity for every imported circuit.

`tools/test_falstad_import.mjs` checks topology, implicit ground, source polarity,
all orthogonal source/op-amp orientations, grid stability across every accepted
upstream file, constructor defaults, diode equations and rejection diagnostics.
It compares an imported upstream inverting amplifier against the native engine.
The suite runs in `pnpm check`.

All ten entries under **Circuits → Basics** import and step successfully from the
pinned legacy examples and independently serialized XML equivalents.
`tools/test_falstad_basics.mjs` derives the entry list from upstream `setuplist.txt`,
compares both formats' compiled graphs, verifies editor normalization and steps each
in the actual worker engine. It checks Ohm's Law currents and potentiometer-divider
voltage numerically. It does not verify live-browser exports or pointer interactions.

Next: transistors/FETs, text annotations, remaining sources and multi-terminal
switches, gates/chips, custom model/subcircuit definitions and scopes/sliders.
Use the audit to choose batches and add native numerical comparisons alongside
each mapping. A bundled-example chooser should consume only the measured subset
until those gaps are filled; full upstream-library compatibility is not claimed.
