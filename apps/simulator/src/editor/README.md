# React editor

Mount `CircuitEditor` within the application shell:

```tsx
import { CircuitEditor } from '@/editor/CircuitEditor'

// Place inside your own layout:
<CircuitEditor />
```

`initialDocument` optionally accepts a schema-v1 document. It is an initial value;
remount with a different React key to start a different document/session. The
main app restores the current tab's recovery draft when present. Set
`autosave={false}` to mount a fixture without the main app's recovery storage.
Run `pnpm dev` from the root and open `/editor.html` for the standalone preview.

- `useCircuitSession.ts`: committed editing/history session and worker lifecycle.
- `CircuitSheet.tsx`: camera and gesture state, separate uncommitted previews.
- `WireLayer.tsx`, `SymbolLayer.tsx`: SVG views, memoized independently of readings.
- `menu/`: generated Falstad menu hierarchy and supported placement mapping.
- `core.ts`: typed boundary for the subset of the existing JS API consumed here.
- `../../../../packages/circuit-symbols/src` from the editor source directory:
  authoritative per-symbol metadata and SVG views.

Scroll to pan, use Ctrl/⌘ scroll to zoom, and use middle-button or Space + drag
to pan. Shift adds to the selection. A left-to-right box selects enclosed items
and a right-to-left box selects touched items. Use G for connected drag, M for
detached move, R/Shift+R to rotate, and X/Y to flip. Ctrl/⌘ Z undoes an edit and
Shift + Ctrl/⌘ Z redoes it.

Press U or choose **Edit → Expand Selection** to grow the selection through
connected wiring. A selected wire or junction expands to the rest of its wired
net, then to the components attached to that net. A selected component expands
to the wired nets on its pins. Press U again to keep expanding.

Press A to open Add, then choose a component and click to place it. Placement
stays active until Escape or a tool change. Press W to start a wire at the cursor,
snapping to a nearby pin, junction, or wire, including one with a voltage probe.
The cursor becomes a crosshair while wiring. Move horizontally or vertically
first to choose the direction of each corner. Click blank space to place bends
or click a target to attach. Press W again to place the wire and start the next
one from its endpoint. Press Enter to finish at the cursor, or double-click
blank space to finish a loose end. Click a loose end to start a route from it or
drag it onto a new target to reconnect it.

Use Ctrl/⌘ C to copy within the editor, Ctrl/⌘ V to preview a paste, and Ctrl/⌘ D
to preview a duplicate. Click to place or press Escape to cancel. The File menu
includes schema-v1 example circuits. The Circuits menu lists imported examples
in the pinned Falstad hierarchy. E or a double-click opens properties for
a component or probe label. Component dialogs include live readings and the
actions available for that part. Run controls and the oscilloscope use the
retained worker.

The React sheet shows component values and saves circuits without reference
designators. New voltage probes get names such as Wire and Wire 2. Edit a probe
on the sheet to set its name and decimal places. Turn on **Show label** to
display its name above the centered voltage reading. Use **Add to
scope** in the probe's context menu to plot it. Use **Drag (G)** to move the
label or **Move (M)** to pick up the tip and place it on a new wire, pin or
junction. Traces added from that probe follow the tip to the new net. Trace
properties are available from the oscilloscope.

The **Sliders** panel opens when you place a variable voltage source or
potentiometer. Reopen it from **View → Sliders** or **Open sliders** in the
component's properties. Change the row name with the **Slider label** field
in those properties. Drag the floating panel by its title. Drag a row by
its grip or focus the grip and press Up or Down to reorder it. The main editor
remembers the order per circuit in browser storage. Slider changes preview live
and commit on release. The potentiometer wiper follows the slider on the sheet.
The panel and the editor's visible controls use shadcn
Base Mira.

Committed edits reach history. Momentary switches and sliders can also
preview updates in simulation. Simulation uses the retained
revision coordinator and classic worker in `packages/circuit-runtime`. `scripts/engine-assets.ts` serves the
worker/imports under `/engine/` in dev and copies them into the production bundle.
Initialize `engine/upstream` with `git submodule update --init engine/upstream`, then
compile the engine (`makeEngineSite` or `tools/build_engine_cached.py`). Both builds
use the pinned dependency plus `engine/patches` and `engine/integration`.
Missing compiled worker assets produce a build error. Static deployment must
serve `dist/engine` with JavaScript MIME types, including nested worker assets.

Checks:

```sh
pnpm --dir apps/simulator build
pnpm --dir apps/simulator exec node scripts/test-editor-render.mjs
pnpm --dir apps/simulator exec node scripts/test-worker-assets.mjs
node tools/check_core.mjs
```

The worker-assets check requires a fresh Vite build; it executes the actual
packaged classic bootstrap and relative imports in a DOM-free VM, checking divider
and RC measurements. The render check uses React SSR. Neither certifies browser
pointer behavior. Browser interaction verification remains pending.

The Add menu lists the reference component catalog and disables unsupported
entries. Regenerate it with `python3 tools/generate_component_menu.py`.
`pnpm examples:generate` refreshes the separate Circuits menu and saved example
documents. See the [import guide](../../../../docs/new-simulator/FALSTAD-IMPORT.md)
for details.
