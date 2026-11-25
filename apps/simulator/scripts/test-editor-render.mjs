import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createServer} from 'vite'
import React from 'react'
import {renderToStaticMarkup, renderToString} from 'react-dom/server'
import {outputFamilyCircuit} from '../../../tools/output_family_fixtures.mjs'
import {passiveSwitchCircuit} from '../../../tools/passive_switch_fixtures.mjs'
const server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom'})
try {
  const {CircuitEditor}=await server.ssrLoadModule('/src/editor/CircuitEditor.tsx')
  const {ScopePane}=await server.ssrLoadModule('/src/editor/ScopePane.tsx')
  const {SymbolBody, SymbolLayer}=await server.ssrLoadModule('/src/editor/SymbolLayer.tsx')
  const {sheetScopeDisplay}=await server.ssrLoadModule('/src/editor/scopeViewport.ts')
  const {snapSheetScopeSize}=await server.ssrLoadModule('/src/editor/scopeSnapping.ts')
  const {core}=await server.ssrLoadModule('/src/editor/core.ts')
  const {simulationPacing,snapSimulationSpeed}=await server.ssrLoadModule('/src/editor/simulationSpeed.ts')
  const {nearestScopeSample, scopeBounds, scopeColumnPath, scopePath, scopeTimeRuler, scopeWindow, traceDisplay, updateAutoRange} = await server.ssrLoadModule('/src/editor/scopeDisplay.ts')
  const {adjacentPositions, adjacentValueDivisions} = await server.ssrLoadModule('/src/editor/scopeScales.ts')
  const {scopeSource} = await server.ssrLoadModule('/src/editor/scopeSource.ts')
  const {expandSelection} = await server.ssrLoadModule('/src/editor/expandSelection.ts')
  const {formatProbeVoltage, splitLegacyProbes} = await server.ssrLoadModule('/src/editor/voltageProbes.ts')
  const initialDocument=JSON.parse(readFileSync(new URL('../../../docs/new-simulator/examples/voltage-divider.json',import.meta.url),'utf8'))
  const html=renderToString(React.createElement(CircuitEditor,{initialDocument,autosave:false}))
  assert.ok(html.includes('Voltage divider'))
  assert.ok(html.includes('Circuit sheet'))
  assert.match(html, /role="menuitem"[^>]*>Circuits<\/button>/)
  assert.match(html,/<input [^>]*aria-label="Simulation Speed"[^>]*aria-valuetext="Falstad default"[^>]*type="range"[^>]*value="172"/)
  assert.match(html,/data-slot="simulation-speed-default-marker"/)
  assert.deepEqual(simulationPacing(172),{batchSteps:26,intervalMs:16})
  assert.deepEqual([165,166,172,178,179].map(snapSimulationSpeed),[165,172,172,172,179])
  assert.equal((html.match(/>1 kΩ<\/text>/g)||[]).length,2)
  assert.doesNotMatch(html,/>R[12]<\/text>/)
  assert.ok(!html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').includes('NaN'))

  const currentAdderPath=new URL('../../../engine/upstream/src/com/lushprojects/circuitjs1/public/circuits/cs-currentadder.txt',import.meta.url)
  const currentAdder=core.falstad.importText(readFileSync(currentAdderPath,'utf8')).document
  assert.ok(currentAdder)
  const currentAdderHtml=renderToString(React.createElement(CircuitEditor,{initialDocument:currentAdder,autosave:false}))
  assert.match(currentAdderHtml,/>CCVS<\/text>/)
  assert.match(currentAdderHtml,/>VCCS<\/text>/)
  assert.match(currentAdderHtml,/aria-label="Current 1"/)
  assert.match(currentAdderHtml,/aria-label="Current 2"/)

  const ringParameters={...core.catalog.definitions.ringCounter.parameters,bits:3}
  const ringHtml=renderToStaticMarkup(React.createElement(SymbolBody,{
    component:{kind:'ringCounter',parameters:ringParameters},pose:{rotation:90,mirror:true},
  }))
  assert.match(ringHtml,/>Q0<\/text>/)
  assert.match(ringHtml,/>Q2<\/text>/)
  assert.doesNotMatch(ringHtml,/>Q3<\/text>/)

  const displaySymbol = (kind, parameters, measured) => renderToStaticMarkup(React.createElement(SymbolBody,{
    component:{kind,parameters:{...core.catalog.definitions[kind].parameters,...parameters}},
    measured,pose:{rotation:0,mirror:false},
  }))
  for(const kind of ['decimalDisplay','instructionDisplay'])for(const bitCount of [1,4,8,16]){
    const html=displaySymbol(kind,{bitCount},{text:'165'})
    assert.match(html,/>165<\/text>/)
    assert.match(html,new RegExp(`height="${Math.max(150,bitCount*100)}" rx="12"`))
    assert.equal((html.match(/<path\b/g)||[]).length,bitCount)
    assert.match(html,new RegExp(`>${bitCount-1}<\\/text>`))
  }
  const segmentHtml=displaySymbol('sevenSegment',{segments:14,extra:2},{segments:Array(15).fill(1)})
  assert.equal((segmentHtml.match(/<line\b/g)||[]).length,14)
  assert.equal((segmentHtml.match(/<circle\b/g)||[]).length,2)
  const matrixHtml=displaySymbol('ledArray',{columns:3,rows:2},{currents:[.01,0,0,0,0,0]})
  assert.equal((matrixHtml.match(/<circle\b/g)||[]).length,6)
  assert.match(matrixHtml,/fill="rgba\(255,75,45,1\)"/)

  const potDocument = core.document.empty()
  const pot = {id: 'pot', kind: 'potentiometer', modelVersion: 1, parameters: {resistance: 1000, position: 0.25}}
  potDocument.electrical.components.push(pot)
  potDocument.layout.components.pot = {x: 0, y: 0, rotation: 0, mirror: false}
  const renderPot = sliderPreview => renderToStaticMarkup(React.createElement(SymbolLayer, {
    document: potDocument, selected: [], sliderPreview,
  }))
  assert.doesNotMatch(renderPot(), />(250|750) Ω<\/text>/)
  const potCanonical = core.adapter.compile(potDocument).canonical
  pot.parameters.showValues = true
  assert.equal(core.adapter.compile(potDocument).canonical, potCanonical)
  assert.equal(core.document.validate(JSON.parse(JSON.stringify(potDocument))).electrical.components[0].parameters.showValues, true)
  assert.match(renderPot(), /<text x="-100" y="35" text-anchor="end"[^>]*>250 Ω<\/text>/)
  assert.match(renderPot(), /<text x="100" y="35" text-anchor="start"[^>]*>750 Ω<\/text>/)
  potDocument.layout.components.pot = {x: 0, y: 0, rotation: 90, mirror: true}
  const potPreview = renderPot({kind: 'potentiometer', id: 'pot', value: 0.4})
  assert.match(potPreview, /<text x="-35" y="100" text-anchor="end"[^>]*>400 Ω<\/text>/)
  assert.match(potPreview, /<text x="-35" y="-100" text-anchor="end"[^>]*>600 Ω<\/text>/)

  for (const kind of ['voltageSource', 'voltageRail']) {
    const renderSource = waveform => renderToStaticMarkup(React.createElement(SymbolBody, {
      component: {kind, parameters: {waveform}},
      pose: {rotation: 90, mirror: true},
    }))
    const dc = renderSource({kind: 'dc', voltage: 5})
    if (kind === 'voltageRail') {
      assert.match(dc, /M 0 0\s+L 0 -100/)
      assert.match(dc, /M -30 -50\s+L 0 -100, 30 -50/)
      assert.doesNotMatch(dc, /<circle|<polygon|M -24 -9/)
      const zero = renderSource({kind: 'dc', voltage: 0})
      assert.match(zero, /M -30 -50\s+L 0 -100, 30 -50/)
      assert.doesNotMatch(zero, /<polygon/)
      const negative = renderSource({kind: 'dc', voltage: -5})
      assert.match(negative, /M 0 0\s+L 0 -100/)
      assert.match(negative, /<polygon points="-30,-50 0,-100 30,-50" fill="currentColor"/)
      assert.doesNotMatch(negative, /<circle/)
    } else {
      assert.match(dc, /scale\(-1 1\) rotate\(-90\)[^>]*><path d="M -24 -9 H 24\s+M -24 9 H -14\s+M -5 9 H 5\s+M 14 9 H 24"/)
    }
    assert.doesNotMatch(dc, /C -20 -30/)
    const sine = renderSource({kind: 'sine', amplitude: 1, frequency: 1000, offset: 0})
    assert.match(sine, /<circle r="50"/)
    assert.match(sine, /M -25 0\s+C -20 -30/)
  }

  function renderAnalogSwitch(kind, control, inverted = false) {
    const document = passiveSwitchCircuit(kind, {threshold: 3, inverted})
    const frame = control === undefined ? null : {pinVoltages: {part: {control}}}
    return renderToStaticMarkup(React.createElement(SymbolLayer, {document, selected: [], frame}))
  }
  assert.match(renderAnalogSwitch('analogSwitch'), /M -20 0\s+L 18 -12/)
  assert.match(renderAnalogSwitch('analogSwitch', 2.9), /M -20 0\s+L 18 -12/)
  assert.match(renderAnalogSwitch('analogSwitch', 3), /M -20 0\s+L 20 0/)
  assert.match(renderAnalogSwitch('analogSwitch', 2.9, true), /M -20 0\s+L 20 0/)
  assert.match(renderAnalogSwitch('analogSwitch', 3, true), /M -20 0\s+L 18 -12/)
  assert.match(renderAnalogSwitch('analogSpdtSwitch'), /M -40 0\s+L 50 -50/)
  assert.match(renderAnalogSwitch('analogSpdtSwitch', 2.9), /M -40 0\s+L 50 50/)
  assert.match(renderAnalogSwitch('analogSpdtSwitch', 3), /M -40 0\s+L 50 -50/)
  assert.match(renderAnalogSwitch('analogSpdtSwitch', 2.9, true), /M -40 0\s+L 50 -50/)
  assert.match(renderAnalogSwitch('analogSpdtSwitch', 3, true), /M -40 0\s+L 50 50/)

  const netDocument = outputFamilyCircuit('labeledNode', {name: 'POWER_SENSE'})
  const netHtml = renderToString(React.createElement(CircuitEditor,{initialDocument:netDocument,autosave:false}))
  const netLabels = netHtml.match(/<text\b[^>]*>POWER_SENSE<\/text>/g) ?? []
  assert.equal(netLabels.length, 1)
  assert.match(netLabels[0], /text-anchor="middle"/)
  assert.match(netLabels[0], /dominant-baseline="central"/)

  const netCanonical = core.adapter.compile(netDocument).canonical
  for (const boxStyle of [undefined, 'solid', 'dashed', 'none']) {
    const document = structuredClone(netDocument)
    const component = document.electrical.components.find(({id}) => id === 'part')
    if (boxStyle === undefined) delete component.parameters.boxStyle
    else component.parameters.boxStyle = boxStyle
    const saved = core.document.validate(JSON.parse(JSON.stringify(document)))
    assert.equal(saved.electrical.components.find(({id}) => id === 'part').parameters.boxStyle, boxStyle)
    assert.equal(core.adapter.compile(saved).canonical, netCanonical)
    const symbol = renderToStaticMarkup(React.createElement(SymbolBody, {
      component, pose: {...document.layout.components.part, rotation: 90, mirror: true},
    }))
    assert.match(symbol, />POWER_SENSE<\/text>/)
    assert.match(symbol, /M -48 0\s+L -24 0/)
    assert.equal(symbol.includes('<rect'), boxStyle === 'solid' || boxStyle === 'dashed')
    assert.equal(symbol.includes('stroke-dasharray="5 4"'), boxStyle === 'dashed')
  }

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

  const testPointDocument = core.document.empty()
  testPointDocument.electrical.components.push({
    id:'probe', kind:'testPoint', modelVersion:1, parameters:{mode:0,label:'Sense'},
  })
  const testPointFrame = {pinVoltages:{probe:{in:5}},componentMeasurements:{probe:{value:5}}}
  for (const [rotation, anchor] of [[0,'middle'],[90,'start'],[180,'middle'],[270,'end']]) {
    for (const mirror of [false,true]) {
      testPointDocument.layout.components.probe = {x:0,y:0,rotation,mirror}
      const html = renderToStaticMarkup(React.createElement(SymbolLayer, {
        document:testPointDocument, selected:[], frame:testPointFrame,
      }))
      const rows = html.match(/<text x="0" y="-\d+" text-anchor="([^"]+)"[^>]*><tspan x="0">Sense<\/tspan><tspan x="0" dy="([\d.]+)"[^>]*>5 V<\/tspan><\/text>/)
      assert.equal(rows?.[1], anchor)
      assert.ok(Number(rows?.[2]) > 0)
      assert.equal((html.match(/>5 V</g) ?? []).length, 1)
    }
  }

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
  const triggerTimes = Array.from({length: 41}, (_, i) => i / 10)
  const triggerChannels = [{id: 'signal', values: triggerTimes.map(t => Math.sin(t * Math.PI * 2)), min: -1, max: 1}]
  const trigger = {mode: 'normal', source: 'signal', edge: 'rising', level: 0.5}
  const rising = scopeWindow(triggerChannels, triggerTimes, 1, trigger)
  assert.equal(rising.triggered, true)
  assert.ok(Math.abs(rising.start - 2.885) < 0.01, 'Latest completed rising sweep, with interpolated crossing at 20%')
  const falling = scopeWindow(triggerChannels, triggerTimes, 1, {...trigger, edge: 'falling'})
  assert.equal(falling.triggered, true)
  assert.ok(falling.start < rising.start)
  assert.equal(scopeWindow(triggerChannels, triggerTimes, 1, {...trigger, level: 2}).times.length, 0)
  assert.deepEqual(scopeWindow(triggerChannels, triggerTimes, 1, {...trigger, mode: 'auto', level: 2}).times, scopeWindow(triggerChannels, triggerTimes, 1).times)
  assert.equal(scopeWindow(triggerChannels, triggerTimes.slice(0, 2), 1, trigger).triggered, false, 'Incomplete sweeps wait')

  const rmsDocument = structuredClone(initialDocument)
  rmsDocument.probes[0].showRms = true
  rmsDocument.probes[0].coupling = 'ac'
  const savedRmsDocument = core.document.validate(JSON.parse(JSON.stringify(rmsDocument)))
  const acquisition = core.signals.create()
  acquisition.setChannels(core.geometry.scopeChannels(savedRmsDocument).channels)
  const [voltageTrace] = acquisition.window(1).channels
  const currentTrace = {id: 'current', label: 'Current', color: '#fff', kind: 'current', showRms: true}
  const renderScopePane = (channels, times, end = 1, rendering = 'stepped', props = {}) =>
    renderToStaticMarkup(React.createElement(ScopePane, {
      id: 'scope', start: 0, end, times, timeDivision: 0.1, cursor: null,
      channels, rendering, ...props,
    }))
  const rmsVoltage = {...voltageTrace, values: new Float64Array([3, 4, 100]), min: 3, max: 100}
  const rmsCurrent = {...currentTrace, values: [0.003, -0.003, 100], min: -0.003, max: 100}
  const rmsHtml = renderScopePane([rmsVoltage, rmsCurrent], [0, 0.5, 1.1])
  assert.match(rmsHtml, />RMS 3\.536 V</)
  assert.match(rmsHtml, />RMS 3 mA</)
  assert.match(renderScopePane([
    {...rmsVoltage, values: [-5, 5], min: -5, max: 5},
    {...rmsCurrent, values: [0.003, -0.003], max: 0.003}],
    [0.5, 1],
  ), />RMS 5 V</)
  assert.match(renderScopePane([voltageTrace, {...currentTrace, values: [], min: null, max: null}], []), />RMS —</)
  assert.doesNotMatch(renderScopePane([{...rmsVoltage, showRms: undefined}, {...rmsCurrent, showRms: false}], [0, 0.5, 1.1]), />RMS /)

  const triangle = {...voltageTrace, values: [0, 1, 2, 1, 0], min: 0, max: 2, scale: 1}
  const triangleTimes = [0, 0.25, 0.5, 0.75, 1]
  const wavePath = (mode) => renderScopePane([triangle], triangleTimes, 1, mode)
    .match(/<path id="[^"]+-0" d="([^"]+)"/)?.[1]
  assert.match(wavePath('smooth'), /L\d+ \d+/)
  assert.match(wavePath('stepped'), /H\d+V\d+/)
  assert.doesNotMatch(wavePath('stepped'), /L/)

  const visualiserHtml = renderScopePane(
    [{...triangle, showRms: true}], triangleTimes, 1, 'smooth',
    {hideUi: true, cursor: 0.5, liveFraction: 0.25},
  )
  assert.match(visualiserHtml, /data-scope-trace=/)
  assert.match(visualiserHtml, /<rect x="4" y="4" width="712" height="192"/)
  assert.match(visualiserHtml, /data-scope-cursor-time="0.5" d="M182 4V196"/)
  assert.doesNotMatch(visualiserHtml, /<text\b|Scope scales|Scope traces|data-scope-cursor-value=|<title\b/)
  const lockedVisualiserHtml = renderScopePane([triangle], triangleTimes, 1, 'smooth',
    {hideUi: true, cursor: 0.5},
  )
  assert.match(lockedVisualiserHtml, /data-scope-cursor-time="0.5" d="M360 4V196"/)
  assert.doesNotMatch(lockedVisualiserHtml, /data-scope-cursor-value=/)
  const scopeVisibilityDocument = structuredClone(initialDocument)
  scopeVisibilityDocument.layout.scopes = {
    version: 1, open: true, assignments: {}, activeTraces: {}, height: 260,
    panes: {
      visualiser: {mode: 'docked', x: 0, y: 0, width: 640, height: 280, weight: 1, timeDivision: 0.1, hideUi: true},
    },
  }
  assert.equal(core.document.validate(JSON.parse(JSON.stringify(scopeVisibilityDocument)))
    .layout.scopes.panes.visualiser.hideUi, true)

  const resizedSheetScope = {width: 220, height: 100, sheetScale: 0.5}
  const placedAtHighZoom = {...resizedSheetScope, sheetScale: 1.28}
  const resizedDisplay = sheetScopeDisplay(resizedSheetScope, 0.5)
  assert.deepEqual(resizedDisplay, sheetScopeDisplay(placedAtHighZoom, 0.5))
  assert.deepEqual(resizedDisplay, {width: 440, height: 200, scale: 0.25})
  assert.deepEqual(sheetScopeDisplay({width: 440, height: 200}, 0.5),
    {width: 440, height: 200, scale: 0.5}, 'A proportional resize scales the UI with the plot')
  const tallDisplay = sheetScopeDisplay({width: 220, height: 400}, 0.5)
  assert.deepEqual(tallDisplay, {width: 440, height: 800, scale: 0.25},
    'Resizing one axis preserves the requested aspect ratio with uniform text scaling')
  const minimumSheetScope = snapSheetScopeSize(220, 100)
  assert.deepEqual(minimumSheetScope, {width: 1250, height: 600})
  assert.deepEqual(snapSheetScopeSize(1330, 680), {width: 1350, height: 700})
  assert.ok(sheetScopeDisplay(minimumSheetScope, 0.32).scale > 0.9,
    'At the standard sheet zoom the smallest scope retains near-normal text size')

  const bounds = scopeBounds(times, 2.75)
  assert.equal(nearestScopeSample(times, bounds.start, bounds.index), 2)
  assert.equal(nearestScopeSample(times, bounds.end, bounds.index), 4)
  const coordinate = (n) => n
  assert.equal(scopePath([[0, 0], [1, 0], [2, 9], [3, 0], [4, 0]], coordinate, coordinate), 'M0 0H4L8 36L12 0H16')
  assert.equal(scopePath([[0, 3], [1, 3.0001], [2, 3]], coordinate, coordinate), 'M0 12H8')

  const squareColumns = scopeColumnPath([[0.1, -1], [0.8, 1], [1.1, 1], [1.8, -1]], coordinate, coordinate, 0)
  assert.ok(squareColumns.includes('M0 -4V4'), 'Dense square transition retains both extrema at one x')
  assert.ok(squareColumns.includes('M4 -4V4'), 'Falling transition retains both extrema')
  assert.ok(!squareColumns.includes('L'), 'Dense transitions use vertical and horizontal segments')
  assert.equal(scopeColumnPath([], coordinate, coordinate, 0), '')
  const spikeColumn = scopeColumnPath([[55.1, 0], [55.2, 10], [55.3, -3], [55.9, 0]], coordinate, coordinate, 55)
  assert.ok(spikeColumn.includes('M220 -12V40'), 'Subpixel spikes and troughs survive column drawing with a plot offset')
  assert.equal(scopeColumnPath([[0, 0], [10, 1]], coordinate, coordinate, 0), 'M0 0M0 0H40V4M40 4', 'Sparse sweeps also use horizontal and vertical segments')

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
