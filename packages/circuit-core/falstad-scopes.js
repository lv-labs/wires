'use strict';
// Restore Falstad scope settings using the original element order, before wire cleanup.
(() => {
  const registry=globalThis.CircuitCoreModules ||= {};
  const common=typeof module==='object'&&module.exports;
  const Catalog=common?require('./catalog.js'):registry.catalog;
  const Geometry=common?require('./geometry.js'):registry.geometry;
  const VOLTAGE=0,CURRENT=3;
  const SHOW_CURRENT=1,SHOW_VOLTAGE=2,MANUAL=16,Y_ELEMENT=32,XY=64|128,FFT=1024;
  const SECOND_VALUE=2048,PLOTS=4096,PLOT_FLAGS=1<<18,PLOT_SCALE=1<<19,DIVISIONS=1<<21;
  const BASIC_FLAGS=SHOW_CURRENT|SHOW_VOLTAGE|4|MANUAL|Y_ELEMENT|SECOND_VALUE|PLOTS|PLOT_FLAGS|PLOT_SCALE|DIVISIONS;
  const scopeAttributes=new Set(['en','sp','f','p','md','x','triggerMode','triggerEdge','triggerLevel']);
  const plotAttributes=new Set(['e','v','f','sc','ms','mp']);
  const maxTraces=32;

  function numeric(raw,label) {
    const value=Number(raw);
    if(raw===undefined||raw.trim()===''||!Number.isFinite(value))throw new Error(`Invalid scope ${label}`);
    return value;
  }

  function integer(raw,label,min=0) {
    const value=numeric(raw,label);
    if(!Number.isSafeInteger(value)||value<min)throw new Error(`Invalid scope ${label}`);
    return value;
  }

  function flags(raw,hex=false) {
    const value=hex?`0x${raw}`:raw?.replace(/^x/i,'0x');
    const result=integer(value,'flags');
    if(result>0x7fffffff)throw new Error('Invalid scope flags');
    return result;
  }

  function isTransistor(records,element) {
    return records[element]?.type==='t';
  }

  function legacyScope(tokens,records,index) {
    let cursor=0;
    const read=(label,min)=>integer(tokens[cursor++],label,min);
    const element=read('element index',-1);
    if(element===-1)return null;
    const speed=read('speed',1);
    let firstValue=read('measurement');
    if(firstValue===1&&!isTransistor(records,element))firstValue=7; // Older power code.
    const scopeFlags=flags(tokens[cursor++]);
    if(scopeFlags&(XY|FFT))return {flags:scopeFlags};
    const volts=numeric(tokens[cursor++],'voltage scale')||.5;
    const amps=numeric(tokens[cursor++],'current scale')||1;
    const savedPosition=tokens[cursor]===undefined?-1:read('position',-1);
    const position=savedPosition===-1?index:savedPosition;
    const extended=!!(scopeFlags&PLOTS);
    const count=extended?read('plot count',1):1;
    if(count>tokens.length)throw new Error('Invalid scope plot count');
    const divisions=extended&&(scopeFlags&DIVISIONS)?read('vertical divisions',1):8;
    const plots=[];
    function plot(source,value,plotFlags,firstScale) {
      const bipolar=isTransistor(records,source);
      const current=value===CURRENT||bipolar&&(value===1||value===2);
      const extraScale=value===7||value===8||value===2&&!bipolar;
      const scale=firstScale??(extended&&extraScale?numeric(tokens[cursor++],'plot scale'):current?amps:volts);
      const result={element:source,value,flags:plotFlags,scale};
      if(extended&&(scopeFlags&PLOT_SCALE)) {
        result.manual=numeric(tokens[cursor++],'manual scale');
        result.offset=read('vertical position',-Number.MAX_SAFE_INTEGER);
      }
      plots.push(result);
    }
    if(extended) {
      for(let i=0;i<count;i++) {
        // The first plot's extra-unit scale precedes the per-plot flags.
        const firstExtra=i===0&&(firstValue===7||firstValue===8||firstValue===2&&!isTransistor(records,element));
        const firstScale=firstExtra?numeric(tokens[cursor++],'plot scale'):undefined;
        const plotFlags=scopeFlags&PLOT_FLAGS?flags(tokens[cursor++],true):0;
        const source=i?read('plot element index'):element;
        const value=i?read('plot measurement'):firstValue;
        plot(source,value,plotFlags,firstScale);
      }
    }else {
      if(scopeFlags&Y_ELEMENT)read('Y element index',-1);
      const second=scopeFlags&SECOND_VALUE?read('second measurement'):0;
      plot(element,firstValue,0);
      if(second>0)plot(element,second,0);
      else if(firstValue===VOLTAGE&&!['O','M','p','211'].includes(records[element]?.type))plot(element,CURRENT,0);
    }
    const label=tokens.slice(cursor).join(' ').replace(/%2b/ig,'+').replace(/\\(.)/g,(_,key)=>({s:' ',p:'+',q:'=',h:'#',a:'&',n:' ',r:' '}[key]??key));
    return {flags:scopeFlags,speed,position,divisions,label,plots};
  }

  function xmlScope(node,warn,onSheet=false) {
    const {attrs,children}=node;
    const element=integer(attrs.en,'element index',-1);
    if(element===-1)return null;
    const scopeFlags=flags(attrs.f??'3');
    if(scopeFlags&(XY|FFT))return {flags:scopeFlags};
    const speed=integer(attrs.sp??'64','speed',1);
    const position=integer(attrs.p??'0','position',onSheet?-1:0);
    const divisions=integer(attrs.md??'8','vertical divisions',1);
    if(node.text?.trim()||Object.keys(attrs).some(key=>!scopeAttributes.has(key)))warn('Some XML scope settings could not be restored');
    const plots=[];
    for(const child of children) {
      if(child.name!=='p'||child.children.length||child.text?.trim()){
        warn('Unsupported XML child in scope');continue;
      }
      const a=child.attrs;
      try {
        if(Object.keys(a).some(key=>!plotAttributes.has(key)))warn('Some XML plot settings could not be restored');
        plots.push({
          element:a.e===undefined?element:integer(a.e,'plot element index'),
          value:integer(a.v,'plot measurement'),flags:flags(a.f??'0',true),
          scale:a.sc===undefined?undefined:numeric(a.sc,'plot scale'),
          manual:a.ms===undefined?undefined:numeric(a.ms,'manual scale'),
          offset:a.mp===undefined?0:integer(a.mp,'vertical position',-Number.MAX_SAFE_INTEGER),
        });
      }catch(error){warn(error.message);}
    }
    if(!children.length)warn('XML scope has no plot records');
    let trigger;
    try {
      const mode=integer(attrs.triggerMode??'0','trigger mode');
      const edge=integer(attrs.triggerEdge??'0','trigger edge');
      const level=numeric(attrs.triggerLevel??'0','trigger level');
      if(mode>2||edge>1)throw new Error('Unsupported scope trigger settings');
      if(mode)trigger={mode:mode===1?'normal':'auto',edge:edge?'falling':'rising',level};
    }catch(error){warn(error.message);}
    return {flags:scopeFlags,speed,position,divisions,label:attrs.x,plots,trigger};
  }

  function sheetScope(xml,tokens,records,scale,warn) {
    const coordinates=xml?xml.attrs.x?.trim().split(/\s+/):tokens.slice(0,4);
    if(coordinates?.length!==4)throw new Error('Expected four coordinates for sheet scope');
    const [x1,y1,x2,y2]=coordinates.map(raw=>integer(raw,'coordinate',-Number.MAX_SAFE_INTEGER));
    const width=Math.abs(x2-x1)*scale,height=Math.abs(y2-y1)*scale;
    if(!width||!height)throw new Error('Sheet scope must have positive width and height');
    const scopeFlags=integer(xml?xml.attrs.f??'0':tokens[4],'element flags');
    if(scopeFlags)warn('Some Falstad sheet scope options could not be restored');
    let scope;
    if(xml) {
      const [child]=xml.children;
      if(child?.name!=='o'||xml.children.length!==1||xml.text?.trim())throw new Error('Expected one <o> record in <Scope>');
      if(Object.keys(xml.attrs).some(key=>key!=='x'&&key!=='f'))warn('Some XML sheet scope settings could not be restored');
      scope=xmlScope(child,warn,true);
    }else {
      if(tokens.length!==6)throw new Error('Expected a packed scope record');
      scope=legacyScope(tokens[5].split('_').filter(Boolean),records,0);
    }
    if(!scope)return null;
    const placement={mode:'sheet',x:Math.min(x1,x2)*scale,y:Math.min(y1,y2)*scale,width,height,sheetScale:1/scale};
    return {...scope,placement};
  }

  function measurement(record,value) {
    if(!record)return null;
    if(record.type==='w')return value===VOLTAGE?{kind:'voltage',positive:record.voltageTarget,reference:'ground'}:null;
    if(!record.component)return null;
    const componentId=record.component.id;
    const pin=pinId=>({kind:'pin',componentId,pinId});
    const voltage=(a,b)=>({kind:'voltage',positive:pin(a),...(b?{negative:pin(b)}:{reference:'ground'})});
    if(record.type==='t') {
      if(value===4)return voltage('base','emitter');
      if(value===5)return voltage('base','collector');
      if(value===6)return voltage('collector','emitter');
      return null;
    }
    if(value===CURRENT) {
      const {sign}=Catalog.componentModel(record.component);
      return sign===null?null:{kind:'current',componentId,...(sign===-1?{polarity:-1}:{})};
    }
    if(value!==VOLTAGE)return null;
    if(record.type==='a')return voltage('out','plus');
    if(record.type==='188')return voltage('Q');
    if(record.type==='422')return voltage('input');
    if(record.type==='Gyrator')return voltage('port1Plus','port2Plus');
    if(record.type==='f'||record.type==='j')return voltage('drain','source');
    if(record.type==='173')return voltage('plate','cathode');
    const [a,b]=record.pins;
    if(record.type==='368'&&record.component.parameters.mode!==0)return null;
    if(['I','182','183','370'].includes(record.type))return voltage(a);
    return record.type==='v'||record.type==='i'?voltage(b,a):voltage(a,b);
  }

  function timeDivision(timeStep,speed) {
    // Falstad chooses a 1/2/5 tick spacing at least 20 source pixels wide.
    const minimum=timeStep*speed*20;
    let division=1e-15,index=0;
    const factors=[2,2.5,2];
    while(division<minimum&&division<60)division*=factors[index++%3];
    return Math.min(60,division);
  }

  function dock(nodes,axis) {
    if(nodes.length===1)return nodes[0];
    const middle=Math.floor(nodes.length/2);
    return {type:'split',axis,ratio:middle/nodes.length,
      first:dock(nodes.slice(0,middle),axis),second:dock(nodes.slice(middle),axis)};
  }

  function restore(doc,records,scopes,scale,warning) {
    if(!scopes.length)return;
    const pending=[];
    const paneSettings=new Map();
    let dockIndex=0;
    for(const {line,tokens,xml,onSheet} of scopes) {
      const warn=message=>warning(line,'UNSUPPORTED_SCOPE',message);
      const index=onSheet?0:dockIndex++;
      try {
        const scope=onSheet?sheetScope(xml,tokens,records,scale,warn):xml?xmlScope(xml,warn):legacyScope(tokens,records,index);
        if(!scope)continue;
        if(scope.flags&(XY|FFT)){
          warn('XY, I–V and FFT scope modes are not supported');continue;
        }
        if(scope.flags&~BASIC_FLAGS)warn('Some Falstad scope display options could not be restored');
        const paneId=`falstad-scope-${line}`;
        paneSettings.set(paneId,{...scope,order:paneSettings.size,line});
        for(const plot of scope.plots) {
          if((plot.value===VOLTAGE&&!(scope.flags&SHOW_VOLTAGE))||(plot.value===CURRENT&&!(scope.flags&SHOW_CURRENT)))continue;
          const record=records[plot.element];
          const probe=measurement(record,plot.value);
          if(!probe){warn(`Scope measurement ${plot.value} on element ${plot.element} is unavailable`);continue;}
          if(plot.flags&~1)warn('Some Falstad trace options could not be restored');
          const name=record.type==='w'?'Wire':Catalog.definitions[record.kind].name;
          probe.label=`${scope.label?`${scope.label} · `:''}${name} ${probe.kind}`;
          if(plot.flags&1)probe.coupling='ac';
          if(scope.flags&MANUAL) {
            const fullScale=plot.scale>0?plot.scale:probe.kind==='current'?.1:5;
            const scale=plot.manual>0?plot.manual:2*fullScale/scope.divisions;
            if(Number.isFinite(scale)&&scale>0)probe.scale=scale;
            const offset=(scope.divisions+.1)*(plot.offset??0)/200;
            if(Math.abs(offset)<=8&&offset)probe.offset=offset;
            else if(Math.abs(offset)>8)warn('Scope trace vertical position is outside the Wires range');
          }
          pending.push({paneId,probe,line});
        }
      }catch(error){warn(error.message);}
    }

    const assignments={},activeTraces={},panes={},columns=new Map();
    const wireTraces=[];
    for(const item of pending) {
      if(item.probe.positive?.kind==='junction') {
        item.probe.id=`falstad-wire-${wireTraces.length+1}`;
        wireTraces.push(item.probe);
      }
    }
    const unresolved=wireTraces.length?new Set(Geometry.scopeChannels({...doc,probes:wireTraces}).unresolved):new Set();
    for(const {paneId,probe,line} of pending) {
      if(unresolved.has(probe.id)){
        warning(line,'UNSUPPORTED_SCOPE','The sampled wire has no simulator terminal');continue;
      }
      if(doc.probes.length>=maxTraces){
        warning(line,'SCOPE_LIMIT','Wires supports up to 32 scope traces');continue;
      }
      probe.id=`falstad-trace-${String(doc.probes.length+1).padStart(2,'0')}`;
      doc.probes.push(probe);
      assignments[probe.id]=paneId;
      if(panes[paneId])continue;
      const {speed,position,order,trigger,placement}=paneSettings.get(paneId);
      activeTraces[paneId]=probe.id;
      let division=timeDivision(doc.simulation.timeStep,speed);
      if(!placement) {
        if(!columns.has(position))columns.set(position,[]);
        const column=columns.get(position);
        if(column.length)division=panes[column[0].id].timeDivision;
        column.push({type:'scope',id:paneId});
      }
      panes[paneId]=placement?{...placement,timeDivision:division,order,weight:1}
        :{mode:'docked',timeDivision:division,order,x:24,y:64,width:640,height:280,weight:1};
      if(trigger)panes[paneId].trigger={...trigger,source:probe.id};
    }
    if(!Object.keys(panes).length)return;
    const rows=[...columns].sort(([a],[b])=>a-b).map(([,items])=>dock(items,'vertical'));
    doc.layout.scopes={version:1,open:rows.length>0,assignments,activeTraces,panes,height:260,dock:rows.length?dock(rows,'horizontal'):null};
  }

  const api=Object.freeze({restore});registry.falstad_scopes=api;
  if(common)module.exports=api;
})();
