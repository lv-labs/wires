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
    const diagnostics=[],lines=[],sourceLines=[],scopes=new Map(),routes=new Map();
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
    for(const node of root.children){
      const {name,attrs:a,line}=node;
      if(name==='o'){
        emit(line,'o');scopes.set(lines.length,node);continue;
      }
      if(name==='h'||name==='adj'){emit(line,name==='adj'?'&':name);continue;}
      try{
        if(node.children.length||(name!=='rw'&&node.text?.trim()))throw new Error(`Unsupported nested XML record <${name}>`);
        const voltage=['wf','fr','maxv','bias','phaseShift','dutyCycle','riseTime','ir'];
        const gate=Object.hasOwn(gateTypes,name);
        const flipFlopType={DFlipFlop:'155',JKFlipFlop:'156',TFlipFlop:'193'}[name];
        const flipFlopState=flipFlopType==='156'?'v3':'v1';
        const allowed=gate?['in','o','hi','pd']:flipFlopType?['hv',flipFlopState]:{
          w:[],rw:[],ln:['te'],x:['si','te'],b:[],Line:[],t:['pn','be','mo','vbe','vbc'],f:['vt','be'],j:['vt','be'],r:['r'],c:['c','iv','sr','vd'],pc:['c','iv','sr','vd','mv'],l:['l','ic','isat','i'],
          v:voltage,R:voltage,A:voltage,VarRail:[...voltage,'st'],sw:['mi','ma','mv','sw'],tl:['de','im','wi'],
          AM:['cf','sf','mv'],FM:['cf','sf','mv','dv'],aout:['du','sa','la'],
          T:['in','ra','co','wi','isat','c0','c1'],tt:['in','ra','co','c0','c1','c2'],
          as:['ron','roff','th'],as2:['ron','roff','th'],Schmitt:['slr','lt','ut','lon','loff'],InvertingSchmitt:['slr','lt','ut','lon','loff'],
          Ammeter:['me','sc'],TestPoint:['me','lb'],m:['ron','rof','do','to','mo'],dd:['bc','dm','bo','hv'],
          SparkGap:['on','of','br','ho'],TunnelDiode:[],Lamp:['te','np','nv','wa','co'],Varactor:['mo','ca','ba'],Triode:['mu','kg'],
          a:['ma','mi','ga','vd'],g:['sy'],i:['cu','mv'],s:['p','mm','lab','key','r'],O:['sc'],L:['p','mm','lab','key','r','hi','lo'],
          M:['th'],d:['mo'],z:['mo'],LED:['mo','cr','cg','cb','mbc'],S:['p','mm','lab','key','r','li','th'],pt:['ma','po','sl','li'],I:['sl','hi'],p:['me','sc','re'],
        }[name];
        if(!allowed)throw new Error(`Unsupported Falstad XML component <${name}>`);
        check(node,['x','f',...allowed]);
        if(!a.x||a.x.trim().split(/\s+/).length!==4)throw new Error(`Expected four coordinates on <${name}>`);
        const defaultFlags={sw:2,as:2,as2:2,Ammeter:3,Triode:2};
        let flags=numeric(a,'f',defaultFlags[name]??0);if(!Number.isSafeInteger(flags)||flags<0||flags>(flipFlopType||name==='dd'?16383:255))throw new Error('Invalid XML component flags');const num=(key,fallback)=>numeric(a,key,fallback);let fields=[];
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
        if(name==='dd'){
          if(num('bo',0)!==0||num('hv',5)!==5)throw new Error('Unsupported decimal display bit order or logic voltage');
          fields=[num('bc',4),num('dm',0)];
        }
        if(name==='m')fields=[num('ron',100),num('rof',16000),num('do',0),num('to',1e-8),num('mo',1e-10)];
        if(name==='SparkGap')fields=[num('on',1e3),num('of',1e9),num('br',1e3),num('ho',.001)];
        if(name==='Lamp')fields=[num('te',300),num('np',100),num('nv',120),num('wa',.4),num('co',.4)];
        if(name==='Varactor'){
          if((a.mo??'default')!=='default')throw new Error('Only the default varactor diode model is supported');
          flags=0;fields=[num('ca',0),num('ba',4e-12)];
        }
        if(name==='Triode')fields=[num('mu',93),num('kg',680)];
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
        const type=gate?gateTypes[name]:flipFlopType||{
          pt:'174',VarRail:'172',sw:'170',tl:'171',tt:'169',ln:'207',rw:'w',AM:'200',FM:'201',aout:'211',
          LED:'162',as:'159',as2:'160',Schmitt:'182',InvertingSchmitt:'183',pc:'209',Ammeter:'370',TestPoint:'368',dd:'419',
          SparkGap:'187',TunnelDiode:'175',Lamp:'181',Varactor:'176',Triode:'173',Line:'423',
        }[name]||name;
        emit(line,`${type} ${coordinates.join(' ')} ${flags} ${fields.join(' ')}`.trim());
      }catch(cause){error(line,cause.message);}
    }
    return {text:lines.join('\n'),sourceLines,diagnostics,scopes,routes};
  }
  const api=Object.freeze({toLegacy});registry.falstad_xml=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})();
