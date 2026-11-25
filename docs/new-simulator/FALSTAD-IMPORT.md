# Falstad text and XML import

The **Circuits** menu follows the pinned Falstad `setuplist.txt` hierarchy and
ordering. Available entries open editable Wires documents. The menu retains
disabled entries for circuits that still need compatibility work. The existing
Wires examples are under **File → Open example**.

Use **File → Import Falstad…** to paste Falstad's exported text or XML and inspect
line-numbered diagnostics before importing. **File → Open from file…** also accepts `.txt`, `.xml`
and `.cir` alongside Wires JSON. A failed import preserves the current circuit.
Successful imports remain ordinary editable Wires JSON documents.

The pure API is `core.falstad.importText(text, {id, title})`, returning
`{document, diagnostics}`. Any error returns `document: null`; warnings explicitly
identify omitted presentation settings or reset-state semantics. Both package
entry points expose the same API. Files need not contain a `$` header; omitted
headers use the native 5 µs default.

## Supported imports

- `r`, `c`, `209`, `l`: resistor, linear and polarized capacitors, linear
  inductor, and saved integration mode.
- `v`, `R`: DC, sine, square, triangle, sawtooth, pulse and one-terminal rails;
  source phase, old cosine flags and legacy pulse-duty defaults.
- `g`, `i`, `s`, `S`: ground, current source, SPST/push and two-throw SPDT switches.
- `172`, `174`: variable voltage and potentiometers, including native post geometry.
- `a`: small/large, swapped and low/explicit-gain op-amps, all orthogonal directions.
- `d`, `z`, `162`: diodes, Zeners and LEDs with bundled and legacy models.
  LEDs retain their RGB values and brightness current.
- `O`, `L`, `M`: output markers, logic inputs including momentary controls,
  and logic outputs.
- `t`: orthogonal NPN and PNP transistors with built-in models, beta and native
  terminal placement. The simulator recalculates junction voltages at startup.
- `x`, `b`, `423`: editable sheet annotations, including multiline text,
  overlines, boxes, and lines.
- `170`, `n`, `R` with waveform 6, `A`, `200`, `201`: sweep, noise, antenna,
  AM and FM sources. Sweep preserves linear/logarithmic and bidirectional modes.
- `I`, `p`, `211`: inverter, voltage probe and audio output. Voltage probes preserve
  input resistance, reading mode, unit scale, and display flags.
- `f`, `j`: orthogonal N- and P-channel MOSFETs and JFETs, including threshold,
  beta, MOSFET body terminals, body diodes, and source/drain flip settings.
- `150`–`154`, `431`: AND, NAND, OR, NOR, XOR and XNOR gates with up to eight
  inputs, Schmitt and inverted input options, propagation delay, and saved
  initial output voltage. Gate input positions follow the original small or
  large symbol spacing.
- `171`, XML `tl`: lossless transmission lines with original return and signal
  posts, width-derived placement, impedance, and propagation delay. The native
  solver checks that both returns stay near zero voltage during simulation.
- `T`, `169`: linear transformers, including center taps, winding orientation,
  secondary phase reversal on two-winding transformers, and integration mode.
  Winding currents start at zero.
- `159`, `160`, `182`, `183`: analog SPST/SPDT switches and Schmitt triggers.
- `155`, `156`, `193`: D, JK and T flip-flops with saved output state and
  chip orientation. Optional asynchronous pins still require worker support.
- `m`, `368`, `370`, `419`: memristors, test points, ammeters and four-bit
  decimal displays. Test-point readouts use the Wires modes for voltage, RMS,
  maximum, minimum, peak-to-peak, and binary.
- `173`, `175`, `176`, `181`, `187`: triodes, tunnel diodes, default-model
  varactors, lamps within the worker's supported starting temperature range,
  and spark gaps. Varactors start at zero bias.
- `165` / XML `Timer` imports the native 555 timer, including its small and
  transformed layouts, optional reset and ground pins, pin numbering and saved
  output voltage.
- `178` / XML `rl` imports ordinary relays with one to four poles, coil
  current and contact position, pickup and release thresholds, travel time,
  contact pulldowns, and all three coil layouts. XML built-in and custom
  `rlm` model values become editable settings on each relay.
- `177`, `203`, `206`: SCRs, DIACs and TRIACs with saved trigger, holding and
  resistance settings. SCR and TRIAC gate posts follow the original layout.
  Saved SCR bias and TRIAC conduction state reset with a diagnostic.
- `207` and XML `ln`: labeled nets. XML `rw` wires preserve routed bends.

Posts at identical original coordinates become one explicit junction. Wires join
only their endpoints: interior contacts and wire crossings do not invent nodes.
Op-amp posts come from upstream geometry, independently of the new artwork's
polarity. The first voltage source's first post is explicitly grounded when
Falstad's no-ground/no-rail fallback applies. Layout is scaled uniformly to leave
room for fixed Wires symbols and to survive editor grid preparation unchanged.
Electrical connections are established before layout adaptation.

