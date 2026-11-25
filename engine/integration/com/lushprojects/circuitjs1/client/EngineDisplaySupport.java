package com.lushprojects.circuitjs1.client;

/** Constructs the native discrete-pin display models in the worker. */
final class EngineDisplaySupport {
    static ChipElm construct(String[] fields, int x, int y, int x2, int y2, int flags) {
        String type = fields[0];
        boolean decimal = type.equals("419");
        boolean matrix = type.equals("405");
        if (!decimal && !matrix && !type.equals("157"))
            return null;
        boolean customVoltage = (flags & ChipElm.FLAG_CUSTOM_VOLTAGE) != 0;
        int first = customVoltage ? 7 : 6;
        EngineOutputSupport.require((flags == 0 || !matrix && flags == ChipElm.FLAG_CUSTOM_VOLTAGE)
            && x2 - x == 64 && y == 32 && y2 == 32, "Invalid display flags or geometry");
        EngineOutputSupport.require(fields.length == first + (decimal || matrix ? 2 : 3), "Invalid display field count");
        if (customVoltage)
            EngineOutputSupport.require(EngineOutputSupport.number(fields, 6) > 0, "Invalid display logic voltage");

        if (decimal) {
            EngineOutputSupport.integer(fields, first, 1, 16);
            EngineOutputSupport.integer(fields, first + 1, 0, 2);
        } else if (matrix) {
            EngineOutputSupport.integer(fields, first, 2, 16);
            EngineOutputSupport.integer(fields, first + 1, 2, 16);
        } else {
            int segments = Integer.parseInt(fields[first]);
            EngineOutputSupport.require(segments == 7 || segments == 14 || segments == 16, "Invalid segment count");
            EngineOutputSupport.integer(fields, first + 1, 0, 2);
            EngineOutputSupport.integer(fields, first + 2, -1, 1);
        }
        StringBuilder values = new StringBuilder();
        for (int i = 6; i < fields.length; i++)
            values.append(fields[i]).append(' ');
        StringTokenizer args = new StringTokenizer(values.toString());
        if (decimal) return new DecimalDisplayElm(x, y, x2, y2, flags, args);
        if (matrix) return new LEDArrayElm(x, y, x2, y2, flags, args);
        return new SevenSegElm(x, y, x2, y2, flags, args);
    }

    static void configure(DecimalDisplayElm current, DecimalDisplayElm fresh) {
        current.displayMode = fresh.displayMode;
        if (current.bitCount != fresh.bitCount) {
            current.bitCount = fresh.bitCount;
            current.setupPins();
        }
    }

    static void configure(LEDArrayElm current, LEDArrayElm fresh) {
        if (current.sizeX == fresh.sizeX && current.sizeY == fresh.sizeY)
            return;
        current.diodes = null;
        current.sizeX = fresh.sizeX;
        current.sizeY = fresh.sizeY;
        current.allocNodes();
        current.setupPins();
    }

    static void configure(SevenSegElm current, SevenSegElm fresh) {
        if (current.baseSegmentCount == fresh.baseSegmentCount && current.extraSegment == fresh.extraSegment
            && current.diodeDirection == fresh.diodeDirection)
            return;
        current.diodes = null;
        current.baseSegmentCount = fresh.baseSegmentCount;
        current.extraSegment = fresh.extraSegment;
        current.diodeDirection = fresh.diodeDirection;
        current.setPinCount();
    }

    static double[] segmentLevels(SevenSegElm display) {
        double[] levels = new double[display.segmentCount];
        for (int i = 0; i < levels.length; i++) {
            ChipElm.Pin pin = display.pins[i];
            if (display.diodeDirection == 0)
                levels[i] = pin.value ? 1 : 30.0 / 255;
            else {
                double fraction = -display.diodeDirection * pin.current / .01;
                levels[i] = fraction > 0 ? Math.max(30.0 / 255, Math.min(1, 1 + .2 * Math.log(fraction))) : 30.0 / 255;
            }
        }
        return levels;
    }
}
