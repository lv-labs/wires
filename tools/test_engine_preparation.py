"""Exercise pin/patch validation and clean source assembly without compiling GWT."""
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import prepare_engine


class EnginePreparationTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='engine-preparation-test-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.upstream = self.root / 'engine/upstream'
        self.upstream.mkdir(parents=True)
        self.git('init', '-q')
        (self.upstream / 'src').mkdir()
        (self.upstream / 'src/example.txt').write_text('upstream\n')
        self.git('add', '.')
        self.git('-c', 'user.name=Engine test', '-c', 'user.email=test@example.invalid',
                 '-c', 'commit.gpgsign=false', 'commit', '-qm', 'fixture')
        self.pin = self.git('rev-parse', 'HEAD').strip()
        self.config = self.root / 'engine/upstream.json'
        self.config.write_text(json.dumps({'revision': self.pin, 'patches': ['example.patch']}))
        patches = self.root / 'engine/patches'
        patches.mkdir()
        self.patch_file = patches / 'example.patch'
        self.patch_file.write_text('--- a/src/example.txt\n+++ b/src/example.txt\n@@ -1 +1 @@\n-upstream\n+patched\n')
        self.output = self.root / 'build/engine-source'
        self.mock_root = patch.object(prepare_engine, 'ROOT', self.root)
        self.mock_root.start()
        self.addCleanup(self.mock_root.stop)

    def git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.upstream), *args], text=True)

    def test_prepares_from_pin_and_removes_stale_output(self):
        self.output.mkdir(parents=True)
        (self.output / 'stale.java').touch()
        source = prepare_engine.prepare()
        self.assertEqual((source / 'example.txt').read_text(), 'patched\n')
        self.assertFalse((self.output / 'stale.java').exists())
        self.assertEqual((self.upstream / 'src/example.txt').read_text(), 'upstream\n')
        self.assertEqual(self.git('status', '--porcelain'), '')
        manifest = json.loads((self.output / 'engine-manifest.json').read_text())
        self.assertEqual(manifest['revision'], self.pin)
        self.assertEqual(len(manifest['patchSha256']['example.patch']), 64)

    def test_rejects_wrong_pin(self):
        self.config.write_text(json.dumps({'revision': '0' * 40, 'patches': []}))
        with self.assertRaisesRegex(RuntimeError, 'revision differs'):
            prepare_engine.prepare()

    def test_rejects_dirty_dependency(self):
        (self.upstream / 'untracked.txt').touch()
        with self.assertRaisesRegex(RuntimeError, 'local changes'):
            prepare_engine.prepare()

    def test_failed_patch_preserves_previous_output(self):
        prepare_engine.prepare()
        self.patch_file.write_text('--- a/src/example.txt\n+++ b/src/example.txt\n@@ -1 +1 @@\n-missing\n+patched\n')
        with self.assertRaises(subprocess.CalledProcessError):
            prepare_engine.prepare()
        self.assertEqual((self.output / 'src/example.txt').read_text(), 'patched\n')


if __name__ == '__main__':
    unittest.main()
