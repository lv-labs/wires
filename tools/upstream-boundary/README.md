# Engine regression reference

The first boundary proof reconstructed the original fork's engine from pristine
upstream plus isolated patches and bridge sources. Both workers passed all 33
then-current suites; 39,067 API calls matched exactly.

The saved, compressed reference transcripts are retained here so this repository
does not need the old fork's Git objects, working tree or temporary proof directory.
They contain test circuits and numerical results, with separate engine-instance IDs.

```sh
pnpm engine:build
pnpm check:reference
```

`replay.mjs` creates isolated engine instances, replays the recorded arguments,
and compares returned JSON values/error messages exactly. It excludes exception
stacks and generated JavaScript bytes. Engine-instance IDs preserve isolation.
Fresh computational tests remain separate; replay is additional regression evidence,
not a claim of universal Falstad parity or import coverage.

Historical proof manifests and the extracted patch snapshots live under
`docs/migration/engine-proof`. Production patches live only in `engine/patches`.
The old source-export proof scripts were retired because they required commits
from the former repository. This standalone toolchain uses the real build and
portable recorded reference instead.
