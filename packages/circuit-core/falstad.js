'use strict';
// Import coordinate-based CircuitJS text into the explicit Wires graph.
(() => {
  const registry=globalThis.CircuitCoreModules ||= {};
  const common=typeof module==='object'&&module.exports;
  const Catalog=common?require('./catalog.js'):registry.catalog;
  const Document=common?require('./document.js'):registry.document;
  const Geometry=common?require('./geometry.js'):registry.geometry;
  const XML=common?require('./falstad-xml.js'):registry.falstad_xml;
  const types={r:'resistor',c:'capacitor',l:'inductor',v:'voltageSource',R:'voltageRail',g:'ground',i:'currentSource',s:'switch',O:'output',L:'logicInput',M:'logicOutput',d:'diode',a:'opamp',S:'spdtSwitch','172':'variableVoltage','174':'potentiometer'};
  function importText(text, options={}) {
    const diagnostics=[], records=[];
    const diagnostic=(severity,line,code,message)=>diagnostics.push({severity,line,code,message});
    if(typeof text!=='string'||text.length>5_000_000)return {document:null,diagnostics:[{severity:'error',line:0,code:'INVALID_INPUT',message:'Expected circuit text smaller than 5 MB'}]};
    if(text.trimStart().startsWith('<')) {
      const converted=XML.toLegacy(text);
      if(converted.diagnostics.some(d=>d.severity==='error'))return {document:null,diagnostics:converted.diagnostics};
      const result=importText(converted.text,options);
      result.diagnostics=result.diagnostics.map(d=>({...d,line:d.line?converted.sourceLines[d.line-1]||d.line:0}));
      return result;
    }
    const doc={schemaVersion:1,id:options.id||'falstad-import',title:options.title||'Imported Falstad circuit',electrical:{components:[],junctions:[],wires:[]},layout:{components:{},junctions:{},wires:{}},probes:[],simulation:{timeStep:5e-6}};
    let header=false,legacyGrid=16;
    const lines=text.replace(/^\uFEFF/,'').split(/\r\n|\r|\n/);
    for(let index=0;index<lines.length;index++) {
      const raw=lines[index].trim(); if(!raw)continue;
      const tokens=raw.split(/\s+/),type=tokens.shift(),line=index+1;
      const number=(i,fallback)=>{const value=tokens[i]===undefined?fallback:Number(tokens[i]);if(!Number.isFinite(value))throw new Error(`Invalid or missing numeric field ${i+1}`);return value;};
      const flagsAllowed=(flags,mask)=>{if((flags&mask)!==flags)throw new Error(`Unsupported flags ${flags} for ${type}`);};
      try {
        if(type==='$') {
          if(header)throw new Error('Multiple circuit headers');header=true;
          const flags=number(0);if(!Number.isSafeInteger(flags)||flags<0||flags>255)throw new Error('Invalid circuit flags');doc.simulation.timeStep=number(1);
          if(doc.simulation.timeStep<=0)throw new Error('Timestep must be positive');
          legacyGrid=flags&2?8:16;
          if(flags&192)throw new Error('Adaptive timestep and automatic DC operating point are not supported');
          continue;
        }
        if(['o','h','&','38'].includes(type)) {
          diagnostic('warning',line,'UNSUPPORTED_PRESENTATION',`${type==='o'?'Scope':type==='h'?'Hint':'Slider'} settings are not imported yet`);continue;
        }
        if(type!=='w'&&!Object.hasOwn(types,type)) {
          diagnostic('error',line,'UNSUPPORTED_RECORD',`Unsupported Falstad record ${type}`);continue;
        }
        const [x1,y1,x2,y2,flags]=[0,1,2,3,4].map(i=>number(i));
        if(![x1,y1,x2,y2,flags].every(Number.isSafeInteger)||flags<0)throw new Error('Coordinates and flags must be safe integers');
        const record={type,line,x1,y1,x2,y2,flags};
        if(type==='w'){flagsAllowed(flags,3);if(tokens.length>5)throw new Error('Unexpected wire fields');records.push(record);continue;}
        let kind=types[type],parameters={},maxFields=5;
        if(type==='r'){flagsAllowed(flags,1);parameters={resistance:number(5)};maxFields=6;}
        if(type==='c') {
          flagsAllowed(flags,7);parameters={capacitance:number(5),initialVoltage:number(7,1e-3),integration:flags&2?'backwardEuler':'trapezoidal'};
          number(6);if((flags&4)&&number(8,0)!==0)throw new Error('Capacitor series resistance is not supported');maxFields=flags&4?9:8;
          diagnostic('warning',line,'RESET_STATE','Capacitor starts at its initial voltage, rather than the saved running voltage');
        }
        if(type==='l') {
          flagsAllowed(flags,3);parameters={inductance:number(5),initialCurrent:number(7,0),integration:flags&2?'backwardEuler':'trapezoidal'};
          number(6);if(number(8,0)!==0)throw new Error('Inductor saturation is not supported');maxFields=9;
          diagnostic('warning',line,'RESET_STATE','Inductor starts at its initial current, rather than the saved running current');
        }
        if(type==='172') {
          flagsAllowed(flags,95);if(![6,7].includes(number(5)))throw new Error('Expected variable-voltage waveform');
          parameters={minVoltage:number(8,0),maxVoltage:number(7,5),voltage:number(6,5),label:tokens.slice(11).join(' ').replace(/%2b/ig,'+')||'Voltage'};maxFields=tokens.length;
        }
        if(type==='174') {
          flagsAllowed(flags,7);parameters={resistance:number(5),position:number(6),label:tokens.slice(7).join(' ')||'Resistance'};maxFields=tokens.length;
          const dx=x2-x1,dy=y2-y1;let end,offset;
          if((Math.abs(dx)>Math.abs(dy))!==!!(flags&2)){
            end={x:x1+2*legacyGrid*Math.sign(dx)*Math.ceil(Math.abs(dx)/(2*legacyGrid)),y:y1};offset=dx<0?dy:-dy;
          }else{end={x:x1,y:y1+2*legacyGrid*Math.sign(dy)*Math.ceil(Math.abs(dy)/(2*legacyGrid))};offset=dy>0?dx:-dx;}
          if(!offset)offset=flags&4?-legacyGrid:legacyGrid;
          const length=Math.hypot(end.x-x1,end.y-y1);if(!length)throw new Error('Zero-length potentiometer');
          record.posts=[{x:x1,y:y1},end,{x:(x1+end.x)/2+offset*(end.y-y1)/length,y:(y1+end.y)/2-offset*(end.x-x1)/length}];
        }
        if(type==='S') {
          flagsAllowed(flags,3);if(!['true','false'].includes(tokens[6]))throw new Error('Invalid SPDT momentary state');
          if(number(8,2)!==2)throw new Error('Only two-throw switches are supported by this importer');
          parameters={position:number(5),momentary:tokens[6]==='true',group:number(7,0),throwCount:2,centerOff:!!(flags&1)};maxFields=9;
          const length=Math.hypot(x2-x1,y2-y1);if(!length)throw new Error('Zero-length SPDT switch');
          const dx=16*(y2-y1)/length,dy=-16*(x2-x1)/length;
          record.posts=[{x:x1,y:y1},{x:x2+dx,y:y2+dy},{x:x2-dx,y:y2-dy}];
          if(x1!==x2&&y1!==y2)throw new Error('Diagonal SPDT switch geometry is not supported');
        }
        if(type==='i'){flagsAllowed(flags,1);const current=number(5,.01);parameters={current:current===0?.01:current,maxVoltage:number(6,0)};maxFields=7;}
        if(type==='O'){flagsAllowed(flags,3);parameters={showVoltage:!!(flags&1)};number(5,0);maxFields=6;}
        if(type==='L') {
          flagsAllowed(flags,3);const state=tokens[5]==='true'?0:tokens[5]==='false'?1:number(5);
          if(tokens[6]!=='false')throw new Error('Momentary logic input is not supported');
          parameters={state,highVoltage:number(7,5),lowVoltage:number(8,0),mode:flags&1?'ternary':flags&2?'numeric':'logic'};maxFields=9;
        }
        if(type==='M'){flagsAllowed(flags,7);parameters={threshold:number(5,2.5),mode:flags&1?'ternary':flags&2?'numeric':'logic',pulldown:!!(flags&4)};maxFields=6;}
        if(type==='d') {
          flagsAllowed(flags,3);
          if(flags&2){parameters={model:tokens[5]};Catalog.resolveDiodeModel(parameters.model);}
          else if(!(flags&1)||number(5,.805904783)===.805904783)parameters={model:'default'};
          else parameters={model:{name:`Imported diode ${line}`,mode:'advanced',saturationCurrent:1/Math.expm1(number(5)/(.025865*2)),breakdownVoltage:0,seriesResistance:0,emissionCoefficient:2}};
          maxFields=flags?6:5;
        }
        if(type==='a') {
          flagsAllowed(flags,15);
          parameters={maxOutput:number(5,15),minOutput:number(6,-15),gain:flags&8?number(10):flags&4?1000:100000};
          maxFields=11;
          if(x1===x2&&y1===y2||x1!==x2&&y1!==y2)throw new Error('Zero-length or diagonal op-amp layout is not supported');
          const length=Math.hypot(x2-x1,y2-y1),sign=x1===x2?Math.sign(y2-y1):Math.sign(x2-x1);
          const hs=(flags&2?8:16)*sign*(flags&1?-1:1);
          record.posts=[{x:x1+hs*(y2-y1)/length,y:y1-hs*(x2-x1)/length},{x:x1-hs*(y2-y1)/length,y:y1+hs*(x2-x1)/length},{x:x2,y:y2}];
        }
        if(type==='g'){flagsAllowed(flags,1);number(5,0);maxFields=6;}
        if(type==='s') {
          flagsAllowed(flags,3);const position=tokens[5]==='true'?1:tokens[5]==='false'?0:number(5);
          if(![0,1].includes(position)||!['true','false'].includes(tokens[6]))throw new Error('Unsupported switch state');
          kind=tokens[6]==='true'?'pushSwitch':'switch';parameters=kind==='pushSwitch'?{normallyClosed:position===0}:{closed:position===0};maxFields=7;
        }
        if(type==='v'||type==='R') {
          flagsAllowed(flags,31|64);const code=number(5,0),frequency=number(6,40),amplitude=number(7,5),offset=number(8,0),phase=flags&2?Math.PI/2:number(9,0);
          const waveformKind=['dc','sine','square','triangle','sawtooth','pulse'][code];
          if(!waveformKind)throw new Error(`Unsupported waveform ${code}`);
          const waveform=code===0?{kind:'dc',voltage:amplitude+offset}:{kind:waveformKind,frequency,amplitude,offset,phase};
          if(code===2||code===5)waveform.dutyCycle=code===5&&!(flags&4)?1/(2*Math.PI):number(10,.5);
          parameters={waveform};maxFields=11;
        }
        if(tokens.length>maxFields)throw new Error('Unexpected fields (unsupported record variant)');
        const pins=Catalog.componentModel({kind,parameters}).postOrder;
        if(pins.length===2&&x1===x2&&y1===y2)throw new Error('Zero-length component layout is not supported');
        records.push({...record,kind,parameters,pins});
      }catch(error){diagnostic('error',line,'UNSUPPORTED_OR_INVALID_RECORD',error.message);}
    }
    if(!records.some(r=>r.kind))diagnostic('error',0,'EMPTY_CIRCUIT','No supported components found');
    if(diagnostics.some(d=>d.severity==='error'))return {document:null,diagnostics};
    // Scale all legacy coordinates together, leaving room for fixed-size symbols.
    // Connectivity is always derived from original posts, never snapped artwork.
    const gcd=(a,b)=>b?gcd(b,a%b):a;
    let unit=0;
    for(const r of records)for(const value of [r.x1,r.y1,r.x2,r.y2,...(r.posts||[]).flatMap(p=>[p.x,p.y])])unit=gcd(unit,Math.abs(value));
    const scaleUnit=2*Catalog.grid/(unit||16);
    let scale=scaleUnit;
    for(const r of records.filter(r=>r.pins?.length===2)) {
      const offsets=Catalog.componentPins({kind:r.kind,parameters:r.parameters});
      const [a,b]=r.pins.map(id=>offsets[id]);
      scale=Math.max(scale,(Math.hypot(b[0]-a[0],b[1]-a[1])+2*Catalog.grid)/Math.hypot(r.x2-r.x1,r.y2-r.y1));
    }
    for(const r of records.filter(r=>r.type==='a'))scale=Math.max(scale,800/Math.hypot(r.x2-r.x1,r.y2-r.y1),150/(r.flags&2?8:16));
    for(const r of records.filter(r=>r.type==='S'||r.type==='174'))scale=Math.max(scale,600/Math.hypot(r.posts[1].x-r.posts[0].x,r.posts[1].y-r.posts[0].y));
    scale=Math.ceil(scale/scaleUnit)*scaleUnit;
    const points=new Map();
    function junction(x,y) {
      const key=`${x},${y}`;if(points.has(key))return points.get(key);
      const id=`j${points.size+1}`,ref={kind:'junction',junctionId:id};points.set(key,ref);
      doc.electrical.junctions.push({id});doc.layout.junctions[id]={x:x*scale,y:y*scale};return ref;
    }
    function wire(from,to) {
      const id=`w${doc.electrical.wires.length+1}`;doc.electrical.wires.push({id,from,to});doc.layout.wires[id]={bends:[]};
    }
    for(const r of records) {
      const start=junction(r.x1,r.y1);
      if(r.type==='w'){wire(start,junction(r.x2,r.y2));continue;}
      const id=`c${r.line}`,component={id,kind:r.kind,modelVersion:1,parameters:r.parameters};
      doc.electrical.components.push(component);r.componentId=id;
      const offsets=Catalog.componentPins(component),first=offsets[r.pins[0]];
      let rotation=0;
      if(r.type==='S'||r.type==='174') {
        const start=r.posts[0],end=r.type==='S'?{x:r.x2,y:r.y2}:r.posts[1];
        rotation=((Math.round(Math.atan2(end.y-start.y,end.x-start.x)/(Math.PI/2))*90)%360+360)%360;
        const sidePin=r.type==='S'?offsets.a:offsets.wiper;
        const side=Geometry.rotateOffset(...sidePin,rotation);
        const original=r.type==='S'?{x:r.posts[1].x-end.x,y:r.posts[1].y-end.y}:{x:r.posts[2].x-(start.x+end.x)/2,y:r.posts[2].y-(start.y+end.y)/2};
        const mirror=side[0]*original.x+side[1]*original.y<0;
        if(mirror)rotation=(rotation+180)%360;
        doc.layout.components[id]={x:(start.x+end.x)*scale/2,y:(start.y+end.y)*scale/2,rotation,mirror};
        for(let i=0;i<3;i++)wire({kind:'pin',componentId:id,pinId:r.pins[i]},junction(r.posts[i].x,r.posts[i].y));
        continue;
      }else if(r.type==='a') {
        rotation=((Math.round(Math.atan2(r.y2-r.y1,r.x2-r.x1)/(Math.PI/2))*90)%360+360)%360;
        const minus=Geometry.rotateOffset(...offsets.minus,rotation);
        const side={x:r.posts[0].x-r.x1,y:r.posts[0].y-r.y1};
        const mirror=minus[0]*side.x+minus[1]*side.y<0;
        if(mirror)rotation=(rotation+180)%360;
        doc.layout.components[id]={x:(r.x1+r.x2)*scale/2,y:(r.y1+r.y2)*scale/2,rotation,mirror};
        for(let i=0;i<3;i++)wire({kind:'pin',componentId:id,pinId:r.pins[i]},junction(r.posts[i].x,r.posts[i].y));
        continue;
      }else if(r.pins.length===2) {
        const last=offsets[r.pins[1]],angle=Math.atan2(r.y2-r.y1,r.x2-r.x1)-Math.atan2(last[1]-first[1],last[0]-first[0]);
        rotation=((Math.round(angle/(Math.PI/2))*90)%360+360)%360;
        const midpoint=[(first[0]+last[0])/2,(first[1]+last[1])/2];
        const [dx,dy]=Geometry.rotateOffset(...midpoint,rotation);
        doc.layout.components[id]={x:(r.x1+r.x2)*scale/2-dx,y:(r.y1+r.y2)*scale/2-dy,rotation,mirror:false};
      }else {
        // Ground's body follows its legacy handle; rail artwork points away from its post.
        const angle=r.kind==='ground'?Math.atan2(r.y2-r.y1,r.x2-r.x1)-Math.PI/2:Math.atan2(r.y2-r.y1,r.x2-r.x1)+Math.PI/2;
        rotation=((Math.round(angle/(Math.PI/2))*90)%360+360)%360;
        const [dx,dy]=Geometry.rotateOffset(...first,rotation);
        doc.layout.components[id]={x:r.x1*scale-dx,y:r.y1*scale-dy,rotation,mirror:false};
      }
      wire({kind:'pin',componentId:id,pinId:r.pins[0]},start);
      if(r.pins.length===2)wire({kind:'pin',componentId:id,pinId:r.pins[1]},junction(r.x2,r.y2));
    }
    // Match Falstad's implicit first-source ground rule explicitly, since Wires
    // compiles components to private coordinates rather than original posts.
    if(!records.some(r=>r.kind==='ground'||r.kind==='voltageRail'||r.kind==='variableVoltage')) {
      const source=records.find(r=>r.kind==='voltageSource');
      if(source) {
        const id='implicit-ground';doc.electrical.components.push({id,kind:'ground',modelVersion:1,parameters:{}});
        doc.layout.components[id]={x:source.x1*scale,y:source.y1*scale,rotation:0,mirror:false};
        wire({kind:'pin',componentId:id,pinId:'g'},junction(source.x1,source.y1));
      }
    }
    try {Document.validate(doc);}catch(error){diagnostic('error',0,'INVALID_DOCUMENT',error.message);return {document:null,diagnostics};}
    return {document:doc,diagnostics};
  }
  const api=Object.freeze({importText});registry.falstad=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})();
