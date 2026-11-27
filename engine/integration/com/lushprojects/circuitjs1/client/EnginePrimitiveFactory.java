package com.lushprojects.circuitjs1.client;

import java.util.HashMap;

/** Supplies only the primitives used by the engine's built-in composite models. */
final class EnginePrimitiveFactory implements ElementFactory {
    static void install() {
        CirSim.factory = new EnginePrimitiveFactory();
        CirSim.dumpTypeMap = new HashMap<Integer, String>();
        CirSim.dumpTypeMap.put((int) 'r', "ResistorElm");
        CirSim.dumpTypeMap.put((int) 'c', "CapacitorElm");
        CirSim.dumpTypeMap.put((int) 'l', "InductorElm");
        CirSim.dumpTypeMap.put((int) 't', "TransistorElm");
        CirSim.dumpTypeMap.put((int) 'd', "DiodeElm");
        CirSim.dumpTypeMap.put((int) 'a', "OpAmpElm");
        CirSim.dumpTypeMap.put((int) 'i', "CurrentElm");
        CirSim.dumpTypeMap.put((int) 'v', "VoltageElm");
        CirSim.dumpTypeMap.put((int) 'R', "RailElm");
        CirSim.dumpTypeMap.put((int) 'g', "GroundElm");
        CirSim.dumpTypeMap.put(159, "AnalogSwitchElm");
        CirSim.dumpTypeMap.put(212, "VCVSElm");
        CirSim.dumpTypeMap.put(213, "VCCSElm");
        CirSim.dumpTypeMap.put(214, "CCVSElm");
        CirSim.dumpTypeMap.put(215, "CCCSElm");
    }

    @Override public CircuitElm create(String name, int x, int y) {
        switch (name) {
        case "ResistorElm": return new ResistorElm(x, y);
        case "CapacitorElm": return new CapacitorElm(x, y);
        case "InductorElm": return new InductorElm(x, y);
        case "NTransistorElm":
        case "TransistorElm": return new NTransistorElm(x, y);
        case "PTransistorElm": return new PTransistorElm(x, y);
        case "DiodeElm": return new DiodeElm(x, y);
        case "OpAmpElm": return new OpAmpElm(x, y);
        case "CurrentElm": return new CurrentElm(x, y);
        case "VoltageElm": return new DCVoltageElm(x, y);
        case "RailElm": return new RailElm(x, y);
        case "GroundElm": return new GroundElm(x, y);
        case "AnalogSwitchElm": return new AnalogSwitchElm(x, y);
        case "VCVSElm": return new VCVSElm(x, y);
        case "VCCSElm": return new VCCSElm(x, y);
        case "CCVSElm": return new CCVSElm(x, y);
        case "CCCSElm": return new CCCSElm(x, y);
        default: return null;
        }
    }

    @Override public CircuitElm create(String name, int x, int y, int x2, int y2, int flags, StringTokenizer st) {
        switch (name) {
        case "ResistorElm": return new ResistorElm(x, y, x2, y2, flags, st);
        case "CapacitorElm": return new CapacitorElm(x, y, x2, y2, flags, st);
        case "InductorElm": return new InductorElm(x, y, x2, y2, flags, st);
        case "TransistorElm": return new TransistorElm(x, y, x2, y2, flags, st);
        case "DiodeElm": return new DiodeElm(x, y, x2, y2, flags, st);
        case "OpAmpElm": return new OpAmpElm(x, y, x2, y2, flags, st);
        case "CurrentElm": return new CurrentElm(x, y, x2, y2, flags, st);
        case "VoltageElm": return new VoltageElm(x, y, x2, y2, flags, st);
        case "RailElm": return new RailElm(x, y, x2, y2, flags, st);
        case "GroundElm": return new GroundElm(x, y, x2, y2, flags, st);
        case "AnalogSwitchElm": return new AnalogSwitchElm(x, y, x2, y2, flags, st);
        case "VCVSElm": return new VCVSElm(x, y, x2, y2, flags, st);
        case "VCCSElm": return new VCCSElm(x, y, x2, y2, flags, st);
        case "CCVSElm": return new CCVSElm(x, y, x2, y2, flags, st);
        case "CCCSElm": return new CCCSElm(x, y, x2, y2, flags, st);
        default: return null;
        }
    }
}
