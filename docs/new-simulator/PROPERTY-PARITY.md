# Component property parity work

Baseline: the original Falstad Java application bundled in this repository, not the latest upstream website.

## Inventory and status

[COMPONENT-PROPERTY-AUDIT.md](COMPONENT-PROPERTY-AUDIT.md) and its JSON companion list all 136 original menu classes, inherited editor labels, candidate React counterparts and parameter keys. Regenerate with `node tools/audit_component_properties.mjs`. There are 49 menu classes without a matching React dump type. Matching dump types alone do not establish parity. Conditional controls, variant layouts, inherited methods and shared app preferences still require review before declaring full parity.

## Implemented

- **Diodes, LEDs and zeners:** all ten public built-in models; reusable custom simple and advanced models. Simple mode exposes saturation current, forward voltage/current and breakdown. Advanced mode exposes saturation current, series resistance, emission coefficient and breakdown. Zener pickers include only models with positive breakdown. LED RGB values and full-brightness current are supported; display brightness follows Falstad's logarithmic curve.
- **Custom model persistence:** model definitions are embedded in component parameters and shared by name within a circuit. Editing a model updates all references in that circuit; renaming forks it. Conflicting definitions are rejected. Definitions survive document save/load and worker projection round trips. Unreferenced custom models are not currently retained as a separate library.
- **Bipolar transistors:** default/spice-default selection, custom model creation/editing with all 20 numeric fields from the bundled model editor, including leakage, reverse beta, Early voltage, roll-off, emission coefficients, junction capacitances and transit times. Zero disables Early voltage/roll-off. Emitter/collector swap preserves physical wire endpoints. Draw-circle option is exposed per component.
- **MOSFETs:** body-diode simulation, separate body terminal, bulk visibility, digital symbol, body-diode visibility, source/drain swap, threshold and beta. Pin layouts and worker node counts update when body-terminal settings change. As in the original model, hiding bulk or selecting a digital symbol disables the body path.
- **Gates:** 1–8 inputs, high logic voltage, Schmitt inputs, input inversion and propagation delay. Input pins, rendering, wiring, hit testing, scope pin menus and worker mappings use the configured count. Removing pins preserves attached wires and voltage probes as junction endpoints.
- **Switches:** on resistance, linked labels/groups, momentary operation, IEC actuator indication, 2–10 SPDT throws and 1–8 DPDT poles. Existing fixed-format documents retain their old encoding. Resistive switch paths no longer count as ideal shorts in loop validation. Momentary previews toggle linked switches; releasing switches with more than two states advances through the second toggle, matching the original press/release cycle.
- **Text:** bar-on-top property, with backward-compatible defaults.

These are implemented property families, not a declaration of complete application parity. Global drawing preferences are currently represented per component; IEC/body-diode artwork uses the React symbol style rather than reproducing every original drawing detail.

## Properties panel audit — 17 November 2026

The current pass inventories all 136 original menu classes and checks default
form submissions for all 84 supported React component kinds. Focused source
review uses the bundled Java `getEditInfo`, `getChipEditInfo` and `setEditValue`
methods, rather than the live upstream website. This is a panel cleanup and
presentation parity pass; it does not implement every missing original option.

Fixed in this pass:

- Voltmeter, test point, ammeter, wattmeter and decimal display modes use named
  dropdowns instead of requiring numeric codes. Stop triggers use ≥ / ≤ choices.
  Numeric mode values stay numeric on Apply; logic input/output modes stay strings.
- Single-line labels, net names and linking labels use compact inputs. Text
  annotations and instruction lookup tables retain multiline editors.
- MOSFET bulk/body/digital controls follow the original conditional availability.
  Body terminal and body-diode artwork controls appear only when the bulk/body
  path is enabled. Enabling bulk clears digital mode, as in the original editor.
  Hidden settings retain their values until their controls are available again.
- P-channel MOSFET/JFET thresholds are presented with the original channel sign;
  stored engine threshold values retain their existing convention.
- Standard and tapped transformer ratios are edited as N1/N2, matching the
  original editor, while the model continues storing N2/N1.
- Memristor widths use nanometres and mobility uses µm²/(V·s), matching the original
  editor; documents and solver projections continue using SI units.
- Transformer inductance, transistor terminal swaps, analog switch inversion and
  logic-output current requirement captions describe their component-specific
  meaning. Unchanged converted values retain their stored precision on Apply.

Label visibility and manual placement controls are intentionally absent, per the
product decision. They are not missing parity work. SPDT "Center Off" is also
absent from the panel: its original control is commented out in `Switch2Elm.java`.

The inventory generator now excludes commented-out controls and includes
chip-specific editor methods. Inherited labels are still candidate controls:
subclass overrides can limit them (for example JFETs expose only threshold/beta).
The table must not be read as proof that every inherited option is actually shown.

Confirmed follow-up work:

