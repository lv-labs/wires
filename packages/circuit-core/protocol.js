'use strict';
// Portable computation module: no DOM, renderer, storage or worker construction.
(() => {
  const registry=globalThis.CircuitCoreModules ||= {};
  const Adapter=typeof module==='object'&&module.exports?require('./adapter.js'):registry.adapter;
  const copy = value => structuredClone(value);
  const error = (code, message) => Object.assign(new Error(message), {code});
  const check = (condition, code, message) => { if (!condition) throw error(code, message); };
  const positive = n => Number.isSafeInteger(n) && n > 0;
  const same = (a, b) => a && b && a.documentId === b.documentId &&
    a.circuitRevision === b.circuitRevision && a.runEpoch === b.runEpoch;
  const liveOperations = new Set(['updateCircuit', 'setContact', 'setVariableVoltage', 'setSourceFrequency', 'setPotPosition', 'setSwitch']);
  function createRevisionProtocol(adapterSession) {
    let sessionId = null, lastRequest = 0, disposed = false, faulted = false;
    let state = {documentId: null, circuitRevision: 0, runEpoch: 0};
    function target(value) {
      check(value && typeof value.documentId === 'string' && value.documentId.length > 0 &&
        positive(value.circuitRevision) && positive(value.runEpoch), 'INVALID_TARGET', 'Invalid target identity');
      return {documentId: value.documentId, circuitRevision: value.circuitRevision, runEpoch: value.runEpoch};
    }
    return {
      handle(message) {
        const envelope = {protocolVersion: 1, sessionId, requestId: message?.requestId};
        try {
          check(message && message.protocolVersion === 1, 'INVALID_PROTOCOL', 'Expected protocol version 1');
          check(typeof message.sessionId === 'string' && message.sessionId.length > 0,
            'SESSION_MISMATCH', 'Session ID is required');
          check(!sessionId || sessionId === message.sessionId, 'SESSION_MISMATCH', 'Wrong worker session');
          envelope.sessionId = message.sessionId;
          check(positive(message.requestId), 'INVALID_REQUEST', 'Expected positive integer request ID');
          check(message.requestId > lastRequest, 'DUPLICATE_REQUEST', 'Request has already been seen');
          lastRequest = message.requestId;
          check(!disposed, 'SESSION_DISPOSED', 'Session has been disposed');
          let result;
          if (message.operation === 'initialize') {
            check(sessionId === null, 'ALREADY_INITIALIZED', 'Worker is already initialized');
            sessionId = message.sessionId;
            result = {models: ['sweepSource@1','antennaSource@1','amSource@1','fmSource@1','noiseSource@1','schmittTrigger@1','invertingSchmittTrigger@1','xnorGate@1','sparkGap@1','memristor@1','tunnelDiode@1','fuse@1','photoresistor@1','thermistor@1','scr@1','diac@1','triac@1','timer555@1','relay@1','varactor@1','triode@1','variableVoltage@1', 'lamp@1', 'text@1', 'box@1', 'line@1', 'labeledNode@1', 'voltmeter@1', 'ohmmeter@1', 'ammeter@1', 'wattmeter@1', 'testPoint@1', 'decimalDisplay@1', 'instructionDisplay@1', 'ledArray@1', 'dataExport@1', 'audioOutput@1', 'stopTrigger@1', 'dcMotor@1', 'threePhaseMotor@1', 'pushSwitch@1', 'mbbSwitch@1', 'tappedTransformer@1', 'customTransformer@1', 'transmissionLine@1', 'counter@1', 'latch@1', 'halfAdder@1', 'fullAdder@1', 'output@1', 'logicOutput@1', 'logicInput@1', 'dFlipFlop@1', 'jkFlipFlop@1', 'tFlipFlop@1', 'polarizedCapacitor@1', 'analogSwitch@1', 'analogSpdtSwitch@1', 'resistor@1', 'transformer@1', 'spdtSwitch@1', 'dpdtSwitch@1', 'led@1', 'zener@1', 'npn@1', 'pnp@1', 'nmos@1', 'pmos@1', 'njfet@1', 'pjfet@1', 'andGate@1', 'nandGate@1', 'orGate@1', 'norGate@1', 'xorGate@1', 'inverter@1', 'inductor@1', 'diode@1', 'currentSource@1', 'potentiometer@1', 'capacitor@1', 'switch@1', 'voltageSource:dc@1', 'voltageSource:sine@1', 'voltageSource:periodic@1', 'voltageRail@1', 'opamp@1', 'ground@1'],
              liveChanges: typeof adapterSession.setSwitch === 'function' ? ['setSwitch:rc',...(typeof adapterSession.updateProjection==='function'?['updateCircuit']:[]),...(typeof adapterSession.setContact==='function'?['setContact']:[]),...(typeof adapterSession.setVariableVoltage==='function'?['setVariableVoltage']:[]),...(typeof adapterSession.setSourceFrequency==='function'?['setSourceFrequency']:[]),...(typeof adapterSession.setPotPosition==='function'?['setPotPosition']:[])] : [], maxSampleChannels: 32, perStepSamples: true, maxStepCount: 10000};
            result.liveStep = typeof adapterSession.step === 'function';
          } else {
            check(sessionId !== null, 'NOT_INITIALIZED', 'Initialize the worker first');
            check(same(message.base, state), 'STALE_BASE', 'Request does not match accepted circuit/run');
            check(!faulted || message.operation === 'dispose', 'ENGINE_FAILURE', 'Session faulted; replace the worker');
            const liveStep = message.payload?.liveStep;
            let channels, voltageRamp;
            if (liveStep !== undefined) {
              check(liveOperations.has(message.operation) && typeof adapterSession.step === 'function' &&
                positive(liveStep?.count) && liveStep.count <= 10000,
                'INVALID_REQUEST', 'A live step requires a live edit and 1–10000 steps');
              channels = Adapter.normalizeSampleChannels(liveStep.channels);
            }
            switch (message.operation) {
              case 'installCircuit': {
                check(state.documentId === null, 'ALREADY_INSTALLED', 'Install into a fresh candidate worker');
                const next = target(message.target);
                result = adapterSession.installProjection(message.payload?.circuit, next.documentId);
                state = next;
                break;
              }
              case 'step':
                check(state.documentId !== null, 'NO_DOCUMENT', 'Install a circuit first');
                result = adapterSession.step(message.payload?.count, message.payload?.channels);
                break;
              case 'readCapture':
                check(typeof adapterSession.readCapture==='function','UNSUPPORTED_CAPTURE','Recorder access unavailable');
                result=adapterSession.readCapture(message.payload?.componentId);break;
              case 'snapshot':
                check(state.documentId !== null, 'NO_DOCUMENT', 'Install a circuit first');
                result = adapterSession.snapshot();
                break;
              case 'reset': {
                check(state.documentId !== null, 'NO_DOCUMENT', 'Install a circuit first');
                const next = target(message.target);
                check(next.documentId === state.documentId && next.circuitRevision === state.circuitRevision &&
                  next.runEpoch > state.runEpoch && message.payload?.statePolicy === 'reset',
                  'INVALID_TARGET', 'Reset must preserve circuit revision and advance run epoch');
                result = adapterSession.reset();
                state = next;
                break;
              }
              case 'updateCircuit': {
                check(typeof adapterSession.updateProjection==='function','UNSUPPORTED_LIVE_CHANGE','Circuit updates unavailable');
                const next=target(message.target);
                check(next.documentId===state.documentId&&next.circuitRevision>state.circuitRevision&&next.runEpoch===state.runEpoch&&message.payload?.statePolicy==='preserve','INVALID_TARGET','Circuit edit must advance revision and preserve epoch');
                result=adapterSession.updateProjection(message.payload.circuit,next.documentId);state=next;break;
              }
              case 'setContact': {
                check(typeof adapterSession.setContact==='function','UNSUPPORTED_LIVE_CHANGE','Live contact updates unavailable');
                const next=target(message.target);
                check(next.documentId===state.documentId&&next.circuitRevision>state.circuitRevision&&next.runEpoch===state.runEpoch&&message.payload?.statePolicy==='preserve','INVALID_TARGET','Contact change must advance revision and preserve epoch');
                result=adapterSession.setContact(message.payload.componentId,message.payload.field,message.payload.value);state=next;break;
              }
              case 'setVariableVoltage': {
                check(typeof adapterSession.setVariableVoltage==='function','UNSUPPORTED_LIVE_CHANGE','Variable source updates unavailable');
                const next=target(message.target);
                check(next.documentId===state.documentId&&next.circuitRevision>state.circuitRevision&&next.runEpoch===state.runEpoch&&message.payload?.statePolicy==='preserve','INVALID_TARGET','Voltage change must advance revision and preserve epoch');
                const response=adapterSession.setVariableVoltage(message.payload.componentId,message.payload.voltage,
                  {smooth:liveStep!==undefined});
                ({voltageRamp,...result}=response);
                state=next;
                break;
              }
              case 'setSourceFrequency': {
                check(typeof adapterSession.setSourceFrequency === 'function','UNSUPPORTED_LIVE_CHANGE','Source frequency updates unavailable');
                const next = target(message.target);
                check(next.documentId === state.documentId && next.circuitRevision > state.circuitRevision &&
                  next.runEpoch === state.runEpoch && message.payload?.statePolicy === 'preserve',
                  'INVALID_TARGET','Frequency change must advance revision and preserve epoch');
                result = adapterSession.setSourceFrequency(message.payload.componentId,message.payload.frequency);
                state = next;
                break;
              }
              case 'setPotPosition': {
                check(typeof adapterSession.setPotPosition === 'function','UNSUPPORTED_LIVE_CHANGE','Potentiometer restamping unavailable');
                const next = target(message.target);
                check(next.documentId === state.documentId && next.circuitRevision > state.circuitRevision &&
                  next.runEpoch === state.runEpoch && message.payload?.statePolicy === 'preserve',
                  'INVALID_TARGET','Potentiometer change must advance revision and preserve epoch');
                result = adapterSession.setPotPosition(message.payload.componentId,message.payload.position);
                state = next;
                break;
              }
              case 'setSwitch': {
                check(typeof adapterSession.setSwitch === 'function', 'UNSUPPORTED_LIVE_CHANGE', 'Live switches unavailable');
                const next = target(message.target);
                check(next.documentId === state.documentId && next.circuitRevision > state.circuitRevision &&
                  next.runEpoch === state.runEpoch && message.payload?.statePolicy === 'preserve',
                  'INVALID_TARGET', 'Switch change must advance revision and preserve run epoch');
                result = adapterSession.setSwitch(message.payload.componentId, message.payload.closed);
                state = next;
                break;
              }
              case 'dispose': disposed = true; result = {disposed: true}; break;
              default: throw error('INVALID_OPERATION', 'Unknown operation');
            }
            if (liveStep !== undefined) {
              try {
                const frame = adapterSession.step(liveStep.count, channels, voltageRamp);
                result = {...result, frameAvailable: true, frame: {...frame, ...state, sessionId, protocolVersion: 1}};
              } catch (cause) {
                // The edit already advanced the accepted revision.
                faulted = true;
                throw cause;
              }
            }
          }
          return {...envelope, ok: true, state: copy(state),
            result: {...copy(result), ...state, sessionId, protocolVersion: 1}};
        } catch (cause) {
          if (cause.code === 'ENGINE_FAILURE') faulted = true;
          return {...envelope, ok: false, state: copy(state), error: {
            code: cause.code || 'INVALID_REQUEST', message: String(cause.message || cause),
            disposition: faulted ? 'faulted' : 'unchanged', diagnostics: []}};
        }
      }
    };
  }
  const api = Object.freeze({create: createRevisionProtocol});

  registry.protocol=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})();
