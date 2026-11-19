# Circuit symbols

Each `src/<kind>.tsx` owns its React SVG view, stable kind, pin positions and
defaults. All 84 supported document models use these views on the sheet and in
placement previews. Views use metadata for lead endpoints. The core owns
world-coordinate transforms, and `svg.tsx` provides common SVG primitives.

Register a new symbol once in `index.ts`. Its export order also preserves the
shared catalog and reference editor's quick palette order. Keep optional
placement presets and output property constraints in the same symbol file.

From the repository root:

```sh
pnpm --dir apps/simulator symbols:generate
pnpm --dir apps/simulator symbols:check
node tools/test_symbol_authoring.mjs
```

The generator parses literal metadata with the TypeScript AST. It does not evaluate
TSX or load React. It writes marked generated sections of
`packages/circuit-core/catalog.js`; do not hand-edit those sections. This keeps
CommonJS, native ESM, classic browser scripts and workers compatible with their
existing loaders.

The views use React supplied by the `wires` host. There is no independent package
installation or runtime dependency from the core back into this directory.
The generated catalog preserves native device mappings and the existing defaults
shape. Native simulation post order is separate from display pin order.

The regression check covers the registry, generated definitions, SVG lead
endpoints, world pin positions across all rotations and reflections, and source
presets. Install `wires` dependencies before running it or the full computational
suite.

## Sheet units

The placement and visible grid are 50 units. Design new symbol artwork in
10-unit increments, with pins on the 50-unit grid where practical. The resistor
uses these sheet units directly.

Older symbol files have `metadata.drawingScale: 3.125` (50 / 16). Their SVG and
local pin metadata remain in original artwork coordinates. The sheet applies
this scale to the drawing; catalog generation applies it to electrical pin
coordinates. Stroke widths, sheet labels, wire markers and probes use sheet
units. When redrawing an older symbol in 50/10 units, remove `drawingScale` and
update its local pins and artwork together, then regenerate the catalog.

Legacy text, box and line annotation symbols use native sheet-unit dimensions.
New annotations are authored through the Draw menu and stored in `layout.drawings`,
outside the electrical symbol registry. Their default
sizes have been increased to match the new grid. Saved circuit positions and
explicit annotation sizes are not automatically resized by this authoring change.

## Development symbol workbench

Run `pnpm dev` from the repository root. One server hosts the circuit editor at
`http://localhost:5173/editor` and the symbol workbench at
`http://localhost:5173/symbols`. The root URL also opens the circuit editor;
`/editor.html` remains the example preview. There is no separate workbench server.
The optional `pnpm symbols:dev` command starts the same server and opens `/symbols`.
Both routes mount the main React app under its shared theme provider and error
boundary. The workbench uses the shared shadcn controls and follows light/dark
mode (including the app’s D shortcut). The workbench and source-writing endpoint
remain development-only and are not included in the production build.

Browse all 84 symbols, grouped in Add menu category order, and edit their complete
TSX source next to a live preview.
This includes symbols with parameter-dependent or animated artwork; the workbench
does not flatten them into editable SVG primitives. The drawing tools have been
replaced with a source editor featuring TSX colouring, line numbers, Tab
indentation, automatic indentation on Enter, and native text undo/redo.

Paste converted JSX shapes inside the existing `Symbol()` function. Omit the
outer `<svg>` wrapper, keep the pin metadata and `<Lead>` elements, and inherit
stroke styling where possible. Existing React logic and helper imports can remain
in place. Edit pin coordinates in the literal metadata when needed.

After a short typing pause, the dev server compiles an in-memory draft and the
preview updates. Draft previews never write source files. Syntax errors show line
and column information while retaining the last compiled preview; runtime render
errors are caught and displayed. This checks syntax and required exports, not a
full project typecheck. Each symbol keeps its draft while browsing. Drafts are
not persisted across page reloads.

