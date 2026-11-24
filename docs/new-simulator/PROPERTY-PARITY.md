# Component property parity

Compare the pinned Falstad Java editor's `getEditInfo`, `getChipEditInfo` and
`setEditValue` behavior with Wires' component catalog, properties form, worker
projection and import defaults. A shared dump type identifies a candidate.
Test variant flags, conditional controls, units and saved values independently.

Generate a fresh source inventory on demand:

```sh
python3 tools/inventory_legacy_catalog.py
node tools/audit_component_properties.mjs
```

Reports go to `build/audit/`. Use the [import guide](FALSTAD-IMPORT.md) for
actual example coverage. The property report includes inherited Java labels
which may be restricted by subclass overrides.

## Open compatibility gaps

- Capacitor ESR and magnetic saturation for inductors and transformers.
- Source internal resistance, rise/fall times and high/low-time editing.
- Optional chip control pins, variable bit widths, bus order and display sizes.
- Falstad switch shortcuts, linked potentiometers, labeled-node presentation,
  custom varactor models, and voltage-output scale and precision.

## Property checks

Keep native units at the worker boundary. Preserve exact stored values when
forms display a unit conversion or rounded number. Keep wire and probe
attachments stable when swapping transistor terminals or transformer polarity.
Retain the existing reference as a junction if editing removes a pin.
Per-component model definitions shared by name must remain consistent across
edits, save/open and projection. See the [editor contract](EDITOR-CONTRACT.md)
for intentional presentation choices.

`tools/test_property_parity.mjs` and
`apps/simulator/scripts/test-component-properties.mjs` cover model parameters,
worker mappings and form behavior.
