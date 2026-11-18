import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import core from '../packages/circuit-core/index.mjs';
const doc=JSON.parse(readFileSync(new URL('../docs/new-simulator/examples/voltage-divider.json',import.meta.url),'utf8'));
const original=core.adapter.compile(doc).canonical;
const editor=core.editing.create(doc,()=>{},{wireSections:true});
const before=structuredClone(editor.document);
editor.transaction('Wire reading',d=>{d.layout.wires.w1.showVoltage=true;d.layout.wires.w1.showCurrent=true;});
assert.equal(editor.document.layout.wires.w1.showVoltage,true);
assert.equal(editor.document.layout.wires.w1.showCurrent,true);
assert.equal(core.adapter.compile(editor.document).canonical,original);
const saved=JSON.parse(JSON.stringify(editor.document));core.document.validate(saved);
const reopened=core.editing.create(saved,()=>{},{wireSections:true});reopened.replace(saved);
assert.equal(reopened.document.layout.wires.w1.showVoltage,true);
assert.equal(reopened.document.layout.wires.w1.showCurrent,true);
editor.undo();assert.deepEqual(editor.document,before);editor.redo();assert.equal(editor.document.layout.wires.w1.showVoltage,true);
const invalid=structuredClone(saved);invalid.layout.wires.w1.showVoltage='yes';assert.throws(()=>core.document.validate(invalid),/wire display/);
// A corner split keeps settings on the resulting sections, and differently
// labelled adjacent sections must not be silently merged on the next edit.
const route=core.document.empty();
for(const [id,x,y] of [['a',0,0],['b',200,200]]){route.electrical.junctions.push({id});route.layout.junctions[id]={x,y};}
route.electrical.wires.push({id:'w',from:{kind:'junction',junctionId:'a'},to:{kind:'junction',junctionId:'b'}});
route.layout.wires.w={bends:[{x:200,y:0}],showVoltage:true,showCurrent:true};
const model=core.editing.create(route,()=>{},{wireSections:true});model.replace(route);
assert.equal(model.document.electrical.wires.length,2);
for(const layout of Object.values(model.document.layout.wires)){assert.equal(layout.showVoltage,true);assert.equal(layout.showCurrent,true);}
const straight=core.document.empty();
for(const [id,x] of [['a',0],['b',100],['c',200]]){straight.electrical.junctions.push({id});straight.layout.junctions[id]={x,y:0};}
for(const [id,a,b,label] of [['one','a','b',true],['two','b','c',false]]){
 straight.electrical.wires.push({id,from:{kind:'junction',junctionId:a},to:{kind:'junction',junctionId:b}});straight.layout.wires[id]={bends:[],showVoltage:label};
}
core.editing.normalizeWires(straight);assert.equal(straight.electrical.wires.length,2);
console.log('Wire readings passed: save/open, undo/redo, electrical invariance, validation and route splitting/merging.');
