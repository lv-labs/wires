import assert from 'node:assert/strict'
import { createServer } from 'vite'

class Storage {
  data = new Map()
  get length() { return this.data.size }
  key(index) { return [...this.data.keys()][index] ?? null }
  getItem(key) { return this.data.get(key) ?? null }
  setItem(key, value) { this.data.set(key, String(value)) }
  removeItem(key) { this.data.delete(key) }
  clear() { this.data.clear() }
}
globalThis.localStorage = new Storage()
globalThis.sessionStorage = new Storage()
globalThis.location = { href: 'https://wires.example/editor?test=1' }
let queue = Promise.resolve()
Object.defineProperty(navigator, 'locks', { configurable: true, value: {
  request(_name, callback) {
    const result = queue.then(callback)
    queue = result.catch(() => {})
    return result
  },
} })
const server = await createServer({ server: { middlewareMode: true, ws: false, watch: null }, appType: 'custom' })
try {
  const w = await server.ssrLoadModule('/src/editor/circuitWorkspace.ts')
  const original = { title: 'Original', content: 'Ω 🔋' }
  localStorage.setItem('circuit-editor-prototype.v1', JSON.stringify(original))
  const first = w.startWorkspace({ title: 'Blank' }, false)
  assert.equal(first.document.title, 'Blank', 'Legacy work must not replace a fresh tab’s blank sheet')
  assert.equal(w.listEntries('draft').length, 1, 'Legacy autosave is retained for recovery')
  assert.equal(w.startWorkspace({ title: 'Blank' }, false).document.title, 'Blank', 'Repeated initialization does not consume recovery work')
  w.writeEntry('draft', { id: first.id, document: original, updated: 1, revision: 'draft-1' })
  w.rememberDraft(first.id)
  const reload = w.startWorkspace({ title: 'Blank' }, true)
  const duplicate = w.startWorkspace({ title: 'Blank' }, false)
  assert.deepEqual(reload.document, original)
  assert.equal(reload.id, first.id, 'Refresh resumes the same recovery slot')
  assert.notEqual(reload.id, duplicate.id, 'Duplicated tabs never share a draft write slot')
  const count = w.listEntries('draft').length
  w.writeEntry('draft', { id: reload.id, document: { title: 'Edited' }, updated: 2, revision: 'draft-2' })
  assert.equal(w.listEntries('draft').length, count, 'Refresh and edits update the existing draft instead of accumulating versions')
  w.writeEntry('draft', { id: duplicate.id, document: original, updated: 3, revision: 'draft-3' })
  assert.equal(w.readEntry('draft', first.id).document.title, 'Edited', 'A duplicate tab cannot overwrite the original')
  sessionStorage.clear()
  assert.equal(w.startWorkspace({ title: 'Blank' }, false).document.title, 'Blank', 'New tabs do not consume another tab’s draft')
  const saved = { id: 'old-library', document: original, updated: 4, revision: 'old-save' }
  w.writeEntry('circuit', saved)
  w.startWorkspace({ title: 'Blank' }, false)
  assert.deepEqual(w.readEntry('draft', 'library-old-library').document, original, 'Previous library work is preserved through recovery')
  await w.removeEntry('draft', 'library-old-library')
  w.startWorkspace({ title: 'Blank' }, false)
  assert.equal(w.readEntry('draft', 'library-old-library'), null, 'Discarded migrated work is not reimported')
  const url = await w.circuitLink(original)
  assert.deepEqual(await w.readCircuitLink(new URL(url).hash), original, 'Compressed snapshot links preserve Unicode and data')
  assert.equal(await w.readCircuitLink('#unrelated'), null)
  await assert.rejects(w.readCircuitLink('#circuit=v1.invalid'))
  localStorage.setItem('wires.workspace.v1.circuit.broken', '{bad')
  assert.equal(w.listEntries('circuit').length, 1, 'A damaged entry does not hide other circuits')
  console.log('Circuit workspace: blank tabs, recovery, refresh, duplication, migration, discard, and share links passed')
} finally {
  await server.close()
}
