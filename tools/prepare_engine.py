#!/usr/bin/env python3
"""Validate the pinned submodule and build a disposable, patched engine source tree."""
import argparse
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def prepare(output=None):
    config = json.loads((ROOT / 'engine/upstream.json').read_text())
    upstream = ROOT / 'engine/upstream'
    if not (upstream / '.git').exists():
        raise RuntimeError('Engine submodule missing. Run git submodule update --init engine/upstream')
    def git(*args):
        return subprocess.check_output(['git', '-C', str(upstream), *args])
    revision = git('rev-parse', 'HEAD').decode().strip()
    if revision != config['revision']:
        raise RuntimeError('Engine revision differs from engine/upstream.json; review and update both pins')
    if git('status', '--porcelain').strip():
        raise RuntimeError('Engine submodule has local changes; keep integration edits in engine/patches or engine/integration')
    output = Path(output or ROOT / 'build/engine-source').resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='engine-source-', dir=output.parent) as scratch:
        tree = Path(scratch) / 'tree'
        tree.mkdir()
        with tarfile.open(fileobj=io.BytesIO(git('archive', revision))) as archive:
            # Extract regular files/directories explicitly, including on Python 3.9.
            # Reject links and path traversal rather than relying on version-specific
            # tarfile extraction filters.
            for member in archive.getmembers():
                name = PurePosixPath(member.name)
                if name.is_absolute() or '..' in name.parts:
                    raise RuntimeError('Unsafe path in upstream archive: ' + member.name)
                target = tree.joinpath(*name.parts)
                if member.isdir():
                    target.mkdir(parents=True, exist_ok=True)
                elif member.isfile():
                    target.parent.mkdir(parents=True, exist_ok=True)
                    with archive.extractfile(member) as source, target.open('wb') as dest:
                        shutil.copyfileobj(source, dest)
                    target.chmod(member.mode & 0o777)
                else:
                    raise RuntimeError('Unsupported link/type in upstream archive: ' + member.name)
        hashes = {}
        for name in config['patches']:
            patch = ROOT / 'engine/patches' / name
            hashes[name] = hashlib.sha256(patch.read_bytes()).hexdigest()
            subprocess.run(['git', 'apply', '--check', str(patch)], cwd=tree, check=True)
            subprocess.run(['git', 'apply', str(patch)], cwd=tree, check=True)
        manifest = dict(config, patchSha256=hashes)
        (tree / 'engine-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
        if output.exists():
            shutil.rmtree(output)
        tree.rename(output)
    print('Prepared pinned upstream engine:', revision, flush=True)
    return output / 'src'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    prepare(args.output)
