import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createServer} from 'vite'
import React from 'react'
import {renderToString} from 'react-dom/server'
const server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom'})
try {
  const {CircuitEditor}=await server.ssrLoadModule('/src/editor/CircuitEditor.tsx')
  const {simulationPacing,snapSimulationSpeed}=await server.ssrLoadModule('/src/editor/simulationSpeed.ts')
  const {nearestScopeSample, scopeBounds, scopePath, scopeTimeRuler, scopeWindow, traceDisplay, updateAutoRange} = await server.ssrLoadModule('/src/editor/scopeDisplay.ts')
  const {adjacentPositions, adjacentValueDivisions} = await server.ssrLoadModule('/src/editor/scopeScales.ts')
  const {scopeSource} = await server.ssrLoadModule('/src/editor/scopeSource.ts')
  const {expandSelection} = await server.ssrLoadModule('/src/editor/expandSelection.ts')
  const {formatProbeVoltage, splitLegacyProbes} = await server.ssrLoadModule('/src/editor/voltageProbes.ts')
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

  const legacy=structuredClone(initialDocument)
  legacy.layout.probes={'probe-out':{x:50,y:-100,decimals:2,alignment:'center'}}
  legacy.probes[0].label='Output'
  legacy.probes[0].color='#ffaa00'
  const separated=splitLegacyProbes(legacy)
  const marker=separated.probes.find(({scope})=>scope===false)
  assert.equal(separated.probes.find(({id})=>id==='probe-out').color,'#ffaa00')
  assert.equal(separated.probes.find(({id})=>id==='probe-out').sourceProbeId,marker.id)
  assert.equal(separated.layout.probes['probe-out'],undefined)
  assert.deepEqual(separated.layout.probes[marker.id],legacy.layout.probes['probe-out'])
  assert.equal(marker.label,'Output')
  assert.equal(marker.color,undefined)
  assert.notEqual(marker.positive,legacy.probes[0].positive)
  assert.equal(splitLegacyProbes(separated),separated,'Loading again keeps marker and trace identities')
  const markerHtml=renderToString(React.createElement(CircuitEditor,{initialDocument:legacy,autosave:false}))
  assert.match(markerHtml,/<text[^>]*text-anchor="middle"[^>]*aria-label="—"[^>]*>—<\/text>/)
  assert.doesNotMatch(markerHtml,/>Output<\/text>/,'Older probes default to voltage only')
  separated.layout.probes[marker.id].showLabel=true
  const labeledHtml=renderToString(React.createElement(CircuitEditor,{initialDocument:separated,autosave:false}))
  const labelRows=labeledHtml.match(/<text x="([^"]+)" y="([^"]+)"[^>]*text-anchor="middle"[^>]*>Output<\/text><text x="([^"]+)" y="([^"]+)"[^>]*text-anchor="middle"[^>]*>—<\/text>/)
  assert.ok(labelRows,'The name and reading render as separate centered lines')
  assert.equal(labelRows[1],labelRows[3])
  assert.ok(Number(labelRows[2])<Number(labelRows[4]))
  assert.deepEqual(formatProbeVoltage(-1.238,2),{magnitude:'1.24 V',negative:true})
  assert.deepEqual(formatProbeVoltage(1.238,2),{magnitude:'1.24 V',negative:false})
  assert.deepEqual(formatProbeVoltage(-0.001,2),{magnitude:'0.00 V',negative:false})

  function range(previous, peak, sampleTime, now, coupling = 'dc') {
    const display = traceDisplay({ min: -peak, max: peak, values: [-peak, peak], coupling })
    return updateAutoRange(previous, display, coupling, sampleTime, now)
  }
  let automatic = range(undefined, 3, 1, 0)
  assert.equal(automatic.scale, 1)
  automatic = range(automatic, 3.6, 2, 20)
  assert.equal(automatic.scale, 1, 'Minor peaks near the boundary keep the current scale')
  automatic = range(automatic, 5, 3, 40)
  assert.equal(automatic.scale, 2, 'A peak that would clip widens the range immediately')
  automatic = range(automatic, 1, 4, 100)
  automatic = range(automatic, 1, 5, 1000)
  assert.equal(automatic.scale, 2, 'A brief lull holds the wider range')
  automatic = range(automatic, 3, 6, 1100)
  automatic = range(automatic, 1, 7, 1200)
  automatic = range(automatic, 1, 8, 1300)
  assert.equal(automatic.scale, 2, 'The return of a larger signal cancels the wait')
  assert.equal(range(automatic, 1, 8, 2500).scale, 2, 'A paused scope keeps its range')
  automatic = range(automatic, 1, 9, 2500)
  assert.equal(automatic.scale, 0.5, 'A sustained drop tightens the range')
  assert.equal(range(automatic, 0.01, 0, 2600).scale, 0.005, 'Rewinding samples resets auto-range')
  assert.equal(range(automatic, 0.01, 10, 2600, 'ac').scale, 0.005, 'Changing coupling resets auto-range')
  assert.deepEqual(adjacentValueDivisions(0.0037), { smaller: 0.002, larger: 0.005 })
  assert.deepEqual(adjacentValueDivisions(5 * 10 ** -6), { smaller: 2e-6, larger: 1e-5 })
  assert.deepEqual(adjacentValueDivisions(1e-9), { smaller: undefined, larger: 1e-6 })
  assert.deepEqual(adjacentValueDivisions(10), { smaller: 5, larger: undefined })
  assert.deepEqual(adjacentPositions(0), { smaller: -0.5, larger: 0.5 })
  assert.deepEqual(adjacentPositions(-0.73), { smaller: -1, larger: -0.5 })
  assert.deepEqual(adjacentPositions(-8), { smaller: undefined, larger: -7.5 })
  assert.deepEqual(adjacentPositions(8), { smaller: 7.5, larger: undefined })
  const millis = scopeTimeRuler(0.012, 0.0002)
  assert.equal(millis.unit, 'ms')
  assert.deepEqual([0, 0.0098, 0.01].map(millis.format), ['0.0', '9.8', '10.0'])
  const seconds = scopeTimeRuler(1, 0.0002)
  assert.equal(seconds.unit, 's')
  assert.deepEqual([0.9996, 1].map(seconds.format), ['0.9996', '1.0000'])
  const micros = scopeTimeRuler(0.0001, 0.00001)
  assert.equal(micros.unit, 'µs')
  assert.equal(micros.format(0.00002), '20')

  const times = [0, 1, 2, 4]
  const channels = [{ values: [9, 1, -2, 3], min: -2, max: 9, last: 3 }]
  const full = scopeWindow(channels, times, 4)
  assert.equal(full.times, times)
  assert.equal(full.channels, channels)
  const cropped = scopeWindow(channels, times, 2.75)
  assert.deepEqual(cropped.channels[0], { values: [-2, 3], min: -2, max: 3, last: 3 })
  const bounds = scopeBounds(times, 2.75)
  assert.equal(nearestScopeSample(times, bounds.start, bounds.index), 2)
  assert.equal(nearestScopeSample(times, bounds.end, bounds.index), 4)
  const coordinate = (n) => n
  assert.equal(scopePath([[0, 0], [1, 0], [2, 9], [3, 0], [4, 0]], coordinate, coordinate), 'M0 0H4L8 36L12 0H16')
  assert.equal(scopePath([[0, 3], [1, 3.0001], [2, 3]], coordinate, coordinate), 'M0 12H8')

  const pin = { kind: 'pin', componentId: 'r1', pinId: 'a' }
  const junction = { kind: 'junction', junctionId: 'branch' }
  const otherPin = { ...pin, componentId: 'r2' }
  const sourceDocument = {
    electrical: { wires: [
      { id: 'left', from: pin, to: junction },
      { id: 'right', from: junction, to: otherPin },
      { id: 'loop', from: otherPin, to: pin },
      { id: 'other-net', from: { ...pin, pinId: 'b' }, to: { ...otherPin, pinId: 'b' } },
    ] },
    layout: { probes: { marker: { x: 0, y: 0 } } },
    probes: [
      { id: 'marker', kind: 'voltage', positive: junction, reference: 'ground' },
      { id: 'voltage', kind: 'voltage', positive: pin, negative: { ...pin, pinId: 'b' }, reference: 'pins' },
      { id: 'current', kind: 'current', componentId: 'r2' },
    ],
  }
  assert.deepEqual(scopeSource(sourceDocument, 'marker').wires, new Set(['left', 'right', 'loop']))
  const voltage = scopeSource(sourceDocument, 'voltage')
  assert.deepEqual(voltage.components, new Set(['r1']))
  assert.deepEqual([...voltage.terminals.values()], [pin, { ...pin, pinId: 'b' }])
  assert.deepEqual(scopeSource(sourceDocument, 'current').components, new Set(['r2']))
  assert.equal(scopeSource(sourceDocument, 'removed'), null)

  const chain = {
    electrical: { wires: [
      ...sourceDocument.electrical.wires.slice(0, 3),
      { id: 'next-net', from: { ...otherPin, pinId: 'b' }, to: { ...pin, componentId: 'r3' } },
      { id: 'unrelated', from: { ...pin, componentId: 'r4' }, to: { ...pin, componentId: 'r5' } },
    ] },
  }
  const wire = (id) => ({ kind: 'wire', id })
  const component = (id) => ({ kind: 'component', id })
  const branch = { kind: 'junction', id: 'branch' }
  const drawing = { kind: 'drawing', id: 'note' }
  const net = [wire('left'), wire('right'), wire('loop'), branch]
  const netSelection = expandSelection(chain, [wire('left'), drawing])
  assert.deepEqual(new Set(netSelection), new Set([...net, drawing]))
  const attached = expandSelection(chain, netSelection)
  assert.deepEqual(attached, [...netSelection, component('r1'), component('r2')])
  const connected = expandSelection(chain, attached)
  assert.deepEqual(connected, [...attached, wire('next-net')])
  const complete = expandSelection(chain, connected)
  assert.deepEqual(complete, [...connected, component('r3')])
  assert.equal(expandSelection(chain, complete), complete)
  assert.deepEqual(new Set(expandSelection(chain, [component('r2')])), new Set([
    component('r2'), ...net, wire('next-net'),
  ]))
  assert.deepEqual(new Set(expandSelection(chain, [branch])), new Set(net))
  assert.deepEqual(expandSelection(chain, []), [])
  console.log('Selection expansion checks passed for wire loops, junctions and attached components.')
  console.log('React divider renders with the actual core, normalized wires, symbols and controls.')
  console.log('Scope checks passed for auto-range hysteresis, presets and trace sources.')
} finally {await server.close()}
