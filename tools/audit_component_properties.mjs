// Source inventory; deliberately does not infer semantic parity from matching labels.
import {readFileSync, writeFileSync} from 'node:fs';
import {catalog} from '../packages/circuit-core/index.mjs';
const output=new URL('../build/audit/',import.meta.url);
let legacy;
try{
  legacy=JSON.parse(readFileSync(new URL('legacy-classes.json',output)));
}catch(error){
  if(error.code!=='ENOENT')throw error;
  throw new Error('Run python3 tools/inventory_legacy_catalog.py before auditing component properties');
}
function options(name,seen=new Set()) {
  if(seen.has(name)||!legacy.classes[name])return [];
  seen.add(name);
  const entry=legacy.classes[name];
  // Keep quoted strings, but exclude disabled controls and choices in comments.
  const source=readFileSync(new URL('../'+entry.source,import.meta.url),'utf8')
    .replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,(match,quoted)=>quoted??'');
  let body='';
  for(const method of ['getEditInfo','getChipEditInfo']) {
    const start=source.indexOf('EditInfo '+method+'(');
    if(start>=0){const open=source.indexOf('{',start);let depth=1,end=open+1;while(depth&&end<source.length){if(source[end]==='{')depth++;if(source[end]==='}')depth--;end++;}body+=source.slice(open,end);}
  }
  const labels=[...body.matchAll(/(?:new\s+(?:EditInfo|Checkbox|Button)|EditInfo\.createCheckbox)\s*\(\s*(?:Locale\.LS\s*\(\s*)?"([^"\n]+)"/g)].map(m=>m[1]);
  return [...new Set([...labels,...options(entry.parent,seen)])];
}
const confirmedGaps = {
 SwitchElm:'Keyboard shortcut', PushSwitchElm:'Keyboard shortcut',
 DPDTSwitchElm:'Keyboard shortcut', MBBSwitchElm:'Keyboard shortcut', Switch2Elm:'Keyboard shortcut',
 CounterElm:'Variable bit width and bit order',
 DFlipFlopElm:'Set/reset pins and bit order',
 TFlipFlopElm:'Set/reset pins and bit order',
 JKFlipFlopElm:'Reset pin and bit order',
 CapacitorElm:'Series resistance', PolarCapacitorElm:'Series resistance',
 InductorElm:'Saturation current', TransformerElm:'Saturation current',
 VoltageElm:'Internal resistance, rise/fall time and high/low-time editing',
 RailElm:'Internal resistance, rise/fall time and high/low-time editing',
 LabeledNodeElm:'Internal node and vertical text rotation',
 PotElm:'Linked groups (value visibility intentionally omitted)',
 DecimalDisplayElm:'Bit width, high logic voltage and bit order',
 LEDArrayElm:'Grid width/height, high logic voltage and bit order',
 VaractorElm:'Diode model selection',
 OutputElm:'Scale and fixed precision'
};
const implemented = new Set(['DiodeElm','LEDElm','ZenerElm','NTransistorElm','PTransistorElm',
 'NMosfetElm','PMosfetElm','AndGateElm','NandGateElm','OrGateElm','NorGateElm','XorGateElm','XnorGateElm','TextElm','FuseElm','LDRElm','ThermistorNTCElm','ThreePhaseMotorElm']);

const rows=Object.entries(legacy.classes).filter(([,c])=>c.menuEntry).map(([name,c])=>{
 const kinds=Object.keys(catalog.definitions).filter(k=>catalog.simulationModels[k].type===String(c.dumpType));
 return {legacy:name,dumpType:c.dumpType,source:c.source,reactCandidates:kinds,legacyOptions:options(name),reactParameters:Object.fromEntries(kinds.map(k=>[k,Object.keys(catalog.definitions[k].parameters)])),status:!kinds.length?'Missing React component':confirmedGaps[name]?'Confirmed gaps: '+confirmedGaps[name]:implemented.has(name)?'Reviewed core properties':'Review required'};
});
const unresolvedMenuClasses=legacy.menuClasses.filter(name=>!Object.hasOwn(legacy.classes,name));
const missingReactCandidates=rows.filter(row=>!row.reactCandidates.length).length;
const report={
  scope:'Pinned Falstad source. Dump-type matches identify candidates for semantic review. Inherited options may be restricted by subclass overrides. Conditional controls and model dialogs require manual review.',
  unresolvedMenuClasses,
  rows,
};
writeFileSync(new URL('component-properties.json',output),JSON.stringify(report,null,2)+'\n');
const clean=s=>String(s).replaceAll('|','/').replaceAll('\n',' ');
const lines=[
  '# Component property parity inventory',
  '',
  report.scope,
  '',
  `${rows.length} source classes inventoried. ${missingReactCandidates} have no matching React dump type.`,
  ...(unresolvedMenuClasses.length?[`Menu entries without a parsed class: ${unresolvedMenuClasses.join(', ')}.`]:[]),
  '',
  '| Original class | React candidates | Original editor options (including inherited) | React parameters | Status |',
  '|---|---|---|---|---|',
  ...rows.map(row=>`| ${row.legacy} | ${row.reactCandidates.join(', ')} | ${row.legacyOptions.map(clean).join('; ')} | ${Object.entries(row.reactParameters).map(([kind,keys])=>kind+': '+keys.join(', ')).join('; ')} | ${row.status} |`),
];
writeFileSync(new URL('component-properties.md',output),lines.join('\n')+'\n');
console.log(`Inventoried ${rows.length} menu classes; ${missingReactCandidates} missing React dump types and ${unresolvedMenuClasses.length} without a parsed source class.`);
