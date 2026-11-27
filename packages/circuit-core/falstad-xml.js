'use strict';
// Small DOM-free reader for Falstad's XML vocabulary. No DTD/entity expansion.
(() => {
  const registry=globalThis.CircuitCoreModules ||= {};
  const textEscapes={'\\':'\\','\n':'n','\r':'r',' ':'s','+':'p','=':'q','#':'h','&':'a'};
  const escapeText=text=>text.replace(/[\\\n\r +=#&]/g,char=>'\\'+textEscapes[char])||'\\0';
  const gateTypes={And:'150',Nand:'151',Or:'152',Nor:'153',Xor:'154',Xnor:'431'};
  function read(text) {
    let cursor=0,root=null;const stack=[];
    const lineAt=offset=>text.slice(0,offset).split('\n').length;
    const fail=message=>{const error=new Error(message);error.line=lineAt(cursor);throw error;};
    const decode=value=>value.replace(/&([^;]*);|&/g,(raw,entity)=>{
      const named={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"};
      if(Object.hasOwn(named,entity))return named[entity];
      if(/^#(?:[0-9]+|x[0-9a-f]+)$/i.test(entity||'')){
        const n=entity[1].toLowerCase()==='x'?parseInt(entity.slice(2),16):Number(entity.slice(1));
        if(n===9||n===10||n===13||n>=32&&n<=0x10ffff&&!(n>=0xd800&&n<=0xdfff))return String.fromCodePoint(n);
      }
      return fail(`Invalid XML entity ${raw}`);
    });
    while(cursor<text.length) {
      if(/\s/.test(text[cursor])){cursor++;continue;}
      if(text.startsWith('<!--',cursor)){
        const end=text.indexOf('-->',cursor+4);if(end<0)fail('Unclosed XML comment');cursor=end+3;continue;
      }
      if(text.startsWith('<?xml ',cursor)&&!root&&stack.length===0){const end=text.indexOf('?>',cursor);if(end<0)fail('Unclosed XML declaration');cursor=end+2;continue;}
      if(text[cursor]!=='<'&&stack.length){
        const end=text.indexOf('<',cursor);if(end<0)fail('Unclosed XML element');
        stack.at(-1).text=(stack.at(-1).text||'')+decode(text.slice(cursor,end));cursor=end;continue;
      }
      if(text.startsWith('<!',cursor))fail('XML declarations and DTDs are not supported');
      const close=/^<\/([A-Za-z_][\w.-]*)\s*>/.exec(text.slice(cursor));
      if(close){if(stack.at(-1)?.name!==close[1])fail('Mismatched XML closing tag');stack.pop();cursor+=close[0].length;continue;}
      const open=/^<([A-Za-z_][\w.-]*)/.exec(text.slice(cursor));
      if(!open)fail('Expected an XML element');
      const node={name:open[1],attrs:Object.create(null),children:[],line:lineAt(cursor)};cursor+=open[0].length;
      let selfClosing=false;
      while(true){
        const whitespace=/^\s*/.exec(text.slice(cursor))[0];cursor+=whitespace.length;
        if(text.startsWith('/>',cursor)){cursor+=2;selfClosing=true;break;}
        if(text[cursor]==='>'){cursor++;break;}
        if(!whitespace)fail('Expected whitespace before XML attribute');
        const attribute=/^([A-Za-z_][\w.-]*)\s*=\s*(?:"([^"<]*)"|'([^'<]*)')/.exec(text.slice(cursor));
        if(!attribute)fail('Malformed XML attribute');
        if(Object.hasOwn(node.attrs,attribute[1]))fail(`Duplicate XML attribute ${attribute[1]}`);
        node.attrs[attribute[1]]=decode(attribute[2]??attribute[3]);cursor+=attribute[0].length;
      }
      if(stack.length)stack.at(-1).children.push(node);else {if(root)fail('Multiple XML roots');root=node;}
      if(!selfClosing){if(stack.length>=64)fail('XML nesting exceeds 64 levels');stack.push(node);}
    }
    if(stack.length)fail('Unclosed XML element');
    if(root?.text?.trim())fail('Unexpected text inside <cir>');
    if(root?.name!=='cir')fail('Expected Falstad <cir> root');
    return root;
  }
  function toLegacy(text) {
    const diagnostics=[],lines=[],sourceLines=[],scopes=new Map(),switchProperties=new Map(),optocouplers=new Map(),memoryContents=new Map(),crystals=new Set(),routes=new Map(),adjustables=new Map(),bitOrders=new Map();
    const error=(line,message)=>diagnostics.push({severity:'error',line,code:'UNSUPPORTED_XML_RECORD',message});
    let root;
    try{root=read(text.replace(/^\uFEFF/,''));}catch(cause){return {diagnostics:[{severity:'error',line:cause.line||1,code:'INVALID_XML',message:cause.message}]};}
    const emit=(line,value)=>{lines.push(value);sourceLines.push(line);};
    const check=(node,allowed)=>{for(const key of Object.keys(node.attrs))if(!allowed.includes(key))throw new Error(`Unsupported attribute ${key} on <${node.name}>`);};
    const numeric=(attrs,key,fallback)=>{const n=Object.hasOwn(attrs,key)?Number(attrs[key]):fallback;if(!Number.isFinite(n)||attrs[key]?.trim()==='')throw new Error(`Invalid XML numeric attribute ${key}`);return n;};
    try{
      check(root,['f','ts','ic','cb','pb','vr','mts','st']);
      if(numeric(root.attrs,'st',0)!==0)throw new Error('Alternative XML solver type is not supported');
      if(!root.children.length&&!Object.hasOwn(root.attrs,'f')&&!Object.hasOwn(root.attrs,'ts'))throw new Error('No supported components found');
      emit(root.line,`$ ${numeric(root.attrs,'f',0)} ${numeric(root.attrs,'ts',5e-6)} 10 50 5`);
    }catch(cause){error(root.line,cause.message);}
    const relayModels=new Map([['default',{}],['default-2-poles',{po:'2'}],['default-3-poles',{po:'3'}]]);
    const relayModelKeys=['in','ron','rof','on','of','coR','sw','cs','po','sb','pd'];
    for(const node of root.children){
      if(node.name!=='rlm')continue;
      try{
        const name=node.attrs.nm;
        check(node,['nm','f',...relayModelKeys]);
        if(!name||!name.trim()||relayModels.has(name)||node.children.length||node.text?.trim())throw new Error('Invalid or duplicate relay model name');
        numeric(node.attrs,'f',0);
        for(const key of relayModelKeys)if(Object.hasOwn(node.attrs,key))numeric(node.attrs,key);
        relayModels.set(name,node.attrs);
      }catch(cause){error(node.line,cause.message);}
    }
    const logicModels=new Map();
    for(const node of root.children){
      if(node.name!=='clm')continue;
      try{
        check(node,['nm','f','in','o','if']);
        const a=node.attrs;
        if(!a.nm||logicModels.has(a.nm)||numeric(a,'f',0)!==0||node.children.length)
          throw new Error('Invalid or unsupported custom logic model');
        const inputs=a.in??'',outputs=a.o??'';
        logicModels.set(a.nm,{inputs:inputs.split(',').filter(pin=>pin.trim()).length,outputs:outputs.split(',').filter(pin=>pin.trim()).length});
        emit(node.line,'! '+[a.nm,'0',inputs,outputs,a.if??a.nm,node.text?.trim()??''].map(escapeText).join(' '));
      }catch(cause){error(node.line,cause.message);}
    }
    for(const node of root.children){
      const {name,attrs:a,line}=node;
      if(name==='rlm'||name==='clm')continue;
      if(name==='o'||name==='Scope'){
        emit(line,name==='Scope'?'403':'o');scopes.set(lines.length,node);continue;
      }
      if(name==='adj'){emit(line,'&');adjustables.set(lines.length,node);continue;}
      if(name==='h'){emit(line,name);continue;}
      try{
        if((node.children.length&&!['cr','dar','OTA','Comparator','Optocoupler'].includes(name))||(!['rw','SRAM','ROM'].includes(name)&&node.text?.trim()))throw new Error(`Unsupported nested XML record <${name}>`);
        const voltage=['wf','fr','maxv','bias','phaseShift','dutyCycle','riseTime','ir'];
        const gate=Object.hasOwn(gateTypes,name);
        const counterType={RingCounter:'163',Decade:'163',ctr:'164',Counter:'164',ctr2:'421',Counter2:'421'}[name];
        const discreteType={mux:'184',dmux:'185',ADC:'167',DAC:'166',SevenSegDecoder:'197',PhaseComp:'161',VCO:'158',Monostable:'194',AnalogMux:'432',SipoShift:'189',PisoShift:'186',SeqGen:'188',cl:'208',SRAM:'413',ROM:'436',BusTransceiver:'BusTransceiver'}[name];
        const routing=discreteType==='184'||discreteType==='185',converter=discreteType==='166'||discreteType==='167';
        const controlledType={VCVS:'212',VCCS:'213',CCVS:'214',CCCS:'215'}[name];
        const flipFlopType={DFlipFlop:'155',JKFlipFlop:'156',TFlipFlop:'193'}[name];
        const flipFlopState=flipFlopType==='156'?'v3':'v1';
        const memory=name==='SRAM'||name==='ROM';
        const shift=discreteType==='189'||discreteType==='186';
        const allowed=discreteType?['hv','bi','bo',...(routing?['se',name==='mux'?'im':'om','dw']:name==='SevenSegDecoder'?['sgt']:name==='AnalogMux'?['sb','ron','rof','thr']:name==='Monostable'?['rt','dl']:shift?['dt']:name==='SeqGen'?['bc','dt']:memory?['ab','db']:name==='BusTransceiver'?['db']:name==='cl'?['mo',...Array.from({length:32},(_,i)=>'v'+i)]:[])]:gate?['in','o','hi','pd']:controlledType?['hv','ic','ex']:flipFlopType?['hv',flipFlopState]:counterType?
          ['bi','bo','hv',...(counterType==='163'?[]:counterType==='164'?['in','mo']:['mo']),...Array.from({length:32},(_,i)=>'v'+i)]:{
          dar:['pnp'],Unijunction:[],OpAmpReal:['slr','vd','cl','mt'],Comparator:[],OTA:['pv','nv'],Optocoupler:['ctr','dmo'],
          RelayCoil:['lb','in','oc','cr','ofc','swt','tp','ci','st','sp'],RelayContact:['lb','ron','roff','ip'],
          TimeDelayRelay:['ond','ofd','onr','ofr'],MotorProtectionSwitch:['re','i2','bl','la'],
          cr:['pc','sc','in','r'],CrossSwitch:['p','mm','lab','key','r'],Gyrator:[],DelayBuffer:['dl','th','hv'],ts:['ron','roff','rog','hi','bw'],
          w:[],rw:[],ln:['te'],x:['si','te'],b:[],Line:[],t:['pn','be','mo','vbe','vbc'],f:['vt','be'],j:['vt','be'],r:['r'],c:['c','iv','sr','vd'],pc:['c','iv','sr','vd','mv'],l:['l','ic','isat','i'],
          v:voltage,R:voltage,A:voltage,VarRail:[...voltage,'st'],sw:['mi','ma','mv','sw'],tl:['de','im','wi'],
          AM:['cf','sf','mv'],FM:['cf','sf','mv','dv'],aout:['du','sa','la'],
          T:['in','ra','co','wi','isat','c0','c1'],tt:['in','ra','co','c0','c1','c2'],
          as:['ron','roff','th'],as2:['ron','roff','th'],Schmitt:['slr','lt','ut','lon','loff'],InvertingSchmitt:['slr','lt','ut','lon','loff'],
          Ammeter:['me','sc'],TestPoint:['me','lb'],m:['ron','rof','do','to','mo'],dd:['bc','dm','bo','hv'],
          ssd:['bi','bo','hv','ba','ex','di'],LEDArray:['sx','sy'],
          SparkGap:['on','of','br','ho'],TunnelDiode:[],Lamp:['te','np','nv','wa','co'],Varactor:['mo','ca','ba'],Triode:['mu','kg'],
          rl:['mo','i','ip','po','in','ron','roff','on','coR','of','sw'],Timer:['hv','v5'],SCR:['tr','ho','gr'],Diac:['ron','roff','bd','hc'],Triac:['ti','hi','cr','st'],
          CC2:['hv','ga'],CC2Neg:['hv','ga'],
          a:['ma','mi','ga','vd'],g:['sy'],i:['cu','mv'],s:['p','mm','lab','key','r'],O:['sc'],L:['p','mm','lab','key','r','hi','lo'],
          M:['th'],d:['mo'],z:['mo'],LED:['mo','cr','cg','cb','mbc'],S:['p','mm','lab','key','r','li','th'],pt:['ma','po','sl','li'],I:['sl','hi'],p:['me','sc','re'],
        }[name];
        if(!allowed)throw new Error(`Unsupported Falstad XML component <${name}>`);
        check(node,['x','f',...allowed]);
        if(!a.x||a.x.trim().split(/\s+/).length!==4)throw new Error(`Expected four coordinates on <${name}>`);
        const defaultFlags={RelayContact:4,sw:2,as:2,as2:2,Ammeter:3,Triode:2,SCR:1};
        const conveyor=name==='CC2'||name==='CC2Neg';
        let flags=numeric(a,'f',defaultFlags[name]??0);if(!Number.isSafeInteger(flags)||flags<0||flags>(discreteType||flipFlopType||conveyor||controlledType||counterType||['Timer','dd','ssd','LEDArray','TimeDelayRelay','Optocoupler'].includes(name)?16383:255))throw new Error('Invalid XML component flags');const num=(key,fallback)=>numeric(a,key,fallback);let fields=[];
        if(discreteType){
          const order=num('bo',0),voltage=num('hv',5);
          if(![0,1].includes(order)||routing&&num(name==='mux'?'im':'om',0)!==0)throw new Error('Bus chip pins are not supported');
          if(voltage!==5||flags&8192)flags|=8192;
          fields=[...(converter||shift?[num('bi',shift?8:4)]:[]),...(flags&8192?[voltage]:[])];
          if(shift)fields.push(...(a.dt?.trim()||'0').split(/\s+/));
          if(name==='SeqGen'){
            flags|=2;
            const length=num('bc',8);
            fields.push(length);
            if(length)fields.push(...(a.dt?.trim()||'0').split(/\s+/));
          }
          if(memory){
            fields.push(num('ab',4),num('db',4));
            memoryContents.set(lines.length+1,node.text?.trim()??'');
          }
          if(name==='BusTransceiver')fields.push(num('db',4));
          if(name==='cl'){
            const name=a.mo??'default',model=logicModels.get(name);
            if(!model)throw new Error('Unknown custom logic model');
            fields.push(escapeText(name),...Array.from({length:model.outputs},(_,i)=>num('v'+(model.inputs+i),0)));
          }
          if(routing)fields.push(num('se',2));
          if(name==='AnalogMux')fields.push(num('sb',2),num('ron',20),num('rof',1e10),num('thr',2.5));
          if(name==='Monostable')fields.push(a.rt??'false',num('dl',.01));
          if(name==='SevenSegDecoder')fields.push(num('sgt',0));
          bitOrders.set(lines.length+1,order);
        }
        if(counterType){
          const ring=counterType==='163',binary=counterType==='164';
          const bits=num('bi',ring?10:4),order=num('bo',0),voltage=num('hv',5);
          if(!Number.isInteger(bits)||bits<(binary?3:2)||bits>30)throw new Error('Unsupported counter width');
          if(![0,1].includes(order))throw new Error('Bus counter pins are not supported');
          if(voltage!==5||flags&8192)flags|=8192;
          const outputs=Array.from({length:bits},(_,i)=>num('v'+(i+(ring||binary?2:0)),0));
          fields=[bits,...(flags&8192?[voltage]:[]),...outputs];
          if(binary)fields.push(a.in??'false');
          if(!ring)fields.push(num('mo',0));
          bitOrders.set(lines.length+1,order);
        }
        if(controlledType){
          if(a.hv!==undefined)flags|=8192;
          const expression=a.ex??(name.startsWith('CC')?'2*a':'.1*(a-b)');
          fields=[...(flags&8192?[num('hv',5)]:[]),num('ic',2),escapeText(expression)];
        }
        if(['dar','OTA','Comparator','Optocoupler'].includes(name)){
          const types={dar:['t','t'],OTA:['R','R',...Array(16).fill('t')],Comparator:['a','as','g'],Optocoupler:['d','CCCS','t']}[name];
          const saved=new Set();
          for(const child of node.children){
            const index=numeric(child.attrs,'ix',-1);
            if(types[index]!==child.name||saved.has(index)||child.children.length||child.text?.trim())
              throw new Error('Invalid analog component internal state');
            const keys={t:['vbe','vbc'],a:['vd'],d:['vd'],CCCS:[],as:[],g:[],R:[]}[child.name];
            check(child,['ix',...keys]);
            for(const key of keys)numeric(child.attrs,key,0);
            saved.add(index);
          }
          if(saved.size)diagnostics.push({severity:'warning',line,code:'RESET_STATE',message:'Analog component internal voltages are recalculated at startup'});
        }
        if(name==='dar'){
          const polarity=num('pnp',1);
          fields=[0,1].map(()=>flags&1?escapeText(`0 ${polarity} 0 0 100`):`0_${polarity}_0_0_100`);
          fields.push(polarity);
        }
        if(name==='OpAmpReal')fields=[num('slr',.6),num('vd',0),num('cl',.0231),num('mt',0)];
        if(name==='OTA')fields=[num('nv',-9),num('pv',9)].map(v=>flags&1?escapeText(`0 0 40 ${v} 0 0 .5`):`0_0_40_${v}_0_0_.5`);
        if(name==='Optocoupler')optocouplers.set(lines.length+1,{ctr:num('ctr',1),diodeModel:a.dmo??'default'});
        if(name==='RelayCoil')fields=[escapeText(a.lb??'label'),num('in',.2),num('ci',0),num('oc',.02),num('cr',20),num('ofc',.015),num('swt',.005),num('tp',0),num('st',0),num('sp',0)];
        if(name==='RelayContact')fields=[escapeText(a.lb??'label'),num('ron',.05),num('roff',1e6),num('ip',0)];
        if(name==='TimeDelayRelay')fields=[num('ond',1),num('ofd',0),num('onr',1),num('ofr',1e7)];
        if(name==='MotorProtectionSwitch')fields=[num('re',.0613),num('i2',6.73),a.bl??'false',escapeText(a.la??'')];
        if(name==='cr'){
          const saved=new Map();
          for(const child of node.children){
            const index=numeric(child.attrs,'ix',-1),key=index===2?'i':'vd';
            if(![0,1,2].includes(index)||child.name!==(index===2?'l':'c')||saved.has(index)||child.children.length||child.text?.trim())
              throw new Error('Invalid crystal internal state');
            check(child,['ix',key]);
            saved.set(index,numeric(child.attrs,key,0));
          }
          if([...saved.values()].some(value=>value!==0))diagnostics.push({severity:'warning',line,code:'RESET_STATE',message:'Crystal internal voltage and current restart at their defaults'});
          fields=[num('pc',28.7e-12),num('sc',.1e-12),num('in',2.5e-3),num('r',6.4)];
          crystals.add(lines.length+1);
        }
        if(name==='CrossSwitch'){
          const label=a.lab??'';
          fields=[num('p',0),a.mm??'false'];
          if(flags&4)fields.push(escapeText(label));
          if(a.key)diagnostics.push({severity:'warning',line,code:'UNSUPPORTED_PRESENTATION',message:'Switch keyboard shortcut is unavailable'});
          switchProperties.set(lines.length+1,{label,resistance:num('r',0)});
        }
        if(name==='DelayBuffer')fields=[num('dl',0),num('th',2.5),num('hv',5)];
        if(name==='ts'){
          if(num('bw',1)!==1)throw new Error('Bus tristate buffer pins are not supported');
          fields=[num('ron',.1),num('roff',1e10),num('rog',1e8),num('hi',5)];
        }
        if(name==='ln'){
          flags|=4;fields=[escapeText(a.te??'label')];
        }
        if(name==='x'){
          flags|=4;
          fields=[num('si',24),escapeText(a.te??'hello')];
        }
        if(name==='t'){
          const model=a.mo??'default';
          if(!model||/\s/.test(model))throw new Error(`Unsupported XML transistor model ${model}`);
          fields=[num('pn',1),num('vbe',0),num('vbc',0),num('be',100),model];
        }
        if(name==='f'||name==='j')fields=[num('vt',name==='f'?1.5:-4),num('be',name==='f' ? .02 : .00125)];
        if(name==='pt'){
          if(num('li',0)!==0)throw new Error('Linked XML potentiometers are not supported');
          if(/[\r\n]/.test(a.sl||''))throw new Error('Multiline potentiometer labels are not supported');
          fields=[num('ma',1000),num('po',.5),a.sl||'Resistance'];
        }
        if(name==='VarRail'){
          if(num('wf',7)!==7||num('riseTime',0)!==0||num('ir',0)!==0)throw new Error('Unsupported variable-voltage source settings');
          if(/[\r\n]/.test(a.st||''))throw new Error('Multiline voltage labels are not supported');
          fields=[7,num('fr',5),num('maxv',5),num('bias',0),0,.5,a.st||'Voltage'];
        }
        if(name==='r')fields=[num('r',100)];
        if(name==='c'||name==='pc'){
          flags|=4;fields=[num('c',1e-5),num('vd',0),num('iv',.001),num('sr',0)];
          if(name==='pc')fields.push(num('mv',1));
        }
        if(name==='Ammeter')fields=[num('me',0),num('sc',0)];
        if(name==='dd'||name==='ssd'){
          const order=num('bo',0),voltage=num('hv',5);
          if(![0,1].includes(order))throw new Error('Bus display pins are not supported');
          if(voltage!==5)flags|=8192;
          if(a.bi!==undefined)num('bi');
          const configuration=name==='dd'?[num('bc',4),num('dm',0)]:[num('ba',7),num('ex',0),num('di',0)];
          fields=[...(flags&8192?[voltage]:[]),...configuration];
          bitOrders.set(lines.length+1,order);
        }
        if(name==='LEDArray')fields=[num('sx',8),num('sy',8)];
        if(name==='m')fields=[num('ron',100),num('rof',16000),num('do',0),num('to',1e-8),num('mo',1e-10)];
        if(name==='SparkGap')fields=[num('on',1e3),num('of',1e9),num('br',1e3),num('ho',.001)];
        if(name==='Lamp')fields=[num('te',300),num('np',100),num('nv',120),num('wa',.4),num('co',.4)];
        if(name==='Varactor'){
          if((a.mo??'default')!=='default')throw new Error('Only the default varactor diode model is supported');
          flags=0;fields=[num('ca',0),num('ba',4e-12)];
        }
        if(name==='Triode')fields=[num('mu',93),num('kg',680)];
        if(name==='SCR')fields=[0,0,num('tr',.01),num('ho',.0082),num('gr',50)];
        if(name==='Diac')fields=[num('ron',500),num('roff',1e8),num('bd',30),num('hc',.01)];
        if(name==='Triac')fields=[num('ti',.01),num('hi',.0082),num('cr',100),a.st??'false'];
        if(name==='rl'){
          if(flags>31)throw new Error('Unsupported relay flags');
          const model=a.mo===undefined?a:relayModels.get(a.mo);
          if(!model)throw new Error(`Unknown relay model ${a.mo}`);
          if(a.mo!==undefined){
            const style=numeric(model,'cs',0);
            if(![0,1,2].includes(style))throw new Error('Invalid relay coil style');
            flags=(flags&8)|(style===0?4:style===2?1:0)|(numeric(model,'sb',1)?2:0)|(numeric(model,'pd',1)?16:0);
          }
          const m=(key,fallback)=>numeric(model,key,fallback);
          fields=[m('po',1),m('in',.2),num('i',0),m('ron',.05),m(a.mo===undefined?'roff':'rof',1e6),
            m('on',.02),m('coR',20),m('of',.015),m('sw',.005),num('ip',0)];
        }
        if(conveyor){
          if(a.hv!==undefined)flags|=8192;
          fields=[...(flags&8192?[num('hv',5)]:[]),num('ga',1)];
        }
        if(name==='Timer'){
          const voltage=num('hv',5);
          if(a.hv!==undefined)flags|=8192;
          fields=flags&8192?[voltage,num('v5',0)]:[num('v5',0)];
        }
        if(flipFlopType){
          const voltage=num('hv',5);
          flags=voltage===5?flags&~8192:flags|8192;
          fields=voltage===5?[num(flipFlopState,0)]:[voltage,num(flipFlopState,0)];
        }
        if(name==='TestPoint'){
          flags|=1;fields=[num('me',0),escapeText(a.lb??'TP')];
        }
        if(name==='l')fields=[num('l',1),num('i',0),num('ic',0),num('isat',0)];
        if(name==='v'||name==='R'||name==='A'){
          if(num('riseTime',0)!==0||num('ir',0)!==0)throw new Error('Source rise time/internal resistance is not supported');
          flags=(flags&~2)|4; // XML has explicit phase/duty; legacy compatibility flags do not apply.
          fields=[num('wf',0),num('fr',40),num('maxv',5),num('bias',0),num('phaseShift',0),num('dutyCycle',.5)];
        }
        if(name==='sw')fields=[num('mi',20),num('ma',4000),num('mv',5),num('sw',.1)];
        if(name==='tl')fields=[num('de',1000*numeric(root.attrs,'ts',5e-6)),num('im',75),num('wi'),0];
        if(name==='T'||name==='tt'){
          fields=[num('in',4),num('ra',1),num('c0',0),num('c1',0)];
          if(name==='tt')fields.push(num('c2',0),num('co',.99));
          else {
            fields.push(num('co',.999),num('isat',0));
            if(Object.hasOwn(a,'wi'))fields.push(num('wi'));
          }
        }
        if(name==='AM'||name==='FM'){
          fields=[num('cf',name==='AM'?1000:800),num('sf',40),num('mv',5)];
          if(name==='FM')fields.push(num('dv',200));
        }
        if(name==='aout')fields=[num('du',1),num('sa',8000),num('la',1)];
        if(name==='I')fields=[num('sl',.5),num('hi',5)];
        if(name==='as'||name==='as2')fields=[num('ron',20),num('roff',1e10),num('th',2.5)];
        if(name==='Schmitt'||name==='InvertingSchmitt')fields=[num('slr',.5),num('lt',1.66),num('ut',3.33),num('lon',5),num('loff',0)];
        if(gate)fields=[num('in',2),num('o',0),num('hi',5),num('pd',0)];
        if(name==='p')fields=[num('me',0),num('sc',0),num('re',0)];
        if(name==='a'){
          flags=(flags&~4)|8;
          fields=[num('ma',15),num('mi',-15),1e6,0,0,num('ga',100000)];
          if(num('vd',0)!==0)diagnostics.push({severity:'warning',line,code:'RESET_STATE',message:'The simulator recalculates the op-amp input voltage difference on startup'});
        }
        if(name==='g')fields=[num('sy',0)];
        if(name==='i'){
          const value=num('cu',.01);if(value===0)throw new Error('Zero XML current sources are not supported');fields=[value,num('mv',0)];
        }
        if(name==='s'||name==='L'||name==='S'){
          if(a.lab||a.key||num('r',0)!==0)throw new Error('XML switch label, shortcut or resistance is not supported');
          if(a.mm!==undefined&&!['true','false'].includes(a.mm))throw new Error('Invalid XML switch momentary attribute');
          fields=[num('p',0),a.mm||'false'];
          if(name==='L')fields.push(num('hi',5),num('lo',0));
          if(name==='S')fields.push(num('li',0),num('th',2));
        }
        if(name==='O')fields=[num('sc',0)];
        if(name==='M')fields=[num('th',2.5)];
        if(name==='d'||name==='z'||name==='LED'){
          const model=a.mo??(name==='z'?'default-zener':name==='LED'?'default-led':'default');
          flags=2;fields=[escapeText(model)];
          if(name==='LED')fields.push(num('cr',1),num('cg',0),num('cb',0),num('mbc',.01));
        }
        const coordinates=a.x.trim().split(/\s+/);
        if(name==='rw'&&node.text?.trim()){
          const points=node.text.trim().split(';').map(pair=>{
            const [x,y]=pair.trim().split(',').map(Number);
            if(!/^\s*-?\d+\s*,\s*-?\d+\s*$/.test(pair)||!Number.isSafeInteger(x)||!Number.isSafeInteger(y))throw new Error('Invalid routed wire point');
            return {x,y};
          });
          const [x1,y1,x2,y2]=coordinates.map(Number);
          if(points.length>=2&&points[0].x===x1&&points[0].y===y1&&points.at(-1).x===x2&&points.at(-1).y===y2){
            routes.set(lines.length+1,points.slice(1,-1));
          }else diagnostics.push({severity:'warning',line,code:'UNSUPPORTED_PRESENTATION',message:'Saved wire route endpoints differ from the circuit. The wire will use an orthogonal route.'});
        }
        const type=gate?gateTypes[name]:discreteType||counterType||controlledType||flipFlopType||{
          dar:'400',Comparator:'401',OTA:'402',Optocoupler:'407',OpAmpReal:'409',Unijunction:'417',RelayCoil:'425',RelayContact:'426',TimeDelayRelay:'414',MotorProtectionSwitch:'428',cr:'412',CrossSwitch:'430',DelayBuffer:'422',ts:'180',pt:'174',VarRail:'172',sw:'170',tl:'171',tt:'169',ln:'207',rw:'w',AM:'200',FM:'201',aout:'211',
          LED:'162',as:'159',as2:'160',Schmitt:'182',InvertingSchmitt:'183',pc:'209',Ammeter:'370',TestPoint:'368',dd:'419',
          ssd:'157',LEDArray:'405',
          SparkGap:'187',TunnelDiode:'175',Lamp:'181',Varactor:'176',Triode:'173',Line:'423',
          SCR:'177',Diac:'203',Triac:'206',Timer:'165',rl:'178',CC2:'179',CC2Neg:'179',
        }[name]||name;
        emit(line,`${type} ${coordinates.join(' ')} ${flags} ${fields.join(' ')}`.trim());
      }catch(cause){error(line,cause.message);}
    }
    return {text:lines.join('\n'),sourceLines,diagnostics,scopes,routes,adjustables,bitOrders,switchProperties,optocouplers,memoryContents,crystals};
  }
  const api=Object.freeze({toLegacy});registry.falstad_xml=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})();