Capacitors/inductors start at saved **initial** values; saved running state is not
restored. Hints (`h`) and slider settings (`&`/`38`) still produce warnings.
Unknown records, unsupported flags/variants, model definitions,
nonzero capacitor ESR, inductor saturation, adaptive timestep, automatic DC
operating point and diagonal op-amps/SPDT switches block import. Diagonal two-pin
parts retain their original connections using orthogonal Wires symbols and leads.

XML exports use the same supported component set, including `VarRail` and `pt`.
The DOM-free XML reader decodes attributes/entities, validates structure, preserves
source line diagnostics and maps XML defaults separately from legacy text defaults.
Unsupported XML components and attributes produce specific errors. DTDs and entity
declarations are rejected. XML sliders that adjust the current of an independent
current source or the voltage of an unbiased DC source are saved with the circuit.
Other adjustable records and circuit hints produce import warnings.

VCVS, VCCS, CCVS and CCCS preserve their input count and output expression in
both formats. Current-controlled models use their built-in current-sensing
terminal pairs. The SPICE option that senses current through a separate voltage
source is unsupported.

Ring counter (`163`), binary counter (`164`) and counter with load (`421`)
records preserve saved outputs, width, native pin positions and supported
clock/reset options. XML also preserves the selected order of discrete pins.
Bus counter pins are unsupported.

Decimal display (`419`, XML `dd`) preserves 1–16 discrete bits, radix,
logic voltage and XML bit order. Segment display (`157`, XML `ssd`) preserves
7, 14 or 16 segments, the decimal point or colon, and logic or diode inputs.
LED arrays (`405`, XML `LEDArray`) preserve 2–16 rows and columns and their
native terminal positions. Bus display pins are unsupported.

Ordinary voltage and supported component-current scopes import from legacy text,
multi-plot text and XML. Wires restores docked pane grouping, trace labels,
measurement polarity, time divisions, manual scale, and AC coupling selection.
Undocked scopes in XML (`<Scope>`) and legacy text (`403`) become Wires sheet
scopes with their positions and sizes preserved relative to the circuit.
Explicit XML trigger settings map to Wires triggers. Automatic scaling and AC
display use Wires' existing behavior. XY, I–V, FFT, wire current, and unsupported
measurement or display options produce scope diagnostics. Opening a bundled example
with unavailable scope settings also shows a notice. Wires currently imports
up to 32 traces.

## Measured coverage

Run `pnpm examples:generate` after building the worker to refresh the saved
library from the pinned circuits. The generator checks topology and trace
resolution after editor preparation, and runs each nonempty enabled example
with its imported channels for at least 100 worker steps. For transmission lines
it also steps past the longest configured propagation delay.
`node tools/generate_falstad_examples.mjs --check --report` verifies the saved
library and prints each disabled entry's first blocker.

The menu currently enables 319 of 367 entries, including Blank Circuit and all
ten **Transmission Lines** examples, across 318 distinct files. Of those files,
202 open with imported scope panes. The nine native 555 examples, nine
ordinary relay examples, eight current conveyor examples, and all twelve
**Controlled Sources** examples are enabled. The VCVS Multiplier and VCVS Full
Rectifier warn about the saved maximum-scale scope option.
The Cascading Ring Counters, LED Flasher, Traffic Light and Gray Code Counter
examples are enabled, along with 7-Segment LED Decoder, 8-Bit Ripple Counter and
Flash ADC. The LED Array example remains blocked by the demultiplexer and
custom logic records.
VCCS, Current Integrator, and Current-Controlled Voltage Source in the
**Current Conveyor** submenu warn about saved wire-current traces.
The separate `node tools/audit_falstad_import.mjs`
audit covers all 373 bundled files,
including files outside the menu. Three inductor-kick examples encounter the
ideal capacitor/source-loop preflight restriction. A short worker run verifies
startup for the saved examples. Numerical parity needs circuit-specific checks.

`tools/test_falstad_import.mjs` checks topology, implicit ground, source polarity,
all orthogonal source/op-amp orientations, grid stability across every accepted
upstream file, constructor defaults, diode equations and rejection diagnostics.
It compares an imported upstream inverting amplifier and transformer against the
native engine and checks that the upstream divide-by-two circuit halves the
input frequency using the imported scope traces.
The suite runs in `pnpm check`.

All ten entries under **Circuits → Basics** import and step successfully from the
pinned legacy examples and independently serialized XML equivalents.
`tools/test_falstad_basics.mjs` derives the entry list from upstream `setuplist.txt`,
compares both formats' compiled graphs, verifies editor normalization and steps each
in the actual worker engine. It checks Ohm's Law currents and potentiometer-divider
voltage numerically. It does not verify live-browser exports or pointer interactions.

See the [Falstad parity plan](PLAN.md) for remaining milestones and release checks.
