'use strict';
// Small DOM-free reader for Falstad's XML vocabulary. No DTD/entity expansion.
(() => {
  const registry=globalThis.CircuitCoreModules ||= {};
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
    const diagnostics=[],lines=[],sourceLines=[];
    const error=(line,message)=>diagnostics.push({severity:'error',line,code:'UNSUPPORTED_XML_RECORD',message});
    let root;
    try{root=read(text.replace(/^\uFEFF/,''));}catch(cause){return {diagnostics:[{severity:'error',line:cause.line||1,code:'INVALID_XML',message:cause.message}]};}
    const emit=(line,value)=>{lines.push(value);sourceLines.push(line);};
    const check=(node,allowed)=>{for(const key of Object.keys(node.attrs))if(!allowed.includes(key))throw new Error(`Unsupported attribute ${key} on <${node.name}>`);};
    const numeric=(attrs,key,fallback)=>{const n=Object.hasOwn(attrs,key)?Number(attrs[key]):fallback;if(!Number.isFinite(n)||attrs[key]?.trim()==='')throw new Error(`Invalid XML numeric attribute ${key}`);return n;};
    try{
      check(root,['f','ts','ic','cb','pb','vr','mts','st']);
      if(numeric(root.attrs,'st',0)!==0)throw new Error('Alternative XML solver type is not supported');
      emit(root.line,`$ ${numeric(root.attrs,'f',0)} ${numeric(root.attrs,'ts',5e-6)} 10 50 5`);
    }catch(cause){error(root.line,cause.message);}
    for(const node of root.children){
      const {name,attrs:a,line}=node;
      if(['o','h','adj'].includes(name)){emit(line,name==='adj'?'&':name);continue;}
      try{
        if(node.children.length||node.text?.trim())throw new Error(`Unsupported nested XML record <${name}>`);
        const allowed={w:[],r:['r'],c:['c','iv','sr','vd'],l:['l','ic','isat','i'],v:['wf','fr','maxv','bias','phaseShift','dutyCycle','riseTime','ir'],R:['wf','fr','maxv','bias','phaseShift','dutyCycle','riseTime','ir'],a:['ma','mi','ga'],g:['sy'],i:['cu','mv'],s:['p','mm','lab','key','r'],O:['sc'],L:['p','mm','lab','key','r','hi','lo'],M:['th'],d:['mo'],S:['p','mm','lab','key','r','li','th'],pt:['ma','po','sl','li'],VarRail:['wf','fr','maxv','bias','phaseShift','dutyCycle','riseTime','ir','st']}[name];
        if(!allowed)throw new Error(`Unsupported Falstad XML component <${name}>`);
        check(node,['x','f',...allowed]);
        if(!a.x||a.x.trim().split(/\s+/).length!==4)throw new Error(`Expected four coordinates on <${name}>`);
        let flags=numeric(a,'f',0);if(!Number.isSafeInteger(flags)||flags<0||flags>255)throw new Error('Invalid XML component flags');const num=(key,fallback)=>numeric(a,key,fallback);let fields=[];
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
        if(name==='c'){flags|=4;fields=[num('c',1e-5),num('vd',0),num('iv',.001),num('sr',0)];}
        if(name==='l')fields=[num('l',1),num('i',0),num('ic',0),num('isat',0)];
        if(name==='v'||name==='R'){
          if(num('riseTime',0)!==0||num('ir',0)!==0)throw new Error('Source rise time/internal resistance is not supported');
          flags=(flags&~2)|4; // XML has explicit phase/duty; legacy compatibility flags do not apply.
          fields=[num('wf',0),num('fr',40),num('maxv',5),num('bias',0),num('phaseShift',0),num('dutyCycle',.5)];
        }
        if(name==='a'){flags=(flags&~4)|8;fields=[num('ma',15),num('mi',-15),1e6,0,0,num('ga',100000)];}
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
        if(name==='d'){
          const model=a.mo||'default';if(/\s/.test(model))throw new Error(`Unsupported XML diode model ${model}`);flags=2;fields=[model];
        }
        const type={pt:'174',VarRail:'172'}[name]||name;
        emit(line,`${type} ${a.x.trim().split(/\s+/).join(' ')} ${flags} ${fields.join(' ')}`.trim());
      }catch(cause){error(line,cause.message);}
    }
    return {text:lines.join('\n'),sourceLines,diagnostics};
  }
  const api=Object.freeze({toLegacy});registry.falstad_xml=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})();
