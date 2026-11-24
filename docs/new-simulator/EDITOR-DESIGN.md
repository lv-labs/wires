# Circuit document design

A schema-v1 Wires file holds the electrical graph, layout, probes and simulation
settings. IDs for components, junctions, wires and probes remain stable across
edits and save/open. The [circuit core](../../packages/circuit-core/README.md)
owns validation, connectivity, editing transactions and adapter projection.
[The editor contract](EDITOR-CONTRACT.md) owns interaction and presentation.

- `electrical.components` stores kinds, model versions and parameters.
- `electrical.junctions` and `electrical.wires` describe explicit connectivity.
  Wires link component pins or junctions. Geometry alone does not create a net.
- `layout` stores poses, junction positions, wire bends, non-electrical drawings
  and the optional saved scope workspace.
- `probes` stores trace sources and saved display settings. Stable references
  allow probe settings to survive editing and worker replacement.
- `simulation` stores settings such as timestep. Mutable engine state and
  acquired samples belong to the current run.

Compile nets from the graph, including explicit named-net aliases and ground
connections. Do not persist a second net representation. The canonical solver
projection uses public pin-to-net mappings. The adapter encodes native post
ordering independently of the display symbol and translates native readings
back to stable IDs. [Worker protocol](WORKER-PROTOCOL.md) covers the runtime
boundary.

Commit electrical changes through history. Keep gesture previews separate until
they commit. Connected dragging preserves existing connections unless a gesture
explicitly creates a contact. See [connected dragging](DRAGGING.md) for details.
The [example documents](examples/) are shared by the app and regression tests.
