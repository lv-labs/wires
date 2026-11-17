import {editing as CircuitEditorModel} from '../packages/circuit-core/index.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import '../apps/simulator/src/editor/menu/legacy-component-menu.js';
import '../apps/simulator/src/editor/menu/component-menu.js';
const tree=CircuitLegacyComponentMenu,M=CircuitEditorModel;
const expected=JSON.parse(execFileSync('python3',['-c',"import json,runpy; print(json.dumps(runpy.run_path('tools/generate_component_menu.py')['extract_menu']()))"],{encoding:'utf8'}));
assert.deepEqual(tree,expected,'Generated menu exactly matches current bundled source');
assert.deepEqual(tree.map(e=>e.label),['Add Wire','Add Routed Wire','Add Resistor','Passive Components','Inputs and Sources','Outputs and Labels','Active Components','Active Building Blocks','Logic Gates, Input and Output','Digital Chips','Analog and Hybrid Chips','Subcircuits','Drag','Select/Drag Sel']);
const source=readFileSync('engine/upstream/src/com/lushprojects/circuitjs1/client/Menus.java','utf8').split('public void composeMainMenu(')[1].split('void makeClassCheckItems(')[0];
const overrides=JSON.parse(readFileSync('apps/simulator/src/editor/menu/legacy-menu-overrides.json','utf8'));
assert.deepEqual(overrides,{excludedClasses:['NortonAmpElm'],labels:{LatchElm:'Add Latch'}},'Only recorded migration menu differences are permitted');
const sourcePairs=[...source.matchAll(/"(Add [^"\n]*)", "([^"\n]*)"/g)].map(m=>({label:m[1],legacyClass:m[2]})).filter(e=>!overrides.excludedClasses.includes(e.legacyClass)).map(e=>({...e,label:overrides.labels[e.legacyClass]??e.label}));
const leaves=tree.flatMap(e=>e.children||[e]).filter(e=>e.legacyClass);
assert.deepEqual(leaves.filter(e=>e.label.startsWith('Add ')).map(e=>JSON.stringify(e)).sort(),sourcePairs.map(e=>JSON.stringify(e)).sort(),'Every legacy component appears once, including named subcircuits and unresolved classes');
const resolved=CircuitComponentMenu.entries(M.placementDefinitions),available=resolved.flatMap(e=>e.children||[e]);
for(const entry of available){if(entry.available)assert.ok(['wire','select'].includes(entry.tool)||M.placementDefinitions[entry.tool]);else assert.ok(!entry.tool&&entry.reason);}
for(const [label,tool] of [['Add Resistor','resistor'],['Add Counter','counter'],['Add Latch','latch'],['Add Adder','fullAdder'],['Add Half Adder','halfAdder'],['Add Clock','clockRail'],['Add Op Amp (ideal, + on top)','opampPlusTop'],['Add Op Amp (ideal, - on top)','opampMinusTop']])assert.equal(available.find(e=>e.label===label).tool,tool);
assert.equal(available.find(e=>e.legacyClass==='CustomCompositeElm:~LM317-v2').available,false);
assert.equal(available.find(e=>e.legacyClass==='PushSwitchElm').tool,'pushSwitch','Momentary switch has its own tool');
assert.equal(available.find(e=>e.legacyClass==='RoutedWireElm').available,false);
assert.equal(available.find(e=>e.legacyClass==='WireElm').tool,'wire');
assert.ok(resolved.find(e=>e.label==='Outputs and Labels').children.every(e=>e.available),'Every output/label entry has a real editor tool');
assert.equal(available.find(e=>e.legacyClass==='VarRailElm').tool,'variableVoltage');
const clock=M.placementDefinitions.clockRail.parameters.waveform;assert.deepEqual(clock,{kind:'square',amplitude:2.5,frequency:100,offset:2.5,dutyCycle:.5});
for(const preset of ['clockRail','squareRail','opamp','opampPlusTop','opampMinusTop']){
 const model=M.create(M.empty());model.addComponent(preset,0,0,preset==='opampMinusTop'?180:0,preset==='opampMinusTop');M.validate(model.document);
 if(preset.startsWith('opamp')){
  const c=model.document.electrical.components[0],plus=M.pin(model.document,{kind:'pin',componentId:c.id,pinId:'plus'}),minus=M.pin(model.document,{kind:'pin',componentId:c.id,pinId:'minus'});assert.ok(preset==='opampMinusTop'?minus.y<plus.y:plus.y<minus.y,preset+' polarity matches placement');assert.ok(M.pin(model.document,{kind:'pin',componentId:c.id,pinId:'out'}).x>plus.x,preset+' output faces right');
 }
}
console.log(`Falstad menu checks passed: ${leaves.length} original entries, exact hierarchy/names/order, guarded availability and source/orientation presets.`);
