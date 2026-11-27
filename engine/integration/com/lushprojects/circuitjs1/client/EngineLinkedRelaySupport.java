package com.lushprojects.circuitjs1.client;

import java.util.Vector;

/** Native relay elements and label links used by the headless simulator. */
final class EngineLinkedRelaySupport {
    static CircuitElm construct(String[] f, int x, int y, int x2, int y2, int flags, double dt) {
        String type = f[0];
        if (type.equals("425")) {
            require(f.length == 16 && flags == 0 && x == x2 && y == 32 && y2 == 64, "Invalid relay coil format");
            EngineOutputSupport.positive(f, 7, 9, 10, 11);
            double inductance = EngineOutputSupport.number(f, 7), initial = EngineOutputSupport.number(f, 8);
            require(EngineOutputSupport.finite(dt / inductance) && EngineOutputSupport.finite(dt * initial / inductance),
                "Invalid relay coil inductance or initial current");
            nonnegative(f, 12);
            EngineOutputSupport.integer(f, 13, 0, 3);
            EngineOutputSupport.integer(f, 14, 0, 3);
            EngineOutputSupport.integer(f, 15, 0, 1);
            return new WorkerCoil(x, y, x2, y2, new StringTokenizer(legacyLabel(f, 6) + " " + join(f, 7)));
        }
        if (type.equals("426")) {
            require(f.length == 10 && (flags & ~2) == 0 && x == x2 && y == 32 && y2 == 64,
                "Invalid relay contact format");
            EngineOutputSupport.positive(f, 7, 8);
            int initialPosition = EngineOutputSupport.integer(f, 9, 0, 1);
            return new WorkerContact(x, y, x2, y2, flags,
                new StringTokenizer(legacyLabel(f, 6) + " " + join(f, 7)), initialPosition);
        }
        if (type.equals("414")) {
            require(f.length == 10 && flags == 0 && x2 - x == 64 && y == 32 && y2 == 32, "Invalid time delay relay format");
            nonnegative(f, 6);
            nonnegative(f, 7);
            EngineOutputSupport.positive(f, 8, 9);
            return new WorkerTimeDelayRelay(x, y, x2, y2, new StringTokenizer(join(f, 6)));
        }
        if (type.equals("428")) {
            require(f.length == 10 && flags == 0 && x2 - x == 64 && y == 32 && y2 == 32, "Invalid motor protection switch format");
            EngineOutputSupport.positive(f, 6, 7);
            require(f[8].equals("true") || f[8].equals("false"), "Invalid motor protection state");
            return new WorkerMotorProtection(x, y, x2, y2,
                new StringTokenizer(join(f, 6, 9) + " " + legacyLabel(f, 9)));
        }
        return null;
    }

    static void configure(CircuitElm element, CircuitElm fresh) {
        if (element instanceof WorkerCoil) {
            WorkerCoil a = (WorkerCoil) element, b = (WorkerCoil) fresh;
            a.inductance = b.inductance;
            a.coilR = b.coilR;
            a.onCurrent = b.onCurrent;
            a.offCurrent = b.offCurrent;
            a.switchingTime = b.switchingTime;
            a.type = b.type;
            a.label = b.label;
            a.ind.setup(a.inductance, a.coilCurrent, Inductor.FLAG_BACK_EULER);
        } else if (element instanceof WorkerContact) {
            WorkerContact a = (WorkerContact) element, b = (WorkerContact) fresh;
            a.r_on = b.r_on;
            a.r_off = b.r_off;
            a.label = b.label;
            a.initialPosition = b.initialPosition;
        } else if (element instanceof WorkerTimeDelayRelay) {
            WorkerTimeDelayRelay a = (WorkerTimeDelayRelay) element, b = (WorkerTimeDelayRelay) fresh;
            a.onDelay = b.onDelay;
            a.offDelay = b.offDelay;
            a.onResistance = b.onResistance;
            a.offResistance = b.offResistance;
        } else if (element instanceof WorkerMotorProtection) {
            WorkerMotorProtection a = (WorkerMotorProtection) element, b = (WorkerMotorProtection) fresh;
            a.i2t = b.i2t;
            a.resistance = b.resistance;
            a.label = b.label;
        }
    }

    static void resetContactPositions(Vector<CircuitElm> elements) {
        // Controllers apply their retained positions during stamping. Contacts
        // whose controller was removed or renamed fall back to their own state.
        for (CircuitElm element : elements)
            if (element instanceof WorkerContact) {
                WorkerContact contact = (WorkerContact) element;
                contact.i_position = contact.initialPosition;
            }
    }

    private static void require(boolean ok, String reason) { EngineOutputSupport.require(ok, reason); }

    private static void nonnegative(String[] f, int index) {
        require(EngineOutputSupport.number(f, index) >= 0, "Relay delay must be nonnegative");
    }

    private static String legacyLabel(String[] f, int index) {
        String label = EngineOutputSupport.decode(f[index]);
        require(label.length() <= 80, "Relay link label is too long");
        for (int i = 0; i < label.length(); i++)
            require(label.charAt(i) >= 32, "Invalid relay link label");
        return label.isEmpty() ? "\\0" : CustomLogicModel.escape(label);
    }

    private static String join(String[] f, int start) { return join(f, start, f.length); }

    private static String join(String[] f, int start, int end) {
        StringBuilder result = new StringBuilder();
        for (int i = start; i < end; i++) {
            if (i > start) result.append(' ');
            result.append(f[i]);
        }
        return result.toString();
    }

    private static final class WorkerCoil extends RelayCoilElm {
        WorkerCoil(int x, int y, int x2, int y2, StringTokenizer st) { super(x, y, x2, y2, 0, st); }

        @Override double getCurrent() { return coilCurrent; }
    }

    private static final class WorkerContact extends RelayContactElm {
        int initialPosition;

        WorkerContact(int x, int y, int x2, int y2, int flags, StringTokenizer st, int initialPosition) {
            super(x, y, x2, y2, flags, st);
            this.initialPosition = initialPosition;
        }

        @Override double getCurrent() { return (volts[0] - volts[1]) / (i_position == 0 ? r_on : r_off); }

        @Override double getCurrentIntoNode(int n) { return n == 0 ? -getCurrent() : getCurrent(); }
    }

    private static final class WorkerTimeDelayRelay extends TimeDelayRelayElm {
        WorkerTimeDelayRelay(int x, int y, int x2, int y2, StringTokenizer st) {
            super(x, y, x2, y2, 0, st);
            allocNodes();
        }

        @Override boolean getConnection(int a, int b) { return a / 2 == b / 2; }
    }

    private static final class WorkerMotorProtection extends MotorProtectionSwitchElm {
        WorkerMotorProtection(int x, int y, int x2, int y2, StringTokenizer st) {
            super(x, y, x2, y2, 0, st);
            allocNodes();
        }

        @Override void stamp() {
            super.stamp();
            setSwitchPositions();
        }
    }
}
