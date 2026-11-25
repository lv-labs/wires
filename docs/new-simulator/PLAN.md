# Falstad parity plan

Both parity goals use the pinned Falstad version as the baseline.

- **Full component parity.** Users can place, wire, edit and simulate every
  Falstad component and variant, with equivalent pins, defaults, properties,
  models and electrical behavior. Verify components even when no bundled
  example uses them.
- **Full example parity.** Every pinned Falstad example opens as an editable
  Wires document under its original Circuits submenu, reproduces the reference
  circuit behavior, and restores its scopes and saved controls.

Use the same import path for user-saved Falstad circuits and extend coverage
with real exports from maintained public releases and older user saves.

## Checkpoint

The pinned menu has 367 entries. 319 open and pass the library's worker startup
check, across 318 distinct files. Of those files, 202 open with scope panes.
48 menu entries remain unavailable. The enabled entries also need verification
of simulation behavior and saved settings. [Import coverage](FALSTAD-IMPORT.md)
documents the supported formats and known limitations.

The source inventory found 141 component menu classes. The property audit
parsed 137 of them and found 50 with no matching Wires dump type. The four
unparsed classes and the matches need manual review. Each implementation needs
verification in the editor, importer and worker before it counts toward parity.
The [handoff](HANDOFF.md) lists the inventory commands.

Text and XML import now map SCRs, DIACs and TRIACs to existing editable
components and native models. Both SCR examples and the TRIAC dimmer pass
startup checks. The dimmer still reports unsupported scope display and slider
settings.

The native 555 timer supports editable placement, legacy text and XML
imports, and saved output voltage. All nine previously blocked 555 examples
open with their imported scopes. The square oscillator and a monostable
driven by a repeatable trigger matched the pinned Falstad app's output edge
times over 40 ms. Separate tests cover active-low reset and live pin edits.

Ordinary relays use the native coil and contact model. All nine previously
blocked relay examples open. The regression tests cover the oscillator's
pickup, travel time and period, the flip-flop's latched state after button
release, and edits to pole count with an energized coil. With matched starting
conditions, the oscillator and flip-flop pin voltages matched the pinned
Falstad app to within 2 × 10⁻¹⁵ V at the sampled points.

Both second-generation current conveyors are available for placement and
text/XML import. All eight formerly blocked conveyor examples pass worker
startup. Three examples still report unsupported wire-current scope traces.

VCVS, VCCS, CCVS and CCCS are available for placement and text/XML import.
All twelve Controlled Sources examples pass worker startup. The current adder,
variable capacitor and variable inductor restore their four XML slider
assignments. The multiplier and full rectifier still warn about the saved
maximum-scale scope option.

Ring counters, binary up/down counters, and parallel-load counters with discrete
pins support placement, editing and text/XML import. Cascading Ring Counters,
LED Flasher, Traffic Light and Gray Code Counter pass worker startup. Bus
counter pins remain a blocker for the TD4 examples.

Decimal displays accept 1–16 discrete bits. Segment displays support 7, 14 and
16 segments with logic, common-anode or common-cathode inputs. LED arrays accept
2–16 rows and columns in text and XML. 7-Segment LED Decoder, 8-Bit Ripple Counter and
Flash ADC pass worker startup. The LED Array example also uses an unsupported
demultiplexer and custom logic model.

## Next batch

Start with **multiplexers and demultiplexers**. The Parallel-In Serial-Out
example is blocked by multiplexer record `184`, and the LED Array example
uses demultiplexer record `185` and a custom logic model. Verify select bit
order, inactive outputs and saved scope targets. Track the custom logic model
requirement with the LED Array example.

## Work in order

1. **Close component and example gaps in batches.** Use the component inventory
   and example blocker report to choose each batch. Controlled sources and counters
   are common blockers. Include component
   variants, custom models, subcircuits, and solver or preflight limitations
   where they block valid circuits. Track components and options outside the
   example library as well. Compare representative electrical behavior with
   Falstad and regenerate the library under its original headings.
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

- For each component and variant, verify placement, pin mapping, editable
  properties and defaults, text/XML import where applicable, save/reopen, and
  worker behavior against the Falstad reference. Add focused fixtures for
  components or options the bundled examples do not exercise.
- Require every pinned menu entry to open under its original headings and every
  nonblank example to simulate with its saved scopes and controls. Check user
  exports against the same graph, worker and saved-workspace checks.
- Track conversion, worker startup, numerical comparisons and settings fidelity
  independently. A short startup run cannot establish waveform accuracy. Compare
  representative circuit traces and control responses against Falstad with
  documented time windows and tolerances.
- Keep unsupported settings visible in diagnostics until covered. Confirm a Wires
  save/reopen retains the imported circuit, scopes and controls. Use separate
  browser checks for interaction and rendering.
- Exercise live controls with a filled scope. Verify simulated time and the
  displayed scope timeline keep advancing during a sustained drag and after
  the scope window fills.
- Preserve the pinned upstream boundary, native solver behavior, stable document
  IDs and explicit connectivity. See the [engine guide](../../engine/README.md)
  and [editor contract](EDITOR-CONTRACT.md).

Analysis tools, simulation-time automation and desktop packaging remain outside
the current parity milestone. [Handoff](HANDOFF.md) lists commands and the latest
verification results.
