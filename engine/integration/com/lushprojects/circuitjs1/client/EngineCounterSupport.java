package com.lushprojects.circuitjs1.client;

import java.util.Arrays;
import java.util.HashMap;

/** Native counter construction and preservation of live output state across edits. */
final class EngineCounterSupport {
    static ChipElm construct(String[] fields, int x, int y, int x2, int y2, int flags) {
        boolean ring = fields[0].equals("163");
        boolean binary = fields[0].equals("164");
        if (!ring && !binary && !fields[0].equals("421"))
            return null;

        int mask = ChipElm.FLAG_CUSTOM_VOLTAGE | (ring ? 6 : binary ? 12 : 0);
        EngineOutputSupport.require(fields.length >= 7, "Unsupported type or field count: " + fields[0]);
        EngineOutputSupport.require((flags & ~mask) == 0, "Unsupported chip flags");
        int bits = Integer.parseInt(fields[6]);
        EngineOutputSupport.require(bits >= (binary ? 3 : 2) && bits <= 30,
            "Invalid chip size, geometry or logic voltage");
        boolean custom = (flags & ChipElm.FLAG_CUSTOM_VOLTAGE) != 0;
        int first = custom ? 8 : 7;
        int end = first + bits;
        EngineOutputSupport.require(fields.length == end + (ring ? 0 : binary ? 2 : 1) && y == y2 && x2 - x == 64,
            "Invalid chip size, geometry or logic voltage");
        double highVoltage = custom ? EngineOutputSupport.number(fields, 7) : 5;
        EngineOutputSupport.require(highVoltage > 0, "Invalid chip size, geometry or logic voltage");
        for (int i = first; i < end; i++) {
            double value = EngineOutputSupport.number(fields, i);
            EngineOutputSupport.require(value == 0 || value == highVoltage, "Invalid stored chip output");
        }
        if (binary)
            EngineOutputSupport.require(fields[end].equals("true") || fields[end].equals("false"),
                "Invalid counter reset polarity or modulus");
        if (!ring) {
            int modulus = Integer.parseInt(fields[fields.length - 1]);
            EngineOutputSupport.require(modulus >= 0 && modulus <= (1 << bits), "Invalid counter reset polarity or modulus");
        }

        StringBuilder values = new StringBuilder();
        for (int i = 6; i < fields.length; i++)
            values.append(fields[i]).append(' ');
        StringTokenizer args = new StringTokenizer(values.toString());
        if (ring) return new RingCounterElm(x, y, x2, y2, flags, args);
        if (binary) return new CounterElm(x, y, x2, y2, flags, args);
        Counter2Elm counter = new Counter2Elm(x, y, x2, y2, flags, args);
        // Match the XML loader: let the solver establish CLR before it clears
        // the saved outputs. Subsequent steps use the actual terminal voltage.
        counter.pins[counter.clr].value = true;
        counter.volts[counter.clr] = highVoltage;
        return counter;
    }

    static void configure(ChipElm current, ChipElm fresh) {
        ChipElm.Pin[] previous = current.pins;
        double[] voltages = Arrays.copyOf(current.volts, current.volts.length);
        HashMap<String, Integer> index = new HashMap<String, Integer>();
        for (int i = 0; i < previous.length; i++)
            index.put(previous[i].text, i);
        current.bits = fresh.bits;
        if (current instanceof CounterElm) {
            ((CounterElm)current).invertreset = ((CounterElm)fresh).invertreset;
            ((CounterElm)current).modulus = ((CounterElm)fresh).modulus;
        } else if (current instanceof Counter2Elm) {
            ((Counter2Elm)current).modulus = ((Counter2Elm)fresh).modulus;
        }
        current.setupPins();
        current.allocNodes();
        for (int i = 0; i < current.pins.length; i++) {
            ChipElm.Pin pin = current.pins[i];
            Integer old = index.get(pin.text);
            pin.value = old != null && previous[old].value;
            current.volts[i] = old == null ? 0 : voltages[old];
        }
    }
}
