// Source inventory; deliberately does not infer semantic parity from matching labels.
import {readFileSync, writeFileSync} from 'node:fs';
import {catalog} from '../packages/circuit-core/index.mjs';
const legacy=JSON.parse(readFileSync(new URL('../docs/new-simulator/LEGACY-CATALOG.json',import.meta.url)));
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
 InductorElm:'Saturation current', TransformerElm:'Secondary polarity and saturation current',
 VoltageElm:'Internal resistance, rise/fall time and high/low-time editing',
 RailElm:'Internal resistance, rise/fall time and high/low-time editing',
 LabeledNodeElm:'Internal node and vertical text rotation',
 PotElm:'Linked groups (value visibility intentionally omitted)',
 DecimalDisplayElm:'Bit width, high logic voltage and bit order',
 LEDArrayElm:'Grid width/height, high logic voltage and bit order',
 VaractorElm:'Diode model selection',
 ProbeElm:'Scale and circular symbol (visibility intentionally omitted)',
 AmmeterElm:'Scale and circular symbol',
 OutputElm:'Scale and fixed precision (visibility intentionally omitted)'
};
const implemented = new Set(['DiodeElm','LEDElm','ZenerElm','NTransistorElm','PTransistorElm',
 'NMosfetElm','PMosfetElm','AndGateElm','NandGateElm','OrGateElm','NorGateElm','XorGateElm','XnorGateElm','TextElm','FuseElm','LDRElm','ThermistorNTCElm','ThreePhaseMotorElm']);

const rows=Object.entries(legacy.classes).filter(([,c])=>c.menuEntry).map(([name,c])=>{
 const kinds=Object.keys(catalog.definitions).filter(k=>catalog.simulationModels[k].type===String(c.dumpType));
 return {legacy:name,dumpType:c.dumpType,source:c.source,reactCandidates:kinds,legacyOptions:options(name),reactParameters:Object.fromEntries(kinds.map(k=>[k,Object.keys(catalog.definitions[k].parameters)])),status:!kinds.length?'Missing React component':confirmedGaps[name]?'Confirmed gaps: '+confirmedGaps[name]:implemented.has(name)?'Properties implemented; bundled-source review recorded in PROPERTY-PARITY.md':'Review required'};
});
const report={scope:'Bundled Falstad fork, all menu classes. Dump-type matches are candidates, not proof of equivalent behavior. Includes chip-specific methods and inherited candidate options, excludes comments. Inherited options may be restricted by subclass overrides; conditional/dynamic labels and model dialogs require manual review. Label visibility/placement controls are intentionally omitted in Wires. No row is marked complete by this inventory.',rows};
writeFileSync(new URL('../docs/new-simulator/COMPONENT-PROPERTY-AUDIT.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
const clean=s=>String(s).replaceAll('|','/').replaceAll('\n',' ');
writeFileSync(new URL('../docs/new-simulator/COMPONENT-PROPERTY-AUDIT.md',import.meta.url),`# Component property parity inventory\n\n${report.scope}\n\nRegenerate with \`node tools/audit_component_properties.mjs\`.\n\n${rows.length} original menu classes; ${rows.filter(r=>!r.reactCandidates.length).length} without a matching React dump type.\n\n| Original class | React candidates | Original editor options (including inherited) | React parameters | Status |\n|---|---|---|---|---|\n`+rows.map(r=>`| ${r.legacy} | ${r.reactCandidates.join(', ')} | ${r.legacyOptions.map(clean).join('; ')} | ${Object.entries(r.reactParameters).map(([k,p])=>k+': '+p.join(', ')).join('; ')} | ${r.status} |`).join('\n')+'\n');
console.log(`Inventoried ${rows.length} menu classes; ${rows.filter(r=>!r.reactCandidates.length).length} missing React dump types.`);
