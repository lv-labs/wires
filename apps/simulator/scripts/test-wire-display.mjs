import assert from 'node:assert/strict'
import {fileURLToPath} from 'node:url'
import {readFileSync} from 'node:fs'
import {createServer} from 'vite'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import core from '../../../packages/circuit-core/index.mjs'
import {createEngine} from '../../../tools/engine_node_runtime.mjs'
const server=await createServer({server:{middlewareMode:true,ws:false,watch:null},appType:'custom'})
try {
  const {wireSignals,voltageColour}=await server.ssrLoadModule('/src/editor/wireSignals.ts')
  const {WireLayer}=await server.ssrLoadModule('/src/editor/WireLayer.tsx')
  const {SymbolLayer}=await server.ssrLoadModule('/src/editor/SymbolLayer.tsx')
  const {advanceCurrentPhase,wireDisplayGeometry}=await server.ssrLoadModule('/src/editor/wireDisplay.ts')
  const {sheetValue}=await server.ssrLoadModule('/src/editor/componentValue.ts')
  const document=JSON.parse(readFileSync(new URL('../../../docs/new-simulator/examples/voltage-divider.json',import.meta.url),'utf8'))
  const session=core.adapter.createSession(createEngine(fileURLToPath(new URL('../../../build/engine-site',import.meta.url))));session.loadDocument(document)
  const frame=session.step(10),signals=wireSignals(document,frame)
  const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`)
  near(frame.pinCurrents.r1.a,.0025);near(frame.pinCurrents.r1.b,-.0025)
  near(signals.currents.w1,.0025);near(signals.currents.w2,.0025);near(signals.currents.w3,.0025)
  near(signals.currents.w4,.0025);near(signals.currents.w5,-.0025);near(signals.currents.w6,0)
  near(signals.voltages.w1,5);near(signals.voltages.w2,2.5);near(signals.voltages.w4,0)
  const reversed=structuredClone(document)
  for(const w of reversed.electrical.wires)[w.from,w.to]=[w.to,w.from]
  const reverseSignals=wireSignals(reversed,frame)
  for(const [id,current] of Object.entries(signals.currents))near(reverseSignals.currents[id],-current)
  const branched=structuredClone(document)
  branched.electrical.components.push({id:'r3',kind:'resistor',modelVersion:1,parameters:{resistance:1000}})
  branched.layout.components.r3={x:500,y:500,rotation:0,mirror:false}
  for(const [id,pin,junction] of [['branch','a','j-out'],['return','b','j-return']]){
    branched.electrical.wires.push({id,from:{kind:'pin',componentId:'r3',pinId:pin},to:{kind:'junction',junctionId:junction}})
    branched.layout.wires[id]={bends:[]}
  }
  session.loadDocument(branched);const branchSignals=wireSignals(branched,session.step(10))
  near(branchSignals.currents.w2,branchSignals.currents.w3-branchSignals.currents.branch)
  const loop=structuredClone(document)
  loop.electrical.wires.push({...structuredClone(loop.electrical.wires[0]),id:'parallel'});loop.layout.wires.parallel={bends:[]}
  const ambiguous=wireSignals(loop,frame);assert.equal(ambiguous.currents.w1,undefined);assert.equal(ambiguous.currents.parallel,undefined)
  const html=renderToStaticMarkup(React.createElement(WireLayer,{document,selection:[],frame,showVoltage:true,showCurrent:true,running:false}))
  assert.ok(html.includes('wire-current-dots'));assert.ok(!html.includes('wire-current-flow'),'Dots no longer depend on independent CSS dash animations')
  assert.match(html,/<polyline class="wire-current-dots"[^>]*stroke-dasharray="0 50"/,'Each active wire draws its dots with one stroke')
  for(const [dx,dy] of [[200,0],[-200,0],[0,200],[0,-200]]) {
    const points=[{x:0,y:0},{x:dx,y:dy}]
    const before=wireDisplayGeometry(points,25).dots[0]
    for(const sign of [-1,1]) {
      const phase=advanceCurrentPhase(25,sign*.0025,.016)
      const after=wireDisplayGeometry(points,phase).dots[0]
      assert.ok(((after.x-before.x)*dx+(after.y-before.y)*dy)*sign>0,'Particle moves in conventional-current direction on every orientation')
    }
  }
  const elbow=wireDisplayGeometry([{x:0,y:0},{x:100,y:0},{x:100,y:100}],5)
  assert.deepEqual(elbow.dots[2],{x:100,y:5,dx:0,dy:100})
  assert.ok(advanceCurrentPhase(25,1000,10)-25<25,'Slow frames cannot reverse the apparent repeating pattern')
  const labelled=structuredClone(document)
  labelled.layout.wires.w2.showVoltage=true;labelled.layout.wires.w2.showCurrent=true
  const labels=renderToStaticMarkup(React.createElement(WireLayer,{document:labelled,selection:[],frame,showVoltage:false,showCurrent:false}))
  assert.ok(labels.includes('2.5 V'));assert.ok(labels.includes('2.5 mA'))
  assert.match(labels,/[→←↓↑]/,'Current reading includes direction')
  const plain=renderToStaticMarkup(React.createElement(WireLayer,{document,selection:[],frame,showVoltage:false,showCurrent:false}))
  assert.ok(!plain.includes('stroke-dasharray'));assert.ok(!plain.includes('stroke="rgb('))
  assert.notEqual(voltageColour(1),voltageColour(5));assert.notEqual(voltageColour(-5),voltageColour(5))
  const opamp={id:'u',kind:'opamp',modelVersion:1,parameters:{gain:100000,minOutput:-15,maxOutput:15}}
  assert.equal(sheetValue(opamp),'')
  const opampDoc=core.document.empty();opampDoc.electrical.components.push(opamp);opampDoc.layout.components.u={x:0,y:0,rotation:0,mirror:false}
  const symbol=renderToStaticMarkup(React.createElement(SymbolLayer,{document:opampDoc,selected:[]}))
  assert.ok(!symbol.includes('15 V'),'Supplementary labels stay off the sheet')
  assert.equal(sheetValue({id:'o',kind:'output',parameters:{showVoltage:true}},{pinVoltages:{in:2.5}}),'2.5 V')
  console.log('Wire display passed: native terminal currents, branch sums, reversed directions, loop ambiguity, voltage range, paused/disabled dots and simplified labels.')
} finally {await server.close()}
