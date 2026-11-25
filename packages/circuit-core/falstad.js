'use strict';
// Import coordinate-based CircuitJS text into the explicit Wires graph.
(() => {
  const registry=globalThis.CircuitCoreModules ||= {};
  const common=typeof module==='object'&&module.exports;
  const Catalog=common?require('./catalog.js'):registry.catalog;
  const Document=common?require('./document.js'):registry.document;
  const Geometry=common?require('./geometry.js'):registry.geometry;
  const XML=common?require('./falstad-xml.js'):registry.falstad_xml;
  const Scopes=common?require('./falstad-scopes.js'):registry.falstad_scopes;
  const types={
    r:'resistor',c:'capacitor',l:'inductor',v:'voltageSource',R:'voltageRail',g:'ground',
    i:'currentSource',s:'switch',O:'output',L:'logicInput',M:'logicOutput',d:'diode',z:'zener','162':'led',
    a:'opamp',S:'spdtSwitch',t:'npn',f:'nmos',j:'njfet',p:'voltmeter',I:'inverter',n:'noiseSource',A:'antennaSource',T:'transformer',m:'memristor',
    '150':'andGate','151':'nandGate','152':'orGate','153':'norGate','154':'xorGate','431':'xnorGate',
    '155':'dFlipFlop','156':'jkFlipFlop','193':'tFlipFlop','165':'timer555',
    '163':'ringCounter','164':'counter','421':'loadCounter',
    '159':'analogSwitch','160':'analogSpdtSwitch','182':'schmittTrigger','183':'invertingSchmittTrigger',
    '169':'tappedTransformer','170':'sweepSource','171':'transmissionLine','172':'variableVoltage','173':'triode','174':'potentiometer',
    '175':'tunnelDiode','176':'varactor','177':'scr','178':'relay','179':'currentConveyor','181':'lamp','187':'sparkGap','207':'labeledNode',
    '200':'amSource','201':'fmSource','203':'diac','206':'triac','211':'audioOutput',
    '212':'vcvs','213':'vccs','214':'ccvs','215':'cccs',
    '157':'sevenSegment','209':'polarizedCapacitor','368':'testPoint','370':'ammeter','405':'ledArray','419':'decimalDisplay',
  };
  const quarterTurn=angle=>((Math.round(angle/(Math.PI/2))*90)%360+360)%360;
  const midpoint=(a,b)=>({x:a.x+(b.x-a.x)/2,y:a.y+(b.y-a.y)/2});
  const sidePins={a:'minus',S:'a',t:'collector',f:'source',j:'source','159':'control','160':'a','173':'plate','174':'wiper','177':'gate','206':'gate'};
  const drawingKinds={x:'text',b:'box','423':'line'};
  const textEscapes={n:'\n',r:'\r',s:' ',p:'+',q:'=',h:'#',a:'&'};
  const unescapeText=text=>text==='\\0'?'':text.replace(/\\(.)/gs,(_,key)=>textEscapes[key]??key);
  const oldLedModel={name:'old-default-led',mode:'advanced',saturationCurrent:2.2349907006671927e-18,seriesResistance:0,emissionCoefficient:2,breakdownVoltage:0};
  const flipFlopPosts={
    '155':[[-1,0],[2,0],[2,2],[-1,1]],
    '156':[[-1,0],[-1,1],[-1,2],[2,0],[2,2]],
    '193':[[-1,0],[2,0],[2,2],[-1,1]],
  };

  function chipLayout({x1,y1,flags},offsets,columns,rows,pins,anchorRow=(rows-1)/2,anchorColumn=(columns-1)/2) {
    const spacing=flags&1?16:32;
    const transpose=!!(flags&4096),flipX=!!(flags&1024),flipY=!!(flags&2048);
    const point=(column,row)=>{
      let [x,y]=transpose?[row,column]:[column,row];
      if(flipX)x=(transpose?rows:columns)-1-x;
      if(flipY)y=(transpose?columns:rows)-1-y;
      return {x:x1+spacing*(1+x),y:y1+spacing*y};
    };
    const start=point(-1,0),end=point(columns,0),mirror=(transpose!==flipX)!==flipY;
    const direction=mirror?-1:1;
    const rotation=quarterTurn(Math.atan2(direction*(end.y-start.y),direction*(end.x-start.x)));
    return {anchor:point(anchorColumn,anchorRow),offsets,rotation,mirror,originOffset:[0,0],
      posts:pins.map(([column,row])=>point(column,row)),
      along:transpose?'y':'x',across:transpose?'x':'y',minScale:400/(3*spacing)};
  }

  function diodeModel(drop,breakdown,line) {
    if(drop===.805904783&&breakdown===0)return 'default';
    if(drop===.805904783&&breakdown===5.6)return 'default-zener';
    if(drop===2.1024259&&breakdown===0)return {...oldLedModel};
    return {name:`Imported diode ${line}`,mode:'advanced',saturationCurrent:1/Math.expm1(drop/(.025865*2)),breakdownVoltage:breakdown,seriesResistance:0,emissionCoefficient:2};
  }

  function annotationText(tokens,escaped) {
    const text=tokens.join(' ');
    const decoded=escaped?unescapeText(text):text.replace(/%2b/ig,'+');
    return decoded.replace(/\\(.)/gs,(_,key)=>key==='n'?'\n':key).replace(/\r\n?/g,'\n');
  }

  function rectangularLayout(offsets,posts,start,end,corner,first,last,side) {
    const dx=end.x-start.x,dy=end.y-start.y;
    const along=dx?'x':'y',across=dx?'y':'x';
    const localX=offsets[last][0]-offsets[first][0],localY=offsets[last][1]-offsets[first][1];
    const sideX=localX?0:offsets[side][0]-offsets[first][0];
    const sideY=localX?offsets[side][1]-offsets[first][1]:0;
    let rotation=quarterTurn(Math.atan2(dy,dx)-Math.atan2(localY,localX));
    const [rx,ry]=Geometry.rotateOffset(sideX,sideY,rotation);
    const mirror=(dx?ry:rx)*(corner[across]-start[across])<0;
    if(mirror&&localX)rotation=(rotation+180)%360;
    const span=Math.hypot(localX,localY)+2*Catalog.grid;
    const minScale=Math.max(span/Math.hypot(dx,dy),Math.hypot(sideX,sideY)/Math.abs(corner[across]-start[across]));
    return {anchor:midpoint(start,corner),offsets,rotation,mirror,originOffset:[0,0],posts,along,across,minScale};
  }

  function thyristorPosts({type,x1,y1,x2,y2,flags},grid) {
    const dx=x2-x1,dy=y2-y1,horizontal=Math.abs(dx)>Math.abs(dy);
    const end={x:horizontal?x2:x1,y:horizontal?y1:y2};
    // Legacy SCRs used the diagonal length even after straightening the main posts.
    const length=type==='177'&&!(flags&1)?Math.hypot(dx,dy):Math.max(Math.abs(dx),Math.abs(dy));
    const leadLength=(length-16)/2;
    const gateLength=grid+leadLength%grid;
    if(leadLength<gateLength)throw new Error('Thyristor is too short for a gate post');
    const direction=(horizontal?-1:1)*Math.sign(dx)*Math.sign(dy)||1;
    const fraction=(length+16)/(2*length);
    const round=value=>Math.floor(value+.48);
    const lead={x:round(x1*(1-fraction)+end.x*fraction),y:round(y1*(1-fraction)+end.y*fraction)};
    const gateFraction=gateLength/leadLength;
    const side=2*grid*direction;
    const gate={
      x:round(lead.x*(1-gateFraction)+end.x*gateFraction+(horizontal?0:Math.sign(dy)*side)),
      y:round(lead.y*(1-gateFraction)+end.y*gateFraction-(horizontal?Math.sign(dx)*side:0)),
    };
    if(type==='177'){
      const snap=value=>Math.floor((value+grid/2-1)/grid)*grid;
      gate.x=snap(gate.x);gate.y=snap(gate.y);
    }
    return [{x:x1,y:y1},end,gate];
  }

  function symbolLayout(record,component) {
    const {type,pins,x1,y1,x2,y2}=record;
    const start={x:x1,y:y1},end=['174','177','206'].includes(type)?record.posts[1]:{x:x2,y:y2};
    const offsets=Catalog.componentPins(component),first=offsets[type==='173'?'grid':pins[0]];
    const dx=end.x-start.x,dy=end.y-start.y;
    if(Object.hasOwn(flipFlopPosts,type))return chipLayout(record,offsets,2,3,flipFlopPosts[type]);
    if(Catalog.counterKind(component.kind)){
      const {columns,rows,pins,anchorRow,anchorColumn}=Catalog.counterLayout(component.kind,component.parameters);
      const posts=pins.map(([,column,row])=>[column,row]);
      const layout=chipLayout(record,offsets,columns,rows,posts,anchorRow,anchorColumn);
      const minScale=(component.kind==='ringCounter'?50:100)/(record.flags&1?16:32);
      return {...layout,minScale,postAxes:posts.map(([,row])=>row<0||row>=rows?layout.across:layout.along)};
    }
    if(type==='178'){
      const {poleCount,coilStyle}=component.parameters,len=Math.hypot(dx,dy);
      const direction=(dy===0?Math.sign(dx):Math.sign(dy))*(record.flags&8?-1:1);
      const mirror=direction<0;
      const rotation=quarterTurn(Math.atan2(dy,dx)+(mirror?Math.PI:0));
      const posts=Catalog.relayPostOffsets(poleCount,coilStyle).map(([along,across])=>({
        x:Math.floor(x1+along*dx-across*16*direction*dy/len+.48),
        y:Math.floor(y1+along*dy+across*16*direction*dx/len+.48),
      }));
      const along=Math.abs(dx)>=Math.abs(dy)?'x':'y';
      return {anchor:midpoint(start,end),offsets,rotation,mirror,originOffset:[0,0],posts,
        along,across:along==='x'?'y':'x',minScale:Math.max(50/16,200/len)};
    }
    if(type==='165'){
      const layout=chipLayout(record,offsets,3,5,Catalog.timerPostOffsets.slice(0,pins.length));
      return {...layout,minScale:Catalog.grid/(record.flags&1?16:32)};
    }
    if(type==='179'){
      const layout=chipLayout(record,offsets,2,3,Catalog.conveyorPostOffsets);
      return {...layout,minScale:(offsets.z[0]-offsets.x[0])/(3*(record.flags&1?16:32))};
    }
    if(Catalog.controlledSourceKind(component.kind)){
      const {inputCount}=component.parameters;
      const posts=Catalog.controlledSourcePosts(component.kind,inputCount).map(([,column,row])=>[column,row]);
      const layout=chipLayout(record,offsets,2,Math.max(2,inputCount),posts,0);
      return {...layout,minScale:200/(3*(record.flags&1?16:32))};
    }
    if(Catalog.displayChipKind(component.kind)){
      const {columns,rows,pins}=Catalog.displayChipLayout(component.kind,component.parameters);
      const posts=pins.map(([,column,row])=>[column,row]);
      const layout=chipLayout(record,offsets,columns,rows,posts);
      const smaller=Math.min(columns,rows);
      const span=type==='157'?50:type==='405'?100*(smaller+2)/(smaller+1):400/3;
      const minScale=span/(record.flags&1?16:32);
      return {...layout,minScale,postAxes:posts.map(([,row])=>row===rows?layout.across:layout.along)};
    }
    if(type==='171') {
      return rectangularLayout(offsets,record.posts,start,end,record.posts[1],'left','right','leftReturn');
    }
    if(type==='T'||type==='169') {
      const posts=record.posts;
      const primaryEnd=posts[pins.indexOf('p2')];
      const corner=posts[pins.indexOf(component.parameters.reverseSecondary?'s1':'s2')];
      return rectangularLayout(offsets,posts,start,primaryEnd,corner,'p1','p2','s1');
    }
    if(pins.length===1) {
      // Ground and rails attach at the symbol origin. Markers have a lead offset.
      let bodyAngle=-Math.PI/2;
      if(component.kind==='ground')bodyAngle=Math.PI/2;
      else if(first[0]||first[1])bodyAngle=Math.atan2(-first[1],-first[0]);
      return {anchor:start,offsets,rotation:quarterTurn(Math.atan2(dy,dx)-bodyAngle),mirror:false,originOffset:first};
    }

    const anchor=midpoint(start,end),posts=record.posts||[start,end];
    const gate=Catalog.gateKind(component.kind);
    const opposite=offsets[type==='a'||gate?'out':type==='173'?'plate':pins[1]];
    const axisAngle=pins.length===2?Math.atan2(opposite[1]-first[1],opposite[0]-first[0]):0;
    const horizontal=Math.abs(dx)>=Math.abs(dy);
    const angle=horizontal?Math.atan2(0,dx):Math.atan2(dy,0);
    let rotation=quarterTurn(angle-axisAngle),mirror=false;
    const sidePin=gate&&pins.length>2?pins[0]:sidePins[type];
    if(sidePin) {
      const side=type==='a'||gate?start:type==='174'||type==='159'?anchor:end;
      const post=posts[pins.indexOf(sidePin)];
      const [sideX,sideY]=Geometry.rotateOffset(...offsets[sidePin],rotation);
      mirror=sideX*(post.x-side.x)+sideY*(post.y-side.y)<0;
      if(mirror)rotation=(rotation+180)%360;
    }

    const originOffset=pins.length===2?[(first[0]+opposite[0])/2,(first[1]+opposite[1])/2]:[0,0];
    const along=horizontal?'x':'y',across=horizontal?'y':'x';
    const span=Math.abs(end[along]-start[along]);
    const pinSpan=pins.length===2?Math.hypot(opposite[0]-first[0],opposite[1]-first[1]):opposite[0]-first[0];
    const needsElbow=(sidePin&&type!=='174'&&type!=='159')||start[across]!==end[across];
    let minScale=(pinSpan+(needsElbow?2*Catalog.grid:0))/span;
    if(gate&&pins.length>3)minScale=Math.max(minScale,Catalog.grid/(record.flags&1?8:16));
    if(type==='159'||type==='160')minScale=Math.max(minScale,Math.abs(offsets.control[1])/16);
    if(type==='174')minScale=Math.max(minScale,Math.abs(offsets.wiper[1]/(posts[2][across]-anchor[across])));
    if(type==='177'||type==='206')minScale=Math.max(minScale,Math.abs(offsets.gate[1])/Math.abs(posts[2][across]-end[across]));
    return {anchor,offsets,rotation,mirror,originOffset,posts,along,across,minScale};
  }

  function importText(text, options={}) {
    if(typeof text!=='string'||text.length>5_000_000)return {document:null,diagnostics:[{severity:'error',line:0,code:'INVALID_INPUT',message:'Expected circuit text smaller than 5 MB'}]};
    if(text.trimStart().startsWith('<')) {
      const converted=XML.toLegacy(text);
      if(converted.diagnostics.some(d=>d.severity==='error'))return {document:null,diagnostics:converted.diagnostics};
      const result=importLegacy(converted.text,options,converted);
      result.diagnostics=[
        ...converted.diagnostics,
        ...result.diagnostics.map(d=>({...d,line:d.line?converted.sourceLines[d.line-1]||d.line:0})),
      ].sort((a,b)=>a.line-b.line);
      return result;
    }
    return importLegacy(text,options);
  }

  function importLegacy(text, options, xml) {
    const diagnostics=[],records=[],scopes=[];
    const diagnostic=(severity,line,code,message)=>diagnostics.push({severity,line,code,message});
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
        if(type==='o'||type==='403'){
          // Embedded scopes occupy an element index in Falstad, even without posts.
          if(type==='403')records.push({type,line});
          scopes.push({line,tokens,xml:xml?.scopes.get(line),onSheet:type==='403'});continue;
        }
        if(['h','&','38'].includes(type)) {
          if(xml?.adjustables.has(line))continue;
          diagnostic('warning',line,'UNSUPPORTED_PRESENTATION',`${type==='h'?'Hint':'Legacy slider'} settings are not imported yet`);continue;
        }
        if(type!=='w'&&!Object.hasOwn(drawingKinds,type)&&!Object.hasOwn(types,type)) {
          diagnostic('error',line,'UNSUPPORTED_RECORD',`Unsupported Falstad record ${type}`);continue;
        }
        const [x1,y1,x2,y2,flags]=[0,1,2,3,4].map(i=>number(i));
        if(![x1,y1,x2,y2,flags].every(Number.isSafeInteger)||flags<0)throw new Error('Coordinates and flags must be safe integers');
        const record={type,line,x1,y1,x2,y2,flags};
        if(type==='w'){flagsAllowed(flags,3);if(tokens.length>5)throw new Error('Unexpected wire fields');record.bends=xml?.routes.get(line);records.push(record);continue;}
        if(type==='x'){
          flagsAllowed(flags,7);
          const size=number(5),text=annotationText(tokens.slice(6),!!(flags&4));
          if(!Number.isSafeInteger(size)||size<=0||!tokens[6]||text.length>4096)throw new Error('Invalid text annotation');
          records.push({...record,size,text});continue;
        }
        if(type==='b'||type==='423'){
          flagsAllowed(flags,0);
          if(tokens.length!==5)throw new Error('Unexpected drawing fields');
          records.push(record);continue;
        }
        let kind=types[type],parameters={},maxFields=5;
        if(Catalog.counterKind(kind)){
          const ring=kind==='ringCounter',binary=kind==='counter';
          flagsAllowed(flags,1|1024|2048|4096|8192|(ring?6:binary?12:0));
          const bits=number(5),custom=!!(flags&8192),first=custom?7:6;
          if(!Number.isInteger(bits)||bits<(binary?3:2)||bits>30)throw new Error('Unsupported counter width');
          const highVoltage=custom?number(6):5;
          let initialValue=0;
          for(let i=0;i<bits;i++)if(number(first+i)>highVoltage/2)initialValue+=2**(ring?i:bits-1-i);
          maxFields=first+bits;
          parameters={highVoltage,initialValue,bits};
          if(ring){
            parameters.invertReset=!(flags&4);
            parameters.clockInhibit=!!(flags&2);
          }else{
            if(binary){
              const reset=tokens[maxFields++]??'true';
              if(!['true','false'].includes(reset))throw new Error('Invalid counter reset polarity');
              parameters.invertReset=reset==='true';
              parameters.upDown=!!(flags&4);
              parameters.negativeEdge=!!(flags&8);
            }
            parameters.modulus=number(maxFields++,0);
            parameters.lsbFirst=xml?.bitOrders.get(line)===1;
          }
          Catalog.validateCounterParameters(kind,parameters);
        }
        if(Catalog.controlledSourceKind(kind)){
          flagsAllowed(flags,1|1024|2048|4096|8192);
          const index=flags&8192?6:5;
          if(flags&8192)number(5);
          if(tokens[index+1]===undefined)throw new Error('Missing controlled-source output expression');
          parameters=Catalog.validateOutput({kind,parameters:{inputCount:number(index),expression:unescapeText(tokens[index+1])}});
          maxFields=index+2;
        }
        if(type==='207'){
          flagsAllowed(flags,13);
          const name=flags&4?unescapeText(tokens.slice(5).join(' ')):tokens.slice(5).join(' ');
          if(!name.trim()||/[\r\n]/.test(name))throw new Error('Invalid labeled net name');
          if(flags&9)diagnostic('warning',line,'UNSUPPORTED_PRESENTATION','Wires uses standard labeled-node appearance');
          parameters={name};maxFields=tokens.length;
        }
        if(type==='r'){flagsAllowed(flags,1);parameters={resistance:number(5)};maxFields=6;}
        if(type==='m'){
          flagsAllowed(flags,0);
          parameters={onResistance:number(5),offResistance:number(6),initialDopedWidth:number(7),totalWidth:number(8),mobility:number(9)};
          if(number(10,0)!==0)diagnostic('warning',line,'RESET_STATE','Memristor current is recalculated from the saved doped width');
          maxFields=11;
        }
        if(type==='175')flagsAllowed(flags,0);
        if(type==='176'){
          flagsAllowed(flags,3);
          if((flags&2)&&tokens[5]!=='default'||!(flags&2)&&(flags&1)&&number(5)!==.805904783)
            throw new Error('Only the default varactor diode model is supported');
          const biasIndex=flags?6:5;
          parameters={capacitance:number(biasIndex+1)};
          if(number(biasIndex)!==0)diagnostic('warning',line,'RESET_STATE','Varactor starts at zero bias');
          maxFields=biasIndex+2;
        }
        if(type==='181'){
          flagsAllowed(flags,0);
          parameters={initialTemperature:tokens[5]==='NaN'?300:number(5),nominalPower:number(6),nominalVoltage:number(7),warmTime:number(8),coolTime:number(9)};
          maxFields=10;
        }
        if(type==='187'){
          flagsAllowed(flags,0);
          parameters={onResistance:number(5),offResistance:number(6),breakdownVoltage:number(7),holdingCurrent:number(8)};
          maxFields=9;
        }
        if(type==='177'||type==='206'){
          const scr=type==='177',firstField=scr?7:5;
          flagsAllowed(flags,scr?1:0);
          parameters={triggerCurrent:number(firstField,.01),holdingCurrent:number(firstField+1,.0082),
            gateResistance:number(firstField+2,scr?50:100)};
          if(!scr&&!['true','false'].includes(tokens[8]))throw new Error('Invalid TRIAC state');
          const hasSavedState=scr?[number(5,0),number(6,0)].some(value=>value!==0):tokens[8]==='true';
          if(hasSavedState)
            diagnostic('warning',line,'RESET_STATE',scr?'SCR starts at zero bias':'TRIAC starts in the off state');
          maxFields=scr?10:9;
          record.posts=thyristorPosts(record,legacyGrid);
        }
        if(type==='203'){
          flagsAllowed(flags,0);
          parameters={onResistance:number(5),offResistance:number(6),breakdownVoltage:number(7),holdingCurrent:number(8)};
          maxFields=9;
        }
        if(type==='c'||type==='209') {
          flagsAllowed(flags,7);parameters={capacitance:number(5),initialVoltage:number(7,1e-3),integration:flags&2?'backwardEuler':'trapezoidal'};
          number(6);
          const hasResistance=type==='c'||!!(flags&4);
          if(hasResistance&&number(8,0)!==0)throw new Error('Capacitor series resistance is not supported');
          maxFields=hasResistance?9:8;
          if(type==='209')parameters.maxReverseVoltage=number(maxFields++);
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
        if(type==='170') {
          flagsAllowed(flags,3);
          parameters={minFrequency:number(5),maxFrequency:number(6),amplitude:number(7),sweepTime:number(8),logarithmic:!!(flags&1),bidirectional:!!(flags&2)};
          maxFields=9;
        }
        if(type==='171') {
          flagsAllowed(flags,0);
          parameters={delay:number(5),impedance:number(6)};
          const width=number(7),dx=x2-x1,dy=y2-y1;
          if(!Number.isSafeInteger(width)||width<=0)throw new Error('Invalid transmission line width');
          if((!dx&&!dy)||(dx&&dy))throw new Error('Zero-length or diagonal transmission line layout is not supported');
          if(number(8)!==0)throw new Error('Transmission line losses are not supported');
          // Falstad indexes the two displaced return posts before the signal posts.
          const shiftX=dy?width:0,shiftY=dx?width:0;
          record.posts=[{x:x1+shiftX,y:y1+shiftY},{x:x2+shiftX,y:y2+shiftY},{x:x1,y:y1},{x:x2,y:y2}];
          maxFields=9;
        }
        if(type==='T'||type==='169') {
          const tapped=type==='169';
          flagsAllowed(flags,tapped?3:30);
          parameters={inductance:number(5),ratio:number(6),coupling:number(tapped?10:9,tapped ? .99 : .999),integration:flags&2?'backwardEuler':'trapezoidal'};
          const currents=tapped?[number(7),number(8),number(9,0)]:[number(7),number(8)];
          if(currents.some(current=>current!==0))diagnostic('warning',line,'RESET_STATE','Transformer winding currents start at zero');
          const dx=x2-x1,dy=y2-y1;
          if(tapped){
            if((!dx&&!dy)||(dx&&dy))throw new Error('Zero-length or diagonal tapped transformer layout is not supported');
            const halfWidth=flags&1?32:-32;
            const shiftX=Math.sign(dy)*halfWidth,shiftY=-Math.sign(dx)*halfWidth;
            record.posts=[{x:x1,y:y1},{x:x1+2*shiftX,y:y1+2*shiftY},{x:x2,y:y2},
              {x:x2+shiftX,y:y2+shiftY},{x:x2+2*shiftX,y:y2+2*shiftY}];
          }else{
            if(number(10,0)!==0)throw new Error('Transformer core saturation is not supported');
            const vertical=!!(flags&8),span=vertical?dy:dx;
            if(!span)throw new Error('Zero-length transformer layout is not supported');
            const width=number(11,vertical?-Math.max(32,Math.abs(dx)):Math.max(32,Math.abs(dy)));
            if(!Number.isSafeInteger(width)||!width)throw new Error('Invalid transformer width');
            const cross=-Math.sign(dy||dx)*width*(flags&16?-1:1)*Math.sign(span);
            const shiftX=vertical?cross:0,shiftY=vertical?0:-cross;
            const end={x:vertical?x1:x2,y:vertical?y2:y1};
            const secondaryStart={x:end.x,y:end.y},secondaryEnd={x:end.x+shiftX,y:end.y+shiftY};
            const reverseSecondary=!!(flags&4);
            if(reverseSecondary)parameters.reverseSecondary=true;
            record.posts=[{x:x1,y:y1},reverseSecondary?secondaryEnd:secondaryStart,{x:x1+shiftX,y:y1+shiftY},reverseSecondary?secondaryStart:secondaryEnd];
          }
          maxFields=tapped?11:12;
        }
        if(type==='200'||type==='201') {
          flagsAllowed(flags,2);
          parameters={carrierFrequency:number(5),signalFrequency:number(6),amplitude:number(7)};
          if(type==='201')parameters.deviation=number(8);
          maxFields=type==='201'?9:8;
        }
        if(type==='211') {
          flagsAllowed(flags,0);
          parameters={duration:number(5),sampleRate:number(6)};
          const label=number(7);
          if(!Number.isSafeInteger(label)||label<0)throw new Error('Invalid audio output number');
          if(label>1)diagnostic('warning',line,'UNSUPPORTED_PRESENTATION','Wires uses its own audio output numbering');
          maxFields=8;
        }
        if(type==='I') {
          flagsAllowed(flags,0);
          parameters={slewRate:number(5,.5),highVoltage:number(6,5)};
          maxFields=7;
        }
        if(type==='173'){
          flagsAllowed(flags,3);
          parameters={mu:number(5),kg1:number(6)};
          const dx=x2-x1,dy=y2-y1;
          if((!dx&&!dy)||(dx&&dy))throw new Error('Zero-length or diagonal triode layout is not supported');
          const ux=Math.sign(dx),uy=Math.sign(dy),side=32*(flags&2?Math.sign(dy||dx):1)*(flags&1?-1:1);
          record.posts=[{x:x2+uy*side,y:y2-ux*side},{x:x1,y:y1},{x:x2-uy*side-ux*16,y:y2+ux*side-uy*16}];
          maxFields=7;
        }
        if(type==='182'||type==='183'){
          flagsAllowed(flags,0);
          parameters={slewRate:number(5,.5),lowerThreshold:number(6,1.66),upperThreshold:number(7,3.33),highVoltage:number(8,5),lowVoltage:number(9,0)};
          maxFields=10;
        }
        if(type==='159'||type==='160'){
          flagsAllowed(flags,31);
          parameters={onResistance:number(5,20),offResistance:number(6,1e10),threshold:number(7,2.5),inverted:!!(flags&1),pulldown:!!(flags&2)};
          const dx=x2-x1,dy=y2-y1;
          if((!dx&&!dy)||(dx&&dy))throw new Error('Zero-length or diagonal analog switch layout is not supported');
          const spdt=type==='160',flipX=!!(flags&4),flipY=!!(flags&8);
          const side=((flipX!==flipY)!==!!(flags&16))?-16:16;
          const shiftX=Math.sign(dy)*side,shiftY=-Math.sign(dx)*side;
          // Match rounding on the native grid for odd-length and flipped controls.
          const controlGrid=(a,b,flip)=>Math.floor((Math.trunc((a+b)/2)+(flip?1:-1)+legacyGrid/2-1)/legacyGrid)*legacyGrid;
          const controlSign=spdt?1:-1;
          const control={x:controlGrid(x1,x2,flipX)+controlSign*shiftX,y:controlGrid(y1,y2,flipY)+controlSign*shiftY};
          record.posts=[{x:x1,y:y1}];
          if(spdt)record.posts.push({x:x2+shiftX,y:y2+shiftY},{x:x2-shiftX,y:y2-shiftY});
          else record.posts.push({x:x2,y:y2});
          record.posts.push(control);
          maxFields=8;
        }
        if(type==='178'){
          flagsAllowed(flags,31);
          if(x1===x2&&y1===y2)throw new Error('Zero-length relay layout is not supported');
          const onCurrent=number(10);
          parameters={poleCount:number(5),inductance:number(6),initialCoilCurrent:number(7),onResistance:number(8),
            offResistance:number(9),onCurrent,coilResistance:number(11),offCurrent:number(12,onCurrent),
            switchingTime:number(13,0),initialPosition:number(14,0),coilStyle:flags&1?2:flags&4?0:1,
            showBox:!!(flags&2),pulldown:!!(flags&16)};
          maxFields=15;
        }
        if(type==='179'){
          flagsAllowed(flags,1|1024|2048|4096|8192);
          const gainIndex=flags&8192?6:5;
          if(flags&8192)number(5);
          parameters={gain:number(gainIndex)};
          maxFields=gainIndex+1;
        }
        if(type==='165'){
          flagsAllowed(flags,1|2|4|8|1024|2048|4096|8192);
          const stateIndex=flags&8192?6:5;
          if(flags&8192)number(5);
          parameters={resetPin:!!(flags&2)||!!(flags&4),groundPin:!!(flags&4),pinNumbers:!!(flags&8),initialOutputVoltage:number(stateIndex)};
          maxFields=stateIndex+1;
        }
        if(Object.hasOwn(flipFlopPosts,type)){
          const jk=type==='156';
          if(flags&2||!jk&&(flags&4))throw new Error('Flip-flop asynchronous set/reset pins are not supported');
          flagsAllowed(flags,1|1024|2048|4096|8192|(jk?4:0));
          const customVoltage=!!(flags&8192),highVoltage=customVoltage?number(5):5;
          maxFields=customVoltage?7:6;
          parameters={highVoltage,initialState:number(maxFields-1)>highVoltage/2,...(jk?{positiveEdge:!!(flags&4)}:{})};
        }
        if(Catalog.displayChipKind(kind)){
          flagsAllowed(flags,1|1024|2048|4096|(type==='405'?0:8192));
          const custom=!!(flags&8192),first=custom?6:5,highVoltage=custom?number(5):5;
          if(type==='419'){
            const bitCount=number(first,4);
            parameters={mode:number(first+1,0),...(bitCount===4?{}:{bitCount}),...(highVoltage===5?{}:{highVoltage}),
              ...(xml?.bitOrders.get(line)===1?{lsbFirst:true}:{})};
          }else if(type==='405'){
            parameters={columns:number(5,8),rows:number(6,8)};
          }else{
            parameters={segments:number(first,7),extra:number(first+1,0),diodeDirection:number(first+2,0),highVoltage};
          }
          Catalog.validateOutput({kind,parameters});
          maxFields=first+(type==='157'?3:2);
        }
        if(Catalog.gateKind(kind)) {
          flagsAllowed(flags,7);
          const inputCount=number(5),initialOutputVoltage=number(6);
          parameters=Catalog.validateGateParameters({
            inputCount,highVoltage:number(7,5),propagationDelay:number(8,0),
            schmittInputs:!!(flags&2),invertInputs:!!(flags&4),
            ...(initialOutputVoltage!==0?{initialOutputVoltage}:{}),
          });
          const dx=x2-x1,dy=y2-y1;
          if((!dx&&!dy)||(dx&&dy))throw new Error('Zero-length or diagonal logic gate layout is not supported');
          const spacing=flags&1?.5:1;
          record.posts=Catalog.gateOffsets(inputCount).map(offset=>({
            x:x1+Math.sign(dy)*offset*spacing,y:y1-Math.sign(dx)*offset*spacing,
          }));
          record.posts.push({x:x2,y:y2});
          maxFields=9;
        }
        if(type==='p') {
          flagsAllowed(flags,3);
          const mode=number(5,0),scale=number(6,0);
          if(!Number.isInteger(mode)||mode<0||mode>5)throw new Error('Unsupported voltmeter reading mode');
          if(!Number.isInteger(scale)||scale<0||scale>3)throw new Error('Unsupported voltmeter scale');
          parameters={mode,scale,resistance:number(7,0),showVoltage:!!(flags&1),circleSymbol:!!(flags&2)};
          maxFields=8;
        }
        if(type==='370'){
          flagsAllowed(flags,3);
          parameters={mode:number(5),scale:number(6,0),circleSymbol:!!(flags&2)};
          if(!(flags&1))diagnostic('warning',line,'UNSUPPORTED_PRESENTATION','Wires shows the ammeter reading');
          maxFields=7;
        }
        if(type==='368'){
          flagsAllowed(flags,1);
          if((flags&1)&&!tokens[6])throw new Error('Missing test point label');
          parameters={mode:number(5),label:flags&1?unescapeText(tokens[6]):'TP'};
          maxFields=flags&1?7:6;
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
          const oldFormat=tokens.length===10&&tokens[8]==='false'&&tokens[9]==='0';
          if(!oldFormat&&number(8,2)!==2)throw new Error('Only two-throw switches are supported by this importer');
          const position=tokens[5]==='true'?1:tokens[5]==='false'?0:number(5);
          parameters={position,momentary:tokens[6]==='true',group:number(7,0),throwCount:2,centerOff:!!(flags&1)};maxFields=oldFormat?10:9;
          const length=Math.hypot(x2-x1,y2-y1);if(!length)throw new Error('Zero-length SPDT switch');
          const dx=16*(y2-y1)/length,dy=-16*(x2-x1)/length;
          record.posts=[{x:x1,y:y1},{x:x2+dx,y:y2+dy},{x:x2-dx,y:y2-dy}];
          if(x1!==x2&&y1!==y2)throw new Error('Diagonal SPDT switch geometry is not supported');
        }
        if(type==='i'){flagsAllowed(flags,1);const current=number(5,.01);parameters={current:current===0?.01:current,maxVoltage:number(6,0)};maxFields=7;}
        if(type==='O'){flagsAllowed(flags,3);parameters={showVoltage:!!(flags&1)};number(5,0);maxFields=6;}
        if(type==='L') {
          flagsAllowed(flags,3);const state=tokens[5]==='true'?0:tokens[5]==='false'?1:number(5);
          if(!['true','false'].includes(tokens[6]))throw new Error('Invalid logic input momentary state');
          parameters={state,highVoltage:number(7,5),lowVoltage:number(8,0),mode:flags&1?'ternary':flags&2?'numeric':'logic',...(tokens[6]==='true'?{momentary:true}:{})};maxFields=9;
        }
        if(type==='M'){flagsAllowed(flags,7);parameters={threshold:number(5,2.5),mode:flags&1?'ternary':flags&2?'numeric':'logic',pulldown:!!(flags&4)};maxFields=6;}
        if(Catalog.diodeKind(kind)) {
          flagsAllowed(flags,3);
          const next=flags?6:5;
          if(flags&2){
            if(!tokens[5])throw new Error('Missing diode model');
            const name=unescapeText(tokens[5]);
            parameters={model:name==='old-default-led'?{...oldLedModel}:name};
          }else {
            const drop=flags&1?number(5,.805904783):kind==='led'?2.1024259:.805904783;
            parameters={model:diodeModel(drop,kind==='zener'?number(next):0,line)};
          }
          if(kind==='led')Object.assign(parameters,{red:number(next),green:number(next+1),blue:number(next+2),maxCurrent:number(next+3,.01)});
          parameters=Catalog.validateDiodeParameters(kind,parameters);
          maxFields=next+(kind==='led'?4:kind==='zener'&&!(flags&2)?1:0);
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
        if(type==='t') {
          flagsAllowed(flags,3);
          const polarity=number(5);
          if(![1,-1].includes(polarity))throw new Error('Invalid transistor polarity');
          kind=polarity===1?'npn':'pnp';
          const model=tokens[9]??'default';
          Catalog.resolveTransistorModel(model);
          parameters={beta:number(8,100),model,drawCircle:!!(flags&2)};
          maxFields=10;
          if(number(6,0)!==0||number(7,0)!==0)diagnostic('warning',line,'RESET_STATE','The simulator recalculates transistor junction voltages on startup');
          const dx=x2-x1,dy=y2-y1;
          if((!dx&&!dy)||(dx&&dy))throw new Error('Zero-length or diagonal transistor layout is not supported');
          // Falstad uses the second handle as the midpoint of collector and emitter.
          const side=16*polarity*(flags&1?-1:1);
          record.posts=[{x:x1,y:y1},{x:x2+(dy?side:0),y:y2-(dx?side:0)},{x:x2-(dy?side:0),y:y2+(dx?side:0)}];
        }
        if(type==='f'||type==='j') {
          const mosfet=type==='f',pChannel=!!(flags&1);
          flagsAllowed(flags,mosfet?255:3);
          kind=mosfet?(pChannel?'pmos':'nmos'):(pChannel?'pjfet':'njfet');
          parameters={threshold:number(5,mosfet?1.5:-4),beta:number(6,mosfet ? .02 : .00125)};
          if(!(parameters.beta>0)||!Number.isFinite(1/parameters.beta))throw new Error('Invalid FET beta');
          if(mosfet)Object.assign(parameters,{
            bodyDiode:!!(flags&32),bodyTerminal:!!(flags&64),showBulk:!(flags&16),
            digitalSymbol:!!(flags&4),showBodyDiode:!!(flags&128),swapTerminals:!!(flags&8),
          });
          if(flags&2)diagnostic('warning',line,'UNSUPPORTED_PRESENTATION','The FET threshold readout is available in properties');
          const dx=x2-x1,dy=y2-y1;
          if((!dx&&!dy)||(dx&&dy))throw new Error('Zero-length or diagonal FET layout is not supported');
          // Match native post indices 1 and 2, including their polarity-specific
          // electrical roles. Rotation and mirroring affect artwork separately.
          const side=parameters.swapTerminals?-16:16;
          record.posts=[{x:x1,y:y1},{x:x2-(dy?side:0),y:y2+(dx?side:0)},{x:x2+(dy?side:0),y:y2-(dx?side:0)}];
          if(mosfet&&Catalog.activeBody(parameters))record.posts.push({x:x2,y:y2});
          maxFields=7;
        }
        if(type==='g'){flagsAllowed(flags,1);number(5,0);maxFields=6;}
        if(type==='s') {
          flagsAllowed(flags,3);const position=tokens[5]==='true'?1:tokens[5]==='false'?0:number(5);
          if(![0,1].includes(position)||!['true','false'].includes(tokens[6]))throw new Error('Unsupported switch state');
          kind=tokens[6]==='true'?'pushSwitch':'switch';parameters=kind==='pushSwitch'?{normallyClosed:position===0}:{closed:position===0};maxFields=7;
        }
        if(['v','R','n','A'].includes(type)) {
          flagsAllowed(flags,31|64);
          const code=number(5,0),frequency=number(6,40),amplitude=number(7,5),offset=number(8,0);
          const phase=flags&2?Math.PI/2:number(9,0);
          if(type==='n'||type==='R'&&code===6){
            kind='noiseSource';parameters={amplitude,offset};
          }else if(type!=='A'){
            const waveformKind=['dc','sine','square','triangle','sawtooth','pulse'][code];
            if(!waveformKind)throw new Error(`Unsupported waveform ${code}`);
            const waveform=code===0?{kind:'dc',voltage:amplitude+offset}:{kind:waveformKind,frequency,amplitude,offset,phase};
            if(code===0&&offset===0&&['R','v'].includes(type))record.adjustableVoltage=true;
            if(code===1&&amplitude<0){waveform.amplitude=-amplitude;waveform.phase=phase+Math.PI;}
            if(code===2||code===5)waveform.dutyCycle=code===5&&!(flags&4)?1/(2*Math.PI):number(10,.5);
            parameters={waveform};
          }
          maxFields=11;
        }
        if(tokens.length>maxFields)throw new Error('Unexpected fields (unsupported record variant)');
        const pins=Catalog.componentModel({kind,parameters}).postOrder;
        if(pins.length===2&&x1===x2&&y1===y2&&!Catalog.controlledSourceKind(kind)&&!Catalog.displayChipKind(kind))
          throw new Error('Zero-length component layout is not supported');
        records.push({...record,kind,parameters,pins});
      }catch(error){diagnostic('error',line,'UNSUPPORTED_OR_INVALID_RECORD',error.message);}
    }
    if(!records.some(r=>r.kind||Object.hasOwn(drawingKinds,r.type))&&(!header||records.some(r=>r.type!=='403')))diagnostic('error',0,'EMPTY_CIRCUIT','No supported components found');
    if(diagnostics.some(d=>d.severity==='error'))return {document:null,diagnostics};
    // Use one scale for the circuit and snap the artwork independently. An odd
    // source coordinate should not force every symbol and wire farther apart.
    let scale=Catalog.grid/legacyGrid;
    for(const r of records) {
      if(!r.kind)continue;
      const component={id:`c${r.line}`,kind:r.kind,modelVersion:1,parameters:r.parameters};
      r.component=component;
      r.symbol=symbolLayout(r,component);
      scale=Math.max(scale,r.symbol.minScale||0);
    }
    const position=({x,y})=>({x:Geometry.snap(x*scale),y:Geometry.snap(y*scale)});
    const points=new Map();
    function junction({x,y}) {
      // Junction identity comes from the original posts, before grid snapping.
      const key=`${x},${y}`;if(points.has(key))return points.get(key);
      const id=`j${points.size+1}`,ref={kind:'junction',junctionId:id};points.set(key,ref);
      doc.electrical.junctions.push({id});doc.layout.junctions[id]=position({x,y});return ref;
    }
    function wire(from,to,bends=[]) {
      const id=`w${doc.electrical.wires.length+1}`;doc.electrical.wires.push({id,from,to});doc.layout.wires[id]={bends};
    }
    for(const r of records) {
      if(r.type==='403')continue;
      const start={x:r.x1,y:r.y1};
      if(r.type==='w'){
        r.voltageTarget=junction(start);
        wire(r.voltageTarget,junction({x:r.x2,y:r.y2}),r.bends?.map(position));continue;
      }
      if(r.type==='x'){
        const fontSize=Math.max(8,Math.min(300,r.size*scale));
        (doc.layout.drawings??=[]).push({
          id:`d${r.line}`,kind:'text',text:r.text,points:[{x:r.x1*scale,y:r.y1*scale-fontSize}],
          fill:'currentColor',stroke:'none',strokeWidth:0,strokeStyle:'solid',fontSize,
          ...(r.flags&2?{overline:true}:{}),
        });
        continue;
      }
      if(r.type==='b'||r.type==='423'){
        const end={x:r.x2,y:r.y2},box=r.type==='b';
        const corners=box?[start,{x:end.x,y:start.y},end,{x:start.x,y:end.y}]:[start,end];
        (doc.layout.drawings??=[]).push({
          id:`d${r.line}`,kind:drawingKinds[r.type],points:corners.map(({x,y})=>({x:x*scale,y:y*scale})),
          fill:'none',stroke:'#808080',strokeWidth:Math.min(50,2*scale),strokeStyle:box?'dashed':'solid',
        });
        continue;
      }
      const {id}=r.component;
      doc.electrical.components.push(r.component);
      const {anchor,offsets,rotation,mirror,originOffset,posts=[start],along,across,postAxes}=r.symbol;
      const center=position(anchor);
      const [dx,dy]=Geometry.rotateOffset(...originOffset,rotation);
      const pose={x:center.x-dx,y:center.y-dy,rotation,mirror};
      doc.layout.components[id]=pose;
      for(const [index,pinId] of r.pins.entries()) {
        const from={kind:'pin',componentId:id,pinId},to=junction(posts[index]);
        const [x,y]=offsets[pinId];
        const [rx,ry]=Geometry.rotateOffset(mirror?-x:x,y,rotation);
        const pin={x:pose.x+rx,y:pose.y+ry},post=doc.layout.junctions[to.junctionId];
        const bends=[];
        const branch=pinId==='control'&&(r.type==='159'||r.type==='160')||pinId==='gate'&&(r.type==='177'||r.type==='206');
        const axis=postAxes?.[index]??(branch?across:along),cross=axis===along?across:along;
        if(axis&&pin[axis]!==post[axis]&&pin[cross]!==post[cross]) {
          const turn=r.pins.length===2?post[axis]:Geometry.snap(midpoint(pin,post)[axis]);
          const firstTurn=turn===pin[axis]?post[axis]:turn;
          bends.push({...pin,[axis]:firstTurn});
          if(firstTurn!==post[axis])bends.push({...post,[axis]:firstTurn});
        }
        wire(from,to,bends);
      }
    }
    // Match Falstad's implicit first-source ground rule explicitly, since Wires
    // compiles components to private coordinates rather than original posts.
    if(!records.some(r=>['ground','voltageRail','variableVoltage','noiseSource','antennaSource'].includes(r.kind))) {
      const source=records.find(r=>r.kind==='voltageSource');
      if(source) {
        const id='implicit-ground';doc.electrical.components.push({id,kind:'ground',modelVersion:1,parameters:{}});
        const post={x:source.x1,y:source.y1};
        doc.layout.components[id]={...position(post),rotation:0,mirror:false};
        wire({kind:'pin',componentId:id,pinId:'g'},junction(post));
      }
    }
    Scopes.restore(doc,records,scopes,scale,(line,code,message)=>diagnostic('warning',line,code,message));
    for(const [line,node] of xml?.adjustables??[]){
      const {attrs:a}=node;
      const target=records[Number(a.e)];
      const field=target?.kind==='currentSource'?'current':target?.adjustableVoltage?'waveform.voltage':null;
      const min=Number(a.mn??1),max=Number(a.mx??1000),step=Number(a.stp??0);
      const logarithmic=Number(a.log??0)===1;
      if(!/^\d+$/.test(a.e??'')||!field||Number(a.ei??0)!==0||a.en&&a.en!==(field==='current'?'Current (A)':'Voltage')||
        Number(a.ss??-1)!==-1||node.children.length||node.text?.trim()||
        Object.keys(a).some(key=>!['e','ei','en','mn','mx','st','stp','ss','log'].includes(key))||
        !Number.isFinite(max-min)||min>=max||!Number.isFinite(step)||step<0||
        ![0,1].includes(Number(a.log??0))||logarithmic&&min<=0||!a.st?.trim()||a.st.length>200||
        (doc.layout.propertySliders?.length??0)>=1000){
        diagnostic('warning',line,'UNSUPPORTED_PRESENTATION','Slider target or settings could not be restored');continue;
      }
      (doc.layout.propertySliders??=[]).push({
        id:`falstad-slider-${line}`,componentId:target.component.id,field,label:a.st,min,max,
        step:step||Math.max(Number.MIN_VALUE,(max-min)/100),...(logarithmic?{logarithmic}:{}),
      });
    }
    try {Document.validate(doc);}catch(error){diagnostic('error',0,'INVALID_DOCUMENT',error.message);return {document:null,diagnostics};}
    return {document:doc,diagnostics};
  }
  const api=Object.freeze({importText});registry.falstad=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})();
