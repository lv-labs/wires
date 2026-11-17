// Compare an actual built worker against saved reference API calls from verify.py.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createEngine} from '../engine_node_runtime.mjs';
const [site, ...files] = process.argv.slice(2);
assert.ok(site && files.length, 'Usage: node tools/upstream-boundary/replay.mjs ENGINE_SITE TRANSCRIPT...');
let total = 0;
for (const file of files) {
  const engines = new Map();
  let count = 0;
  for (const line of (file.endsWith('.gz') ? gunzipSync(readFileSync(file)).toString('utf8') : readFileSync(file, 'utf8')).split('\n').filter(Boolean)) {
    const call = JSON.parse(line);
    let engine = engines.get(call.id);
    if (!engine) { engine = createEngine(path.resolve(site)); engines.set(call.id, engine); }
    let result, error;
    try { result = engine[call.key](...call.args); }
    catch (e) { error = String(e.message || e); }
    assert.deepEqual(JSON.parse(JSON.stringify({result, error})),
      JSON.parse(JSON.stringify({result: call.result, error: call.error})),
      `${file}, call ${count}: ${call.key}`);
    count++;
  }
  total += count;
}
console.log(`Matched ${total} exact API calls across ${files.length} reference suite transcripts.`);
