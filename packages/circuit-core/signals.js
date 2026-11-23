'use strict';
// Portable computation module: no DOM, renderer, storage or worker construction.
(() => {
  const registry=globalThis.CircuitCoreModules ||= {};
  const Adapter=typeof module==='object'&&module.exports?require('./adapter.js'):registry.adapter;
  const descriptors=channels=>Adapter.normalizeSampleChannels(channels.map(c=>c.kind==='current'?{id:c.id,kind:'current',componentId:c.componentId}:{id:c.id,positive:c.positive,negative:c.negative}));
  const key=channels=>JSON.stringify(descriptors(channels));
  function color(id){let hash=2166136261;for(const c of id)hash=Math.imul(hash^c.charCodeAt(0),16777619);return `hsl(${(hash>>>0)%360} 72% 72%)`;}
  function create({capacity=20000,historySpan}={}) {
    if(!Number.isInteger(capacity)||capacity<2||capacity>100000)throw new Error('Invalid scope capacity');
    function setHistorySpan(span){
      if(!Number.isFinite(span)||span<=0)throw new Error('Invalid scope history span');
      historySpan=span;
    }
    if(historySpan!==undefined)setHistorySpan(historySpan);
    let channels=[],signature='[]',expected,identity=null,sequence=0,revision=0,lastTime=-Infinity,start=0,length=0,timeOffset=0,lastStep=0,preserveNext=false,acquisition=null;
    let times=new Float64Array(capacity),values=[];
    function grow(){
      const nextCapacity=capacity*2,nextTimes=new Float64Array(nextCapacity),nextValues=values.map(()=>new Float64Array(nextCapacity));
      for(let i=0;i<length;i++){
        const index=(start+i)%capacity;
        nextTimes[i]=times[index];
        values.forEach((v,j)=>{nextValues[j][i]=v[index];});
      }
      capacity=nextCapacity;times=nextTimes;values=nextValues;start=0;
    }
    function clear(){start=0;length=0;}
    function reset(){clear();identity=null;sequence=0;revision=0;lastTime=-Infinity;timeOffset=0;lastStep=0;preserveNext=false;}
    function setChannels(next){
      const signatureNext=key(next),labels=new Map(next.map(c=>[c.id,c.label]));
      channels=descriptors(next).map(c=>({...c,...next.find(n=>n.id===c.id),label:labels.get(c.id)||c.id,color:next.find(n=>n.id===c.id)?.color||color(c.id)}));
      if(signature!==signatureNext){signature=signatureNext;values=channels.map(()=>new Float64Array(capacity));reset();}
      return descriptors(channels);
    }
    function suspend(){expected=null;preserveNext=false;}
    function expect(next,{preserveHistory=false}={}){
      if(next===null){suspend();reset();return;}
      const id=JSON.stringify([next.sessionId,next.documentId,next.runEpoch]);
      const sameDocument=identity!==null&&JSON.parse(identity)[1]===next.documentId;
      preserveNext=identity!==null&&identity!==id&&preserveHistory&&sameDocument;
      if(identity!==null&&identity!==id&&!preserveNext)reset();expected={...next};
    }
    function followState(state){
      const next=JSON.stringify([state.desired?.documentId,state.acquisitionEpoch]);
      if(acquisition!==next){expect(null);acquisition=next;}
      if(['empty','disposed'].includes(state.status))expect(null);
      else if(['loading','error'].includes(state.status))suspend();
      else if(state.accepted)expect(state.accepted,{preserveHistory:true});
    }
    function append(frame){
      if(expected===null||(expected&&['sessionId','documentId','runEpoch','circuitRevision'].some(k=>expected[k]!==frame?.[k])))return false;
      const batch=frame?.sampleBatch;if(!batch||!channels.length)return false;
      try{if(key(batch.channels)!==signature)return false;}catch{return false;}
      if(!Number.isSafeInteger(frame.frameSequence)||frame.frameSequence<1||!Number.isSafeInteger(frame.circuitRevision)||frame.circuitRevision<1||
        !Number.isSafeInteger(frame.runEpoch)||frame.runEpoch<1||typeof frame.sessionId!=='string'||typeof frame.documentId!=='string')return false;
      const nextIdentity=JSON.stringify([frame.sessionId,frame.documentId,frame.runEpoch]);
      if(identity===nextIdentity&&(frame.frameSequence<=sequence||frame.circuitRevision<revision))return false;
      const ts=batch.times,vs=channels.map(c=>batch.values?.[c.id]);
      if(!Array.isArray(ts)||!ts.length||ts.length>10000||vs.some(v=>!Array.isArray(v)||v.length!==ts.length))return false;
      for(let i=0;i<ts.length;i++)if(!Number.isFinite(ts[i])||ts[i]<0||(i&&ts[i]<=ts[i-1])||vs.some(v=>!Number.isFinite(v[i])))return false;
      if(identity===nextIdentity&&ts[0]+timeOffset<=lastTime)return false;
      const step=Number.isFinite(frame.timeStep)&&frame.timeStep>0?frame.timeStep:ts.length>1?ts[1]-ts[0]:lastStep||1e-6;
      if(identity!==nextIdentity){
        if(preserveNext){timeOffset=Math.max(0,lastTime+step-ts[0]);sequence=0;revision=0;}
        else reset();
        identity=nextIdentity;preserveNext=false;
      }
      for(let i=0;i<ts.length;i++){
        if(historySpan!==undefined){
          const cutoff=ts[i]+timeOffset-historySpan;
          // Keep one sample before the window for a continuous left edge.
          while(length>1&&times[(start+1)%capacity]<cutoff){start=(start+1)%capacity;length--;}
          if(length===capacity)grow();
        }
        const index=(start+length)%capacity;times[index]=ts[i]+timeOffset;values.forEach((v,j)=>v[index]=vs[j][i]);
        if(length<capacity)length++;else start=(start+1)%capacity;
      }
      sequence=frame.frameSequence;revision=frame.circuitRevision;lastTime=ts.at(-1)+timeOffset;lastStep=step;return true;
    }
    function window(span){
      const end=length?Math.max(span,times[(start+length-1)%capacity]):span,begin=Math.max(0,end-span);
      let first=0,high=length;
      while(first<high){
        const mid=(first+high)>>>1;
        if(times[(start+mid)%capacity]>=begin)high=mid;
        else first=mid+1;
      }
      const count=length-first,offset=(start+first)%capacity,ts=new Array(count);
      const split=Math.min(count,capacity-offset);
      for(let i=0;i<split;i++)ts[i]=times[offset+i];
      for(let i=split;i<count;i++)ts[i]=times[i-split];
      return {start:begin,end,stored:length,capacity,times:ts,channels:channels.map((c,j)=>{
        const history=values[j],ys=new Array(count);
        let min=Infinity,max=-Infinity;
        for(let i=0;i<count;i++){
          const value=history[i<split?offset+i:i-split];
          ys[i]=value;
          min=Math.min(min,value);
          max=Math.max(max,value);
        }
        return {...c,values:ys,min:ys.length?min:null,max:ys.length?max:null,last:ys.at(-1)};
      })};
    }
    return {setChannels,setHistorySpan,expect,suspend,followState,append,clear,reset,window,get count(){return length;},get signature(){return signature;}};
  }
  // Preserve first/last and min/max within each screen column, never average away peaks.
  function envelope(times,values,start,end,width){
    if(!times.length||times.length<=width*2)return times.map((t,i)=>[t,values[i]]);
    const output=[];
    let first=0,min=0,max=0,bucket=Math.floor((times[0]-start)/(end-start)*width);
    function append(index){output.push([times[index],values[index]]);}
    function flush(last){
      append(first);
      const earlier=Math.min(min,max),later=Math.max(min,max);
      if(earlier>first&&earlier<last)append(earlier);
      if(later>earlier&&later<last)append(later);
      if(last>first)append(last);
    }
    for(let i=1;i<times.length;i++){
      const next=Math.floor((times[i]-start)/(end-start)*width);
      if(next!==bucket){
        flush(i-1);
        first=min=max=i;
        bucket=next;
      }else{
        if(values[i]<values[min])min=i;
        if(values[i]>values[max])max=i;
      }
    }
    flush(times.length-1);
    return output;
  }
  function autoScale(channels){let max=.001;for(const c of channels)if(c.min!==null){max=Math.max(max,Math.abs(c.min),Math.abs(c.max));}
    const target=max/3.5,power=10**Math.floor(Math.log10(target)),step=[1,2,5,10].find(n=>n*power>=target);return step*power;}
  const api=Object.freeze({create,color,envelope,autoScale,descriptors});

  registry.signals=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})();
