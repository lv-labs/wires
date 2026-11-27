'use strict';
// Portable computation module: no DOM, renderer, storage or worker construction.
(() => {
  const registry=globalThis.CircuitCoreModules ||= {};
  const Catalog=typeof module==='object'&&module.exports?require('./catalog.js'):registry.catalog;
  const clone=value=>structuredClone(value),{grid,definitions,placementDefinitions,outputSpecs,graphic}=Catalog;
  const snap = n => Math.round(n / grid) * grid;
  const token = (kind, id) => JSON.stringify([kind, id]);
  const referenceKey = ref => ref.kind === 'pin' ? JSON.stringify(['pin', ref.componentId, ref.pinId]) : JSON.stringify(['junction', ref.junctionId]);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const pinCenteredSources = new Set(['antennaSource','amSource','fmSource','noiseSource']);
  const bitDisplays = new Set(['decimalDisplay','instructionDisplay']);
  function pin(document, ref) {
    if (ref.kind === 'junction') return document.layout.junctions[ref.junctionId];
    const component = document.electrical.components.find(c => c.id === ref.componentId);
    const pose = document.layout.components[component.id], offset = Catalog.componentPins(component)[ref.pinId];
    const [rx, ry] = rotateOffset(offset[0] * (pose.mirror ? -1 : 1), offset[1], pose.rotation);
    return { x: pose.x + rx, y: pose.y + ry };
  }
  function rotateOffset(x, y, rotation) {
    return [[x, y], [-y, x], [-x, -y], [y, -x]][((rotation / 90) % 4 + 4) % 4];
  }
  function placementPose(kind, point, rotation = 0, mirror = false) {
    const def = definitions[kind] || placementDefinitions[kind], pins = Object.values(def.pins);
    const offset = pins.length === 1 ? rotateOffset(pins[0][0] * (mirror ? -1 : 1), pins[0][1], rotation) : [0, 0];
    return { x: snap(point.x) - offset[0], y: snap(point.y) - offset[1], rotation, mirror };
  }
  function flipPose(pose, axis) {
    pose.rotation = ((axis === 'x' ? -pose.rotation : 180 - pose.rotation) + 360) % 360;
    pose.mirror = !pose.mirror;
  }
  function probePoint(document, probe) {
    const anchor = pin(document, probe.positive), offset = document.layout.probes?.[probe.id] || { x: 50, y: -100 };
    return { x: anchor.x + offset.x, y: anchor.y + offset.y };
  }
  function probeBounds(document, probe, voltage) {
    const point = probePoint(document, probe);
    const display = document.layout.probes?.[probe.id];
    const decimals = display?.decimals ?? 3;
    const magnitude = Math.abs(voltage ?? 0).toFixed(decimals);
    const voltageWidth = (magnitude.length + 3) * 22.5;
    const nameWidth = display?.showLabel ? Array.from(probe.label || 'Wire').length * 16.875 : 0;
    const horizontalPadding = 15.625;
    const width = Math.max(voltageWidth, nameWidth) + 2 * horizontalPadding;
    const center = point.x + (4 + (decimals ? decimals + 1 : 0)) * 22.5 / 2;
    const top = point.y - (display?.showLabel ? 90.625 : 43.75);
    return { x: center - width / 2, y: top, right: center + width / 2, bottom: point.y + 37.5 };
  }
  function probeVoltage(document, probe, frame) {
    if (!frame) return undefined;
    function voltage(ref) {
      const queue = [ref], visited = new Set();
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i], key = referenceKey(item); if (visited.has(key)) continue; visited.add(key);
        if (item.kind === 'pin') {
          const value = frame.pinVoltages[item.componentId]?.[item.pinId]; if (Number.isFinite(value)) return value;
        }
        for (const w of document.electrical.wires) if (referenceKey(w.from) === key) queue.push(w.to); else if (referenceKey(w.to) === key) queue.push(w.from);
      }
    }
    const positive = voltage(probe.positive), negative = probe.reference === 'ground' ? 0 : voltage(probe.negative);
    return Number.isFinite(positive) && Number.isFinite(negative) ? positive - negative : undefined;
  }
  function scopeChannels(document) {
    const resolved = new Map();
    let connections;
    function terminal(start) {
      const startKey = referenceKey(start);
      if (resolved.has(startKey)) return resolved.get(startKey);
      if (!connections) {
        connections = new Map();
        for (const { from, to } of document.electrical.wires) for (const [end, other] of [[from, to], [to, from]]) {
          const key = referenceKey(end);
          if (!connections.has(key)) connections.set(key, []);
          connections.get(key).push(other);
        }
      }
      const queue = [start], seen = new Set(), pins = [];
      for (let i = 0; i < queue.length; i++) {
        const ref = queue[i], key = referenceKey(ref); if (seen.has(key)) continue; seen.add(key);
        if (ref.kind === 'pin') pins.push(ref);
        for (const other of connections.get(key) || []) queue.push(other);
      }
      pins.sort((a, b) => referenceKey(a) < referenceKey(b) ? -1 : referenceKey(a) > referenceKey(b) ? 1 : 0);
      const result = pins.length ? { componentId: pins[0].componentId, pinId: pins[0].pinId } : null;
      for (const key of seen) resolved.set(key, result);
      return result;
    }
    const channels = [], unresolved = [];
    for (const probe of document.probes) {
      if (probe.scope === false) continue;
      if(probe.kind==='current'){channels.push({...probe,label:probe.label||'Current'});continue;}
      if(probe.kind!=='voltage')continue;
      const positive = terminal(probe.positive), negative = probe.reference === 'ground' ? null : terminal(probe.negative);
      if (!positive || (probe.reference !== 'ground' && !negative)) { unresolved.push(probe.id); continue; }
      channels.push({ ...probe, id: probe.id, label: probe.label || 'Wire', positive, negative });
    }
    return { channels, unresolved };
  }
  function alignGrid(document) {
    for (const p of [...Object.values(document.layout.components), ...Object.values(document.layout.junctions)]) {
      p.x = snap(p.x); p.y = snap(p.y);
    }
    for (const route of Object.values(document.layout.wires)) for (const p of route.bends) { p.x = snap(p.x); p.y = snap(p.y); }
    return document;
  }
  function clean(points, preserveBacktracks = false) {
    const result = [];
    for (const p of points) {
      if (result.length && distance(result.at(-1), p) < 0.001) continue;
      result.push({ x: p.x, y: p.y });
      while (result.length >= 3) {
        const [a, b, c] = result.slice(-3);
        if ((!preserveBacktracks || (b.x-a.x)*(c.x-b.x)+(b.y-a.y)*(c.y-b.y)>=0) && ((Math.abs(a.x - b.x) < .001 && Math.abs(b.x - c.x) < .001) ||
          (Math.abs(a.y - b.y) < .001 && Math.abs(b.y - c.y) < .001))) result.splice(-2, 1);
        else break;
      }
      if (result.length >= 2 && distance(result.at(-1), result.at(-2)) < .001) result.pop();
    }
    return result;
  }
  function route(document, wire, preserveBacktracks = false) {
    const anchors = [pin(document, wire.from), ...(document.layout.wires[wire.id]?.bends || []), pin(document, wire.to)];
    const result = [anchors[0]];
    for (const end of anchors.slice(1)) {
      const start = result.at(-1);
      if (Math.abs(start.x - end.x) > .001 && Math.abs(start.y - end.y) > .001) result.push({ x: end.x, y: start.y });
      result.push(end);
    }
    return clean(result, preserveBacktracks);
  }

  function closest(point, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, length = dx * dx + dy * dy;
    const t = length ? Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / length)) : 0;
    return { x: a.x + t * dx, y: a.y + t * dy };
  }
  function graphicSize(c){const p=c.parameters;return c.kind==='text'?{width:Math.max(32,...p.text.split('\n').map(line=>line.length*p.size*.65)),height:Math.max(p.size,p.text.split('\n').length*p.size*1.3)}:{width:p.width,height:Math.max(8,p.height)};}
  function bounds(document, component) {
    const pose = document.layout.components[component.id];
    const drawingScale = definitions[component.kind].drawingScale || 1, sheetScale = grid / 16;
    const points = Object.keys(Catalog.componentPins(component)).map(pinId => pin(document, { kind: 'pin', componentId: component.id, pinId }));
    if(graphic(component.kind)){const b=graphicSize(component);for(const [x,y] of [[-b.width/2,-b.height/2],[b.width/2,-b.height/2],[-b.width/2,b.height/2],[b.width/2,b.height/2]]){const [rx,ry]=rotateOffset(x*(pose.mirror?-1:1),y,pose.rotation);points.push({x:pose.x+rx,y:pose.y+ry});}}
    if(Catalog.displayChipKind(component.kind)){
      const kind=component.kind;
      const layout=Catalog.displayChipLayout(kind,component.parameters);
      const body=bitDisplays.has(kind)?componentHitBox(component):{
        x:kind==='ledArray'?50*layout.columns:25*layout.columns,
        y:kind==='ledArray'?50*layout.rows:25*layout.rows,
      };
      for(const x of [-body.x,body.x])for(const y of [-body.y,body.y]){
        const [rx,ry]=rotateOffset((x+(body.centerX??0))*(pose.mirror?-1:1),y,pose.rotation);
        points.push({x:pose.x+rx,y:pose.y+ry});
      }
    }
    if(pinCenteredSources.has(component.kind)){
      const body=componentHitBox(component);
      const [dx,dy]=rotateOffset(0,body.centerY,pose.rotation);
      points.push({x:pose.x+dx-body.x,y:pose.y+dy-body.y},{x:pose.x+dx+body.x,y:pose.y+dy+body.y});
    }else if(!graphic(component.kind))points.push({ x: pose.x - 24*sheetScale, y: pose.y - 24*sheetScale }, { x: pose.x + 24*sheetScale, y: pose.y + 24*sheetScale });
    return {
      x: Math.min(...points.map(p => p.x)) - 8*sheetScale, y: Math.min(...points.map(p => p.y)) - 8*sheetScale,
      right: Math.max(...points.map(p => p.x)) + 8*sheetScale, bottom: Math.max(...points.map(p => p.y)) + 8*sheetScale
    };
  }
  function drawingBounds(drawing) {
    let points=drawing.points;
    if(drawing.kind==='ellipse'){
      const [c,a,b]=points,rx=Math.hypot(a.x-c.x,a.y-c.y),ry=Math.hypot(b.x-c.x,b.y-c.y);
      const angle=Math.atan2(a.y-c.y,a.x-c.x),w=Math.hypot(rx*Math.cos(angle),ry*Math.sin(angle)),h=Math.hypot(rx*Math.sin(angle),ry*Math.cos(angle));
      points=[{x:c.x-w,y:c.y-h},{x:c.x+w,y:c.y+h}];
    }
    if(drawing.kind==='text'){
      const p=points[0],size=drawing.fontSize,w=Math.max(1,...drawing.text.split('\n').map(line=>line.length))*size*.65,h=drawing.text.split('\n').length*size*1.3;
      points=[[0,0],[w,0],[w,h],[0,h]].map(([x,y])=>{const [rx,ry]=rotateOffset(x,y,drawing.rotation||0);return {x:p.x+rx,y:p.y+ry};});
    }
    return {x:Math.min(...points.map(p=>p.x)),y:Math.min(...points.map(p=>p.y)),right:Math.max(...points.map(p=>p.x)),bottom:Math.max(...points.map(p=>p.y))};
  }
  function drawingHit(drawing,p,scale=1){
    const ps=drawing.points,tolerance=Math.max(7/scale,drawing.strokeWidth/2+3/scale),b=drawingBounds(drawing);
    if(p.x<b.x-tolerance||p.x>b.right+tolerance||p.y<b.y-tolerance||p.y>b.bottom+tolerance)return false;
    if(drawing.kind==='text')return true;
    if(drawing.kind==='ellipse'){
      const [c,a,b]=ps,ax=a.x-c.x,ay=a.y-c.y,bx=b.x-c.x,by=b.y-c.y,rx=Math.hypot(ax,ay),ry=Math.hypot(bx,by);
      if(!rx||!ry)return false;
      const u=((p.x-c.x)*ax+(p.y-c.y)*ay)/(rx*rx),v=((p.x-c.x)*bx+(p.y-c.y)*by)/(ry*ry),r=Math.hypot(u,v);
      return drawing.fill!=='none'&&r<=1||Math.abs(r-1)*Math.min(rx,ry)<tolerance;
    }
    const closed=drawing.kind==='box'||drawing.kind==='polygon';
    for(let i=0;i<ps.length-(closed?0:1);i++)if(distance(p,closest(p,ps[i],ps[(i+1)%ps.length]))<=tolerance)return true;
    if(!closed||drawing.fill==='none')return false;
    let inside=false;
    for(let i=0,j=ps.length-1;i<ps.length;j=i++)if((ps[i].y>p.y)!==(ps[j].y>p.y)&&p.x<(ps[j].x-ps[i].x)*(p.y-ps[i].y)/(ps[j].y-ps[i].y)+ps[i].x)inside=!inside;
    return inside;
  }
  function componentHitBox(c) {
    if(c.kind==='npnDarlington'||c.kind==='pnpDarlington'||c.kind==='unijunction')return {x:75,y:100};
    if(['comparator','opampReal','ota','optocoupler'].includes(c.kind))return {x:115,y:96};
    if(c.kind==='relayCoil'||c.kind==='timeDelayRelay')return {x:65,y:63};
    if(c.kind==='motorProtectionSwitch')return {x:125,y:85};
    if(c.kind==='crossSwitch')return {x:80,y:80};
    if(c.kind==='gyrator')return {x:76,y:54};
    if(c.kind==='tristateBuffer'||c.kind==='delayBuffer')return {x:52,y:52};
    if(Catalog.discreteChipKind(c.kind)){
      const layout=Catalog.discreteChipLayout(c.kind,c.parameters),anchor=Catalog.discreteChipAnchor(layout);
      return {x:25*layout.columns,y:25*layout.rows,
        centerX:25*(layout.columns-1)-50*anchor.column,centerY:25*(layout.rows-1)-50*anchor.row};
    }
    if(bitDisplays.has(c.kind))return {x:112.5,y:Math.max(75,50*Catalog.displayChipLayout(c.kind,c.parameters).rows),centerX:37.5};
    if(pinCenteredSources.has(c.kind))return {x:50,y:50,centerY:-100};
    if(c.kind==='currentSource')return {x:50,y:50};
    const bodyScale = definitions[c.kind].drawingScale || 1;
    if(c.kind==='resistor')return {x:Math.max(70,34*bodyScale),y:Math.max(30,24*bodyScale)};
    const base = {x:(c.kind==='ground'?25:34)*bodyScale,y:(['dFlipFlop','jkFlipFlop','tFlipFlop','counter','latch','halfAdder','fullAdder'].includes(c.kind)?Math.max(...Object.values(Catalog.componentPins(c)).map(p=>Math.abs(p[1])))/bodyScale+16:c.kind==='pushSwitch'?40:c.kind==='tappedTransformer'?64:c.kind==='customTransformer'?80:c.kind==='dpdtSwitch'?56:['voltageSource','voltageRail','opamp','transformer'].includes(c.kind)?36:24)*bodyScale};
    if(outputSpecs[c.kind]&&Object.keys(Catalog.componentPins(c)).length>2){const ps=Object.values(Catalog.componentPins(c));return {x:Math.max(base.x,32*bodyScale,...ps.map(p=>Math.abs(p[0]))),y:Math.max(base.y,Math.max(24*bodyScale,...ps.map(p=>Math.abs(p[1])))+16*bodyScale)};}
    return base;
  }
  function hit(document, point, scale = 1, ignoreProbes = false, frame) {
    for (const probe of document.probes) if (!ignoreProbes && probe.kind === 'voltage' && document.layout.probes?.[probe.id]) {
      if (distance(point, pin(document, probe.positive)) < Math.min(12 / scale, 25)) return { kind: 'probe', id: probe.id, anchor: true };
      const b = probeBounds(document, probe, probeVoltage(document, probe, frame));
      if (point.x >= b.x && point.x <= b.right && point.y >= b.y && point.y <= b.bottom) return { kind: 'probe', id: probe.id };
    }
    let best = null;
    for (const c of document.electrical.components) for (const pinId of Object.keys(Catalog.componentPins(c))) {
      const ref = { kind: 'pin', componentId: c.id, pinId }, d = distance(point, pin(document, ref));
      if (d < Math.min(10 / scale, 20) && (!best || d < best.distance)) best = { ...ref, distance: d };
    }
    for (const j of document.electrical.junctions) {
      const d = distance(point, document.layout.junctions[j.id]);
      if (d < Math.min(10 / scale, 20) && (!best || d < best.distance)) best = { kind: 'junction', junctionId: j.id, distance: d };
    }
    if (best) return best;
    for (const c of [...document.electrical.components].reverse()) {
      const pose = document.layout.components[c.id], r = -pose.rotation * Math.PI / 180;
      const dx = point.x - pose.x, dy = point.y - pose.y, x = dx * Math.cos(r) - dy * Math.sin(r), y = dx * Math.sin(r) + dy * Math.cos(r);
      if(graphic(c.kind)){const b=graphicSize(c),ux=pose.mirror?-x:x;if(c.kind==='line'){if(distance({x:ux,y},closest({x:ux,y},{x:-b.width/2,y:-c.parameters.height/2},{x:b.width/2,y:c.parameters.height/2}))<8/scale)return {kind:'component',id:c.id};}else if(c.kind==='box'){if(Math.abs(ux)<=b.width/2+8/scale&&Math.abs(y)<=b.height/2+8/scale&&Math.min(Math.abs(Math.abs(ux)-b.width/2),Math.abs(Math.abs(y)-b.height/2))<8/scale)return {kind:'component',id:c.id};}else if(Math.abs(ux)<=b.width/2+6&&Math.abs(y)<=b.height/2+6)return {kind:'component',id:c.id};continue;}
      const b = componentHitBox(c);
      if (Math.abs((pose.mirror?-x:x)-(b.centerX??0))<b.x && Math.abs(y-(b.centerY??0))<b.y) return {kind:'component',id:c.id};
    }
    for (const wire of [...document.electrical.wires].reverse()) {
      const points = route(document, wire);
      for (let i = 0; i < points.length - 1; i++) {
        const projected = closest(point, points[i], points[i + 1]);
        if (distance(point, projected) < 7 / scale) {
          const onGrid = closest({ x: snap(projected.x), y: snap(projected.y) }, points[i], points[i + 1]);
          return { kind: 'wire', id: wire.id, point: onGrid, segment: i };
        }
      }
    }
    for(const drawing of [...(document.layout.drawings||[])].reverse())if(drawingHit(drawing,point,scale))return {kind:'drawing',id:drawing.id};
    return null;
  }
  function boxSelection(d, a, b, frame, componentBounds = c => bounds(d, c)) {
    const r = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), right: Math.max(a.x, b.x), bottom: Math.max(a.y, b.y) }, crossing = b.x < a.x, result = new Set();
    const inside = p => p.x >= r.x && p.x <= r.right && p.y >= r.y && p.y <= r.bottom;
    const rectangle = q => crossing ? q.x <= r.right && q.right >= r.x && q.y <= r.bottom && q.bottom >= r.y : inside(q) && inside({ x: q.right, y: q.bottom });
    const segment = (a, b) => {
      // Slab clipping also handles segments whose endpoints are both outside.
      let low = 0, high = 1;
      for (const [axis, min, max] of [['x', r.x, r.right], ['y', r.y, r.bottom]]) {
        const delta = b[axis] - a[axis]; if (!delta) { if (a[axis] < min || a[axis] > max) return false; continue; }
        const t1 = (min - a[axis]) / delta, t2 = (max - a[axis]) / delta; low = Math.max(low, Math.min(t1, t2)); high = Math.min(high, Math.max(t1, t2));
        if (low > high) return false;
      } return true;
    };
    for (const c of d.electrical.components) if (rectangle(componentBounds(c))) result.add(token('component', c.id));
    for (const w of d.electrical.wires) { const points = route(d, w); if (crossing ? points.some((p, i) => inside(p) || (i && segment(points[i - 1], p))) : points.every(inside)) result.add(token('wire', w.id)); }
    for (const j of d.electrical.junctions) if (inside(d.layout.junctions[j.id])) result.add(token('junction', j.id));
    for (const probe of d.probes) if (probe.kind === 'voltage' && d.layout.probes?.[probe.id] && rectangle(probeBounds(d, probe, probeVoltage(d, probe, frame)))) result.add(token('probe', probe.id));
    for(const drawing of d.layout.drawings||[])if(rectangle(drawingBounds(drawing)))result.add(token('drawing',drawing.id));
    return result;
  }
  function zoom(camera, point, factor) {
    const scale = Math.max(.064, Math.min(1.28, camera.scale * factor));
    return { scale, x: point.x - (point.x - camera.x) * scale / camera.scale, y: point.y - (point.y - camera.y) * scale / camera.scale };
  }
  // Search the sheet grid for an orthogonal path clear of component bodies.
  // The editor uses the same result for the preview and saved wire bends.
  function routedWireLeg(document,start,end) {
    const directions=[[grid,0],[0,grid],[-grid,0],[0,-grid]];
    const obstacles=document.electrical.components.filter(c=>!graphic(c.kind)).map(c=>{
      const box=componentHitBox(c),pose=document.layout.components[c.id];
      const [cx,cy]=rotateOffset((box.centerX??0)*(pose.mirror?-1:1),box.centerY??0,pose.rotation);
      const horizontal=pose.rotation%180===0;
      const x=(horizontal?box.x:box.y)+grid/4,y=(horizontal?box.y:box.x)+grid/4;
      return {left:pose.x+cx-x,right:pose.x+cx+x,top:pose.y+cy-y,bottom:pose.y+cy+y};
    });
    const inside=(p,b)=>p.x>=b.left&&p.x<=b.right&&p.y>=b.top&&p.y<=b.bottom;
    let blocking=obstacles.filter(b=>!inside(start,b)&&!inside(end,b));
    const clear=(a,b)=>!blocking.some(o=>Math.min(a.x,b.x)<=o.right&&Math.max(a.x,b.x)>=o.left&&
      Math.min(a.y,b.y)<=o.bottom&&Math.max(a.y,b.y)>=o.top);
    if(start.x===end.x&&start.y===end.y)return [];
    for(const corner of [{x:end.x,y:start.y},{x:start.x,y:end.y}])
      if(clear(start,corner)&&clear(corner,end))
        return same(corner,start)||same(corner,end)?[end]:[corner,end];

    // Keep search bounded for large sheets. Off-grid endpoints use the ordinary
    // routing fallback so their exact terminal coordinates survive.
    if([start.x,start.y,end.x,end.y].some(value=>value%grid!==0))return null;
    const queue=[{...start,parent:null}],seen=new Set([`${start.x},${start.y}`]);
    const margin=grid*12,minX=Math.min(start.x,end.x)-margin,maxX=Math.max(start.x,end.x)+margin;
    const minY=Math.min(start.y,end.y)-margin,maxY=Math.max(start.y,end.y)+margin;
    blocking=blocking.filter(box=>box.right>=minX&&box.left<=maxX&&box.bottom>=minY&&box.top<=maxY);
    for(let i=0;i<queue.length&&i<4096;i++){
      const at=queue[i];
      if(at.x===end.x&&at.y===end.y){
        const route=[];
        for(let node=at;node.parent;node=node.parent){
          const next=route.at(-1),parent=node.parent;
          if(!next||!(next.x===node.x&&node.x===parent.x||next.y===node.y&&node.y===parent.y))
            route.push({x:node.x,y:node.y});
        }
        return route.reverse();
      }
      for(const [dx,dy] of directions){
        const x=at.x+dx,y=at.y+dy,key=`${x},${y}`;
        if(x<minX||x>maxX||y<minY||y>maxY||seen.has(key)||!clear(at,{x,y}))continue;
        seen.add(key);
        queue.push({x,y,parent:at});
      }
    }
    return null;
  }
  const api=Object.freeze({routedWireLeg,componentHitBox,drawingBounds,drawingHit,clone,grid,snap,token,referenceKey,same,distance,pin,rotateOffset,placementPose,flipPose,probePoint,probeBounds,probeVoltage,scopeChannels,alignGrid,clean,route,closest,graphicSize,bounds,hit,boxSelection,zoom});

  registry.geometry=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})();