| Family | Missing original behavior/options |
| --- | --- |
| Capacitors | Series resistance |
| Inductors / standard transformers | Saturation current; transformer secondary polarity |
| Voltage sources / rails | Internal resistance, rise/fall time, high/low-time editing; review waveform-dependent controls |
| Meters / voltage output | Manual scale, circle styles where applicable, fixed precision on voltage output |
| Digital chips / displays | Variable bit widths, bit order, optional control pins, LED grid dimensions and logic levels |
| Potentiometers | Linked potentiometer groups |
| Labeled nodes | Internal nodes and vertical text rotation |
| Varactors | Diode model selection |
| Switches | Keyboard shortcuts |

Some Wires panels additionally expose model state or geometry (for example initial
lamp temperature, motor load and shape dimensions). These remain intentional
editor capabilities for now; this pass does not silently delete model parameters.
The existing inventory also lists 49 original menu classes with no matching React
dump type. Those require component implementation, beyond a properties-panel change.

## Follow-up: small property fixes — 17 November 2026

- Capacitor, polarized-capacitor, inductor and transformer integration settings use
  the original **Trapezoidal approximation** checkbox. Reset-only initial voltage
  and current fields now say **on reset**. Passive, fuse and motor fields follow
  their original order.
- Three-phase motor properties show coupling coefficient `k = Lm / sqrt(Ls × Lr)`.
  Apply converts it using the final values of both inductances, including when
  those values are edited together. It requires `0 < k < 1` and preserves the
  exact existing mutual inductance when no values are changed.
- Thermistors and photoresistors expose the original slider-label field and get
  built-in sliders alongside potentiometers and variable voltage sources. The
  sensor sliders span the full 0–1 model range and show rounded temperature in °C
  or light level in lux, using the bundled models' conversions. Labels persist in
  documents, undo/redo and projection round trips.
- Fuses expose the original IEC-symbol checkbox. The default symbol uses the
  original wave form; IEC uses the rectangle and line. Both show an open circuit
  when blown, with the original 16/32-unit body widths.
- Sensor labels and fuse artwork stay in the React editor. Worker records retain
  their fixed placeholder labels and drawing flags, so these presentation changes
  cannot alter solver equations. No worker rebuild or native API change is needed.

## Follow-up: dependent switch fields and source precision

- SPDT position choices update immediately with the edited throw count. Shrinking
  the switch resets a removed selection to A. As in the original `Switch2Elm`,
  selecting more than two throws clears momentary operation; its checkbox stays
  disabled while that configuration is selected. Apply enforces the same rules.
- Component descriptions identify third and later positions as **Throw 3** through
  **Throw 10**. **Off** applies only to an actual two-throw, center-off configuration.
- Source edits preserve exact saved radians and duty-cycle fractions when their
  displayed values are unchanged. An absent optional phase stays absent on Apply.
  Panel regressions cover all six supported waveforms on two-terminal sources and
  rails, including arbitrary nonzero phases and fractional duty cycles.
- Property errors clear when fields are edited, so a corrected value does not keep
  an obsolete error message visible.

## Validation

- `node tools/test_property_controls.mjs`: sensor label persistence, undo/redo,
  native light/temperature endpoint and current checks, fuse rendering and native
  record invariance, motor coupling conversions and native solves; switch throw-count edits, removed-pin
  wiring, undo/redo and live native rerouting.

- `node scripts/test-component-properties.mjs` from `apps/simulator`: render all
  84 panels, submit defaults without changing values, validate saved parameters,
  edit numeric/string modes, verify original units/ratio/sign conversions and
  conditional MOSFET controls, integration checkboxes, sensor-slider rendering and
  motor coupling edits. Uses the real form handler with a portal-free test
  wrapper; it does not replace browser interaction coverage.

- `node tools/test_diode_models.mjs`: all built-ins, simple/advanced models, LED/zener curves, breakdown, live edits, old-document migration, shared edits/rename/conflicts, invalid values and projection round trips.
- `node tools/test_property_parity.mjs`: NPN/PNP model behavior, charge parameters and live edits, gate truth tables/counts/inversion/delay, removed-pin migration, live node-count changes, MOSFET reverse body-diode conduction, body terminals and terminal swaps.
- `node tools/test_switch_properties.mjs`: switch resistance and live edits, variable poles/throws, linked/momentary behavior, invalid configurations and projection round trips.
- `node tools/test_symbol_authoring.mjs`: generated catalog, authored symbols and lead metadata.
- `pnpm build` in `wires`: generated catalog consistency, TypeScript and production build.

Engine source changes require rebuilding the worker. The local cached build command is documented in HANDOFF.md. Browser verification is intentionally excluded at the user's request.

## Remaining work

1. Switch keyboard shortcuts; exact global drawing-preference semantics; retaining unused custom models in a library.
2. Digital chip options: configurable widths/bit order, optional set/reset/enable pins, and component-specific modes. The current chips remain fixed-layout subsets.
3. Remaining source, passive and display properties from the inventory. Review inherited and conditional options explicitly; do not mark completion from label matching alone.
4. The 49 original menu classes without React counterparts, including analog/hybrid chips and subcircuit tools.
5. Imported legacy circuit/model-library interchange beyond the current document format.

For each item, extend the document schema compatibly, implement editor/drawing changes, update worker validation/serialization, and verify observable solver behavior. Keep builds and tests focused; no browser verification unless the user requests it.
