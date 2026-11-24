package com.lushprojects.circuitjs1.client;

/** Canonical posts use the native side-1 coil layout. The editor owns presentation. */
final class EngineRelaySupport {
    static RelayElm construct(String[] fields, int x, int y, int x2, int y2, int flags, double dt) {
        EngineOutputSupport.require(fields.length == 16 && x2-x == 64 && y == 32 && y2 == 32 &&
            (flags == 0 || flags == 16), "Invalid relay record geometry or flags");
        int poles = Integer.parseInt(fields[6]), position = Integer.parseInt(fields[15]);
        EngineOutputSupport.require(poles >= 1 && poles <= 4 && position >= 0 && position <= 2,
            "Invalid relay pole count or position");
        EngineOutputSupport.positive(fields, 7, 9, 10, 11, 12, 13);
        RelayModel model = new RelayModel();
        model.poleCount = poles;
        model.inductance = EngineOutputSupport.number(fields, 7);
        model.r_on = EngineOutputSupport.number(fields, 9);
        model.r_off = EngineOutputSupport.number(fields, 10);
        model.onCurrent = EngineOutputSupport.number(fields, 11);
        model.coilR = EngineOutputSupport.number(fields, 12);
        model.offCurrent = EngineOutputSupport.number(fields, 13);
        model.switchingTime = EngineOutputSupport.number(fields, 14);
        model.coilStyle = 1;
        model.pulldown = flags == 16;
        EngineOutputSupport.require(model.switchingTime >= 0 &&
            (model.switchingTime == 0 || EngineOutputSupport.finite(dt/model.switchingTime)) &&
            EngineOutputSupport.finite(dt/model.inductance), "Invalid relay time constants");

        RelayElm relay = new RelayElm(x, y);
        relay.x2 = x2;
        relay.y2 = y2;
        relay.flags = flags;
        relay.model = model;
        relay.coilCurrent = EngineOutputSupport.number(fields, 8);
        relay.d_position = relay.i_position = position;
        relay.postUndump();
        return relay;
    }

    static void configure(RelayElm current, RelayElm fresh) {
        int oldCoilIndex = current.nCoil1;
        current.model = fresh.model;
        if (oldCoilIndex != 3*current.poleCount()) {
            double[] previousVoltages = current.volts;
            current.setupPoles();
            current.allocNodes();
            System.arraycopy(previousVoltages,0,current.volts,0,Math.min(oldCoilIndex,current.nCoil1));
            System.arraycopy(previousVoltages,oldCoilIndex,current.volts,current.nCoil1,3);
        }
        current.ind.setup(current.inductance(), current.coilCurrent, Inductor.FLAG_BACK_EULER);
    }
}
