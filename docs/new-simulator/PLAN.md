# Falstad parity plan

The goal is to open every pinned Falstad example and valid user-saved Falstad
circuit in Wires, preserve its electrical behavior, and restore its scopes and
saved controls. Keep the original Circuits submenu hierarchy and use editable
Wires documents throughout. The pinned engine and examples are the first
compatibility baseline. Extend coverage with real exports from maintained public
releases and older user saves.

## Checkpoint

The pinned menu has 367 entries. 270 open and pass the library's worker startup
check, across 269 distinct files. Of those files, 171 open with scope panes.
97 menu entries remain unavailable. The enabled entries also need verification
of simulation behavior and saved settings. [Import coverage](FALSTAD-IMPORT.md)
documents the supported formats and known limitations.

## Work in order

1. **Unlock the remaining circuits in measured batches.** Start each batch with
   the example report. Relays, 555 timers, controlled sources and counters are
   common blockers. Include missing component variants, custom models,
   subcircuits, and solver or preflight limitations where they block valid
   circuits. Compare representative electrical behavior with Falstad and
   regenerate the library under its original headings.
2. **Restore scopes and controls alongside circuit support.** Verify ordinary
   traces and their references first. Add XY and I–V plots, FFT, embedded scopes,
   wire and terminal currents, power, and remaining settings. Use a diode I–V
   example and a bundled 2-D example as milestones. Restore saved slider
   assignments and available simulation state. Verify scope targets, settings,
   order and layout after editing and saving/reopening.
3. **Validate users' saved circuits.** Route pasted text, files and self-contained
   `cct`/`ctz` links through the same import path. Decode links locally. Add
   versioned fixtures for older text saves, modern XML, unusual geometry, custom
   models and nested circuits. An invalid or unrepresentable import must leave
   the open circuit intact and identify the blocking record or option.

## Release checks

- Require every pinned menu entry to open under its original headings, every
  nonblank example to simulate, and supported versions of user exports to pass
  the same graph, worker and saved-workspace checks.
- Track conversion, worker startup, numerical comparisons and settings fidelity
  independently. A short startup run cannot establish waveform accuracy. Compare
  representative circuit traces and control responses against Falstad with
  documented time windows and tolerances.
- Keep unsupported settings visible in diagnostics until covered. Confirm a Wires
  save/reopen retains the imported circuit, scopes and controls. Use separate
  browser checks for interaction and rendering.
- Preserve the pinned upstream boundary, native solver behavior, stable document
  IDs and explicit connectivity. See the [engine guide](../../engine/README.md)
  and [editor contract](EDITOR-CONTRACT.md).

Analysis tools, simulation-time automation and desktop packaging remain outside
the current parity milestone. [Handoff](HANDOFF.md) lists commands and the latest
verification results.
