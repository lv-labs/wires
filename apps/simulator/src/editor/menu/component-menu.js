'use strict';
// Menu availability is separate from the generated legacy names and hierarchy.
(() => {
  const tools = {
    SweepElm:'sweepSource', AntennaElm:'antennaSource', AMElm:'amSource', FMElm:'fmSource', NoiseElm:'noiseSource',
    SchmittElm:'schmittTrigger', InvertingSchmittElm:'invertingSchmittTrigger', XnorGateElm:'xnorGate',
    SparkGapElm:'sparkGap', MemristorElm:'memristor', TunnelDiodeElm:'tunnelDiode', FuseElm:'fuse', LDRElm:'photoresistor', ThermistorNTCElm:'thermistor',
    SCRElm:'scr', DiacElm:'diac', TriacElm:'triac', VaractorElm:'varactor', TriodeElm:'triode',
    VarRailElm:'variableVoltage', LampElm:'lamp', TextElm:'text', BoxElm:'box', LineElm:'line', LabeledNodeElm:'labeledNode', ProbeElm:'voltmeter', OhmMeterElm:'ohmmeter', AmmeterElm:'ammeter', WattmeterElm:'wattmeter', TestPointElm:'testPoint', DecimalDisplayElm:'decimalDisplay', InstructionDisplayElm:'instructionDisplay', LEDArrayElm:'ledArray', SevenSegElm:'sevenSegment', DataRecorderElm:'dataExport', AudioOutputElm:'audioOutput', StopTriggerElm:'stopTrigger', DCMotorElm:'dcMotor', ThreePhaseMotorElm:'threePhaseMotor', WireElm:'wire', RoutedWireElm:'routedWire', ResistorElm:'resistor', CapacitorElm:'capacitor', PolarCapacitorElm:'polarizedCapacitor',
    CrystalElm:'crystal',
    CrossSwitchElm:'crossSwitch',
    RelayCoilElm:'relayCoil', RelayContactElm:'relayContact', TimeDelayRelayElm:'timeDelayRelay', MotorProtectionSwitchElm:'motorProtectionSwitch',
    RelayElm:'relay', InductorElm:'inductor', PushSwitchElm:'pushSwitch', MBBSwitchElm:'mbbSwitch', TappedTransformerElm:'tappedTransformer', CustomTransformerElm:'customTransformer', TransLineElm:'transmissionLine', SwitchElm:'switch', Switch2Elm:'spdtSwitch', DPDTSwitchElm:'dpdtSwitch',
    PotElm:'potentiometer', TransformerElm:'transformer', GroundElm:'ground', DCVoltageElm:'voltageSource',
    ACVoltageElm:'acSource', RailElm:'voltageRail', ACRailElm:'acRail', SquareRailElm:'squareRail', ClockElm:'clockRail',
    CurrentElm:'currentSource', OutputElm:'output', LEDElm:'led', DiodeElm:'diode', ZenerElm:'zener',
    NTransistorElm:'npn', PTransistorElm:'pnp', NMosfetElm:'nmos', PMosfetElm:'pmos', NJfetElm:'njfet', PJfetElm:'pjfet',
    OpAmpElm:'opampMinusTop', OpAmpSwapElm:'opampPlusTop', AnalogSwitchElm:'analogSwitch', AnalogSwitch2Elm:'analogSpdtSwitch',
    LogicInputElm:'logicInput', LogicOutputElm:'logicOutput', InverterElm:'inverter', AndGateElm:'andGate',
    NandGateElm:'nandGate', OrGateElm:'orGate', NorGateElm:'norGate', XorGateElm:'xorGate',
    DFlipFlopElm:'dFlipFlop', JKFlipFlopElm:'jkFlipFlop', TFlipFlopElm:'tFlipFlop',
    CC2Elm:'currentConveyor', CC2NegElm:'negativeCurrentConveyor',
    VCVSElm:'vcvs', VCCSElm:'vccs', CCVSElm:'ccvs', CCCSElm:'cccs',
    NDarlingtonElm:'npnDarlington', PDarlingtonElm:'pnpDarlington', UnijunctionElm:'unijunction',
    OpAmpRealElm:'opampReal', ComparatorElm:'comparator', OTAElm:'ota', OptocouplerElm:'optocoupler',
    GyratorElm:'gyrator', DelayBufferElm:'delayBuffer', TriStateElm:'tristateBuffer',
    VCOElm:'voltageControlledOscillator', AnalogMuxElm:'analogMultiplexer', MonostableElm:'monostable',
    SipoShiftElm:'sipoShift', PisoShiftElm:'pisoShift', SeqGenElm:'sequenceGenerator',
    UserDefinedLogicElm:'customLogic', SRAMElm:'sram', ROMElm:'rom', BusTransceiverElm:'busTransceiver',
    MultiplexerElm:'multiplexer', DeMultiplexerElm:'demultiplexer', ADCElm:'adc', DACElm:'dac', SevenSegDecoderElm:'sevenSegmentDecoder', PhaseCompElm:'phaseComparator',
    TimerElm:'timer555', CounterElm:'counter', Counter2Elm:'loadCounter', DecadeElm:'ringCounter', LatchElm:'latch', HalfAdderElm:'halfAdder', FullAdderElm:'fullAdder', Select:'select'
  };
  function entries(definitions) {
    const visit = entry => {
      if(entry.children)return {...entry,children:entry.children.map(visit)};
      const tool=tools[entry.legacyClass];
      const available=tool==='wire'||tool==='routedWire'||tool==='select'||!!definitions[tool];
      return {...entry,tool:available?tool:null,available,reason:available?'':'Not available in the new simulator yet'};
    };
    return CircuitLegacyComponentMenu.map(visit);
  }
  globalThis.CircuitComponentMenu={entries};
})();
