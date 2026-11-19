import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createServer} from 'vite'
import React from 'react'
import {renderToString} from 'react-dom/server'
const server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom'})
try {
  const {CircuitEditor}=await server.ssrLoadModule('/src/editor/CircuitEditor.tsx')
  const {simulationPacing,snapSimulationSpeed}=await server.ssrLoadModule('/src/editor/simulationSpeed.ts')
  const initialDocument=JSON.parse(readFileSync(new URL('../../../docs/new-simulator/examples/voltage-divider.json',import.meta.url),'utf8'))
  const html=renderToString(React.createElement(CircuitEditor,{initialDocument,autosave:false}))
  assert.ok(html.includes('Voltage divider'))
  assert.ok(html.includes('Circuit sheet'))
  assert.match(html,/<input [^>]*aria-label="Simulation Speed"[^>]*aria-valuetext="Falstad default"[^>]*type="range"[^>]*value="172"/)
  assert.match(html,/data-slot="simulation-speed-default-marker"/)
  assert.deepEqual(simulationPacing(172),{batchSteps:26,intervalMs:16})
  assert.deepEqual([165,166,172,178,179].map(snapSimulationSpeed),[165,172,172,172,179])
  assert.equal((html.match(/>1 kΩ<\/text>/g)||[]).length,2)
  assert.doesNotMatch(html,/>R[12]<\/text>/)
  assert.ok(!html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').includes('NaN'))
  console.log('React divider renders with the actual core, normalized wires, symbols and controls.')
} finally {await server.close()}
