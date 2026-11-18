// Measure bundled text-import coverage without treating rejected circuits as successes.
import {readdir,readFile} from 'node:fs/promises';
import core from '../packages/circuit-core/index.mjs';
const directory=new URL('../engine/upstream/src/com/lushprojects/circuitjs1/public/circuits/',import.meta.url);
const files=(await readdir(directory)).filter(name=>name.endsWith('.txt')).sort();
const failures={},warnings={},imported=[],simulationBlocked=[];
let compilable=0;
for(const name of files) {
  const result=core.falstad.importText(await readFile(new URL(name,directory),'utf8'),{title:name});
  if(result.document){
    imported.push(name);
    try{core.adapter.compile(result.document);compilable++;}
    catch(error){simulationBlocked.push({file:name,message:error.message});}
  }
  for(const message of new Set(result.diagnostics.map(d=>`${d.severity}: ${d.message}`))) {
    const counts=message.startsWith('error:')?failures:warnings;counts[message]=(counts[message]||0)+1;
  }
}
console.log(JSON.stringify({total:files.length,converted:imported.length,compilable,simulationBlocked,blocked:files.length-imported.length,importedFiles:imported,blockers:Object.fromEntries(Object.entries(failures).sort((a,b)=>b[1]-a[1])),warnings},null,2));
