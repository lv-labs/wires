package com.lushprojects.circuitjs1.client;

/** Native logic routing, converter and decoder models with individual pins. */
final class EngineDiscreteChipSupport {
    static ChipElm construct(String[] fields, int x, int y, int x2, int y2, int flags) {
        String type = fields[0];
        boolean mux = type.equals("184"), demux = type.equals("185");
        boolean adc = type.equals("167"), dac = type.equals("166");
        boolean decoder = type.equals("197"), phase = type.equals("161");
        boolean vco = type.equals("158"), mono = type.equals("194"), analog = type.equals("432");
        boolean sipo = type.equals("189"), piso = type.equals("186"), sequence = type.equals("188");
        boolean shift = sipo || piso;
        if (!(mux || demux || adc || dac || decoder || phase || vco || mono || analog || shift || sequence))
            return null;

        int customFlag = ChipElm.FLAG_CUSTOM_VOLTAGE;
        boolean custom = (flags & customFlag) != 0;
        int mask = (analog ? 0 : customFlag) | (mux || decoder ? 6 : piso ? 2 : sequence ? 14 : 0);
        EngineOutputSupport.require((flags & ~mask) == 0 && y == y2 && x2 - x == 64,
            "Invalid discrete chip flags or geometry");
        int expected = 6 + (custom ? 1 : 0) + (phase || vco ? 0 : analog ? 4 : mono || shift ? 2 : 1);
        int words = 0;
        if (sequence) {
            EngineOutputSupport.require(fields.length >= expected && (flags & 2) != 0, "Invalid sequence header");
            int length = Integer.parseInt(fields[expected - 1]);
            EngineOutputSupport.require(length >= 0 && length <= 4096, "Invalid sequence length");
            words = (length + 31) / 32;
        }
        EngineOutputSupport.require(fields.length == expected + words, "Invalid discrete chip field count");
        for (int i = expected; i < fields.length; i++)
            Integer.parseInt(fields[i]);
        if (custom)
            EngineOutputSupport.require(EngineOutputSupport.number(fields, adc || dac || shift ? 7 : 6) > 0,
                "Logic voltage must be positive");
        if (analog) {
            for (int i = 7; i <= 8; i++) {
                double resistance = EngineOutputSupport.number(fields, i);
                EngineOutputSupport.require(resistance > 0 && !Double.isInfinite(1 / resistance),
                    "Analog multiplexer resistance must be positive");
            }
            EngineOutputSupport.number(fields, 9);
        }
        if (mono) {
            String retrigger = fields[expected - 2];
            EngineOutputSupport.require(retrigger.equals("true") || retrigger.equals("false"), "Invalid monostable retrigger setting");
            EngineOutputSupport.require(EngineOutputSupport.number(fields, expected - 1) > 0, "Pulse period must be positive");
        }
        if (shift) {
            int bits = Integer.parseInt(fields[6]);
            int initial = Integer.parseInt(fields[expected - 1]);
            EngineOutputSupport.require(bits >= 1 && bits <= 30 && initial >= 0 && initial < (1 << bits),
                "Invalid shift register width or initial value");
        }
        if (!(phase || vco || mono || sequence || shift)) {
            int value = Integer.parseInt(fields[adc || dac || analog ? 6 : expected - 1]);
            int minimum = decoder ? 0 : adc || dac ? 2 : 1;
            int maximum = decoder ? 2 : adc || dac ? 30 : 6;
            EngineOutputSupport.require(value >= minimum && value <= maximum, "Invalid chip width or segment mode");
        }

        StringBuilder values = new StringBuilder();
        for (int i = 6; i < fields.length; i++)
            values.append(fields[i]).append(' ');
        StringTokenizer args = new StringTokenizer(values.toString());
        if (sipo) return new SipoShiftElm(x, y, x2, y2, flags, args);
        if (piso) return new PisoShiftElm(x, y, x2, y2, flags, args);
        if (sequence) return new SeqGenElm(x, y, x2, y2, flags, args);
        if (analog) return new AnalogMuxElm(x, y, x2, y2, flags, args);
        if (vco) return new VCOElm(x, y, x2, y2, flags, args);
        if (mono) return new MonostableElm(x, y, x2, y2, flags, args);
        if (mux) return new MultiplexerElm(x, y, x2, y2, flags, args);
        if (demux) return new DeMultiplexerElm(x, y, x2, y2, flags, args);
        if (adc) return new ADCElm(x, y, x2, y2, flags, args);
        if (dac) return new DACElm(x, y, x2, y2, flags, args);
        if (decoder) return new SevenSegDecoderElm(x, y, x2, y2, flags, args);
        return new PhaseCompElm(x, y, x2, y2, flags, args);
    }

    static void configure(CircuitElm old, CircuitElm fresh) {
        if (old instanceof AnalogMuxElm) {
            AnalogMuxElm current = (AnalogMuxElm) old, next = (AnalogMuxElm) fresh;
            current.selectBitCount = next.selectBitCount;
            current.r_on = next.r_on;
            current.r_off = next.r_off;
            current.threshold = next.threshold;
        } else if (old instanceof MultiplexerElm)
            ((MultiplexerElm) old).selectBitCount = ((MultiplexerElm) fresh).selectBitCount;
        else if (old instanceof DeMultiplexerElm)
            ((DeMultiplexerElm) old).selectBitCount = ((DeMultiplexerElm) fresh).selectBitCount;
        else if (old instanceof SevenSegDecoderElm)
            ((SevenSegDecoderElm) old).segmentType = ((SevenSegDecoderElm) fresh).segmentType;
        else if (old instanceof ADCElm || old instanceof DACElm)
            ((ChipElm) old).bits = ((ChipElm) fresh).bits;
        else
            return;

        // These models are combinational. The next iteration computes
        // their outputs from the new pin configuration.
        ((ChipElm) old).setupPins();
    }
}