Toggle the preview grid and pin markers, rotate or mirror the preview, and inspect
parameter values and current. Hover over the preview for crosshairs and SVG
source coordinates, accounting for rotation, mirroring and `drawingScale`. Set
**Snap** to a positive whole SVG unit spacing (suggestions: 1, 5, 10, 25, 50);
the visible dots and crosshairs use that same spacing. Click the preview to copy
the snapped coordinates as space-separated `X Y`, ready for SVG path data. This
preview setting does not change the circuit editor’s placement grid. Older
scaled symbols also show sheet coordinates. The preview uses the full available
height without a comparison panel.

Preview navigation uses the circuit editor’s viewport controls: scroll to pan,
Ctrl/Command-scroll or trackpad pinch to zoom at the pointer, middle-drag or
Space-drag to pan, and `+`/`-` to zoom or `0` to fit. The on-screen **Pan** and
**Fit** buttons offer the same actions. Dragging to pan does not copy coordinates.
Preview zoom extends to 1600% for close artwork inspection; the circuit editor’s
zoom limits are unchanged. Viewport shortcuts ignore the source editor and inputs.

**Save symbol** or Ctrl/Command-S writes the selected `src/<kind>.tsx` and
regenerates the core pin catalog. Other symbol drafts remain unsaved. The server
checks for stale source before writing, and restores both source and catalog if
generation fails. **Reload** rereads the file from disk, and **Reset to saved**
discards the current draft. Changing pin positions affects existing circuits too.

Run `node tools/test_symbol_workbench.mjs` for source validation and in-memory Vite
compilation checks, including dynamic symbols. No browser automation is required.

## Readable SVG paths

Path data uses a command per line, spaces between X/Y values, and commas between
coordinate pairs (for example `C -24 -22, -12 -22, -12 0`). Dynamic paths keep their
existing `${...}` expressions. Shared helper paths and waveform glyphs follow the
same format. Reapply this formatting with `node tools/format_symbol_paths.mjs`, or
check it with `node tools/format_symbol_paths.mjs --check`. The formatter verifies
that command, numeric and expression tokens remain unchanged.

## Waveform glyphs and source previews

Voltage source and voltage rail symbols use the shared `waveforms.tsx` module.
It contains the sine, square, triangle, sawtooth and pulse paths plus DC polarity
artwork. `svg.tsx` retains the general SVG helpers; voltage symbols import
`WaveformGlyph` from `../waveforms`.

In the workbench, select a voltage source and use **Waveform** to preview DC,
sine, square, triangle, sawtooth or pulse. **Preview parameters** exposes voltage
for DC and amplitude, frequency, offset, phase and (where applicable) duty cycle
for AC modes. These are preview overrides and do not change saved defaults.

The source panel offers **Symbol** and **Shared waveform glyphs** tabs. Glyph
edits preview inside the selected source using in-memory modules; no files are
written until **Save shared glyphs**. Saving this tab updates `waveforms.tsx` for
both source symbols. Saving the Symbol tab writes only that symbol file. Drafts
and stale-file protection apply independently to both tabs.

The A/C sweep symbol uses `SweepGlyph` in `waveforms.tsx`. It reuses the authored
sine path, compressing it from one to three visible cycles as in Falstad. Idle,
paused and workbench previews animate up/down over two seconds. Running circuits
use the engine’s measured sweep frequency, including logarithmic and bidirectional
sweep settings. Shared glyph editing is also available when the sweep is selected.

LEDs use the circle indicator during normal display and the diode body on hover,
selection or placement. Lit indicators have a colour/current-driven halo; off
LEDs and the highlighted diode view do not allocate blur filters. **View → LED
glow → Glow intensity** adjusts the halo from Off to 100% of the authored glow
and persists the preference locally. The workbench’s LED preview has the same
slider and preference. Existing on/off preferences are preserved. Glow is a presentation setting and
does not change circuit parameters or simulation results.
