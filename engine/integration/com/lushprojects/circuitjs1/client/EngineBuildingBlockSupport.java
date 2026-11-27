package com.lushprojects.circuitjs1.client;

import java.util.Vector;

/** Native gate and two-port building blocks. */
final class EngineBuildingBlockSupport {
    static CircuitElm construct(String[] fields, int x, int y, int x2, int y2, int flags, double dt) {
        String type = fields[0];
        if (type.equals("412")) {
            EngineOutputSupport.require(fields.length == 10 && (flags & ~2) == 0 && x == x2 && y == 32 && y2 == 64,
                "Invalid crystal format");
            EngineOutputSupport.positive(fields, 6, 7, 8, 9);
            for (int i = 6; i <= 7; i++) {
                double capacitance = EngineOutputSupport.number(fields, i);
                EngineOutputSupport.require(EngineOutputSupport.finite(capacitance * 2 / dt) &&
                    EngineOutputSupport.finite(dt / (2 * capacitance)), "Invalid crystal capacitance");
            }
            EngineOutputSupport.require(EngineOutputSupport.finite(dt / EngineOutputSupport.number(fields, 8)),
                "Invalid crystal inductance");
            return new WorkerCrystal(x, y, x2, y2, flags, EngineOutputSupport.number(fields, 6),
                EngineOutputSupport.number(fields, 7), EngineOutputSupport.number(fields, 8),
                EngineOutputSupport.number(fields, 9));
        }
        if (type.equals("422")) {
            EngineOutputSupport.require(fields.length == 9 && flags == 0 && x == x2 && y == 32 && y2 == 64,
                "Invalid delay buffer format");
            EngineOutputSupport.require(EngineOutputSupport.number(fields, 6) >= 0, "Delay must be nonnegative");
            EngineOutputSupport.number(fields, 7);
            EngineOutputSupport.positive(fields, 8);
            return new DelayBufferElm(x, y, x2, y2, flags, args(fields));
        }
        if (!type.equals("180") && !type.equals("Gyrator")) return null;
        EngineOutputSupport.require(flags == 0 && x2 - x == 64 && y == 32 && y2 == 32,
            "Invalid building block geometry");
        if (type.equals("180")) {
            EngineOutputSupport.require(fields.length == 10, "Invalid tristate buffer format");
            EngineOutputSupport.positive(fields, 6, 7, 9);
            double pulldown = EngineOutputSupport.number(fields, 8);
            EngineOutputSupport.require(pulldown >= 0 && (pulldown == 0 || EngineOutputSupport.finite(1 / pulldown)),
                "Invalid tristate buffer pulldown");
            return new TriStateElm(x, y, x2, y2, flags, args(fields));
        }
        EngineOutputSupport.require(fields.length == 7, "Invalid gyrator format");
        EngineOutputSupport.positive(fields, 6);
        GyratorElm gyrator = new GyratorElm(x, y);
        gyrator.x2 = x2;
        gyrator.y2 = y2;
        gyrator.gyrResistance = EngineOutputSupport.number(fields, 6);
        return gyrator;
    }

    /** The CrystalElm netlist, constructed without the editor's element factory. */
    private static final class WorkerCrystal extends CompositeElm {
        private final CapacitorElm parallel = new CapacitorElm(0, 0);
        private final CapacitorElm series = new CapacitorElm(0, 0);
        private final InductorElm coil = new InductorElm(0, 0);
        private final ResistorElm resistor = new ResistorElm(0, 0);

        WorkerCrystal(int x, int y, int x2, int y2, int flags, double parallelCapacitance,
                      double seriesCapacitance, double inductance, double resistance) {
            super(x, y, x2, y2, flags);
            compElmList = new Vector<CircuitElm>();
            compElmList.add(parallel);
            compElmList.add(series);
            compElmList.add(coil);
            compElmList.add(resistor);
            for (CircuitElm element : compElmList) element.inComposite = true;
            compNodeInfo = new String[] { "1 2", "1 3", "3 4", "4 2" };
            extNodeIds = new int[] { 1, 2 };
            numPosts = extNodeIds.length;
            posts = new Point[numPosts];
            configure(parallelCapacitance, seriesCapacitance, inductance, resistance);
            buildCompNodeList();
            allocNodes();
            reset();
        }

        void configure(double parallelCapacitance, double seriesCapacitance, double inductance, double resistance) {
            parallel.setCapacitance(parallelCapacitance);
            series.setCapacitance(seriesCapacitance);
            coil.setInductance(inductance);
            resistor.setResistance(resistance);
        }

        void configureFrom(WorkerCrystal fresh) {
            configure(fresh.parallel.capacitance, fresh.series.capacitance, fresh.coil.inductance, fresh.resistor.resistance);
        }

        @Override void setPoints() {
            super.setPoints();
            setPost(0, point1);
            setPost(1, point2);
        }

        @Override int getDumpType() { return 412; }

        @Override double getCurrent() { return getCurrentIntoNode(1); }
    }

    private static StringTokenizer args(String[] fields) {
        StringBuilder values = new StringBuilder();
        for (int i = 6; i < fields.length; i++)
            values.append(fields[i]).append(' ');
        return new StringTokenizer(values.toString());
    }

    static void configure(CircuitElm old, CircuitElm fresh) {
        if (old instanceof WorkerCrystal) {
            ((WorkerCrystal) old).configureFrom((WorkerCrystal) fresh);
        } else if (old instanceof DelayBufferElm) {
            DelayBufferElm a = (DelayBufferElm) old, b = (DelayBufferElm) fresh;
            a.delay = b.delay;
            a.threshold = b.threshold;
            a.highVoltage = b.highVoltage;
        } else if (old instanceof TriStateElm) {
            TriStateElm a = (TriStateElm) old, b = (TriStateElm) fresh;
            a.r_on = b.r_on;
            a.r_off = b.r_off;
            a.r_off_ground = b.r_off_ground;
            a.highVoltage = b.highVoltage;
        } else if (old instanceof GyratorElm)
            ((GyratorElm) old).gyrResistance = ((GyratorElm) fresh).gyrResistance;
    }
}
