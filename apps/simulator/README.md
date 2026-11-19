# Wires: React circuit editor

The circuit editor uses React/TypeScript, shadcn Base Mira and an SVG sheet.
Circuit documents and editing operations come from `packages/circuit-core`; a
dedicated Java/GWT CircuitJS worker retains the original simulation models.

From the repository root, with Java 8, Node 24+ and pnpm 10.30.3:

```sh
pnpm deps:install
pnpm engine:build
pnpm dev
```

The same dev server hosts `/editor` (circuit editor) and `/symbols` (development
symbol workbench). `/editor.html` is the standalone example preview with
main-app autosave disabled. `pnpm build` builds the engine and React app; deployable
React files are in `apps/simulator/dist` and are committed for static hosting.
See the root [deployment instructions](../../README.md#deploy-to-cloudflare-pages).

`pnpm check` runs the computational suites, frontend production build, SSR render
and packaged-worker checks. It does not launch browser interaction verification.
For frontend-only work, `pnpm --dir apps/simulator build` uses the existing compiled engine;
`pnpm --dir apps/simulator typecheck` checks the app and tooling TypeScript projects.

See [editor integration](src/editor/README.md),
[current handoff](../../docs/new-simulator/HANDOFF.md) and
[editor contract](../../docs/new-simulator/EDITOR-CONTRACT.md). Per-symbol TSX metadata
and views live in `packages/circuit-symbols`; regenerate their headless catalog
with `pnpm --dir apps/simulator symbols:generate`. Reuse existing UI components under
`src/components/ui` and preserve the shell/style ownership in `src/App.tsx`.

## Sheet drawings

Use **Draw → Text, Line, Box, Ellipse, Polygon** for non-electrical annotations.
Drag to size lines, boxes and ellipses. Click to place text, then edit its content.
For polygons, click vertices and press Enter, double-click, or click the first
vertex to finish; Escape cancels and Backspace removes the last draft vertex.

**Draw → New drawing appearance…** sets stroke colour, fill/text colour, line
width, solid/dashed/dotted style and font size for new drawings. Use theme colours
for automatic light/dark support. Select an existing drawing and double-click,
press E, or choose its appearance action to edit it. Drag drawings to move them;
selected drawings expose resize/vertex handles. Copy/paste, deletion, rotation,
flip and undo/redo include drawings.

Drawings live in `layout.drawings`, behind the circuit. They have no electrical
pins and do not affect simulation. Existing saved circuits containing legacy
text/box/line components remain readable; new annotations use the Draw menu.
