package com.lushprojects.circuitjs1.client;

/** Public worker records for pinned analog components with built-in internal circuits. */
final class EngineAnalogCompositeSupport {
    static CircuitElm construct(String[] f, int x, int y, int x2, int y2, int flags) {
        String type = f[0];
        if (type.equals("400")) {
            require(f.length == 9 && flags == 0 && horizontal(x,y,x2,y2,64), "Invalid Darlington format");
            int sign = Integer.parseInt(f[6]);
            require(sign == 1 || sign == -1, "Invalid Darlington polarity");
            EngineOutputSupport.positive(f, 7, 8);
            DarlingtonElm part = sign == 1 ? new NDarlingtonElm(x,y) : new PDarlingtonElm(x,y);
            setEnds(part,x2,y2);
            transistor(part,0).setBeta(EngineOutputSupport.number(f,7));
            transistor(part,1).setBeta(EngineOutputSupport.number(f,8));
            return part;
        }
        if (type.equals("401")) {
            require(f.length == 6 && flags == 0 && horizontal(x,y,x2,y2,64), "Invalid comparator format");
            ComparatorElm part = new ComparatorElm(x,y);
            setEnds(part,x2,y2);
            part.setSize(2);
            return part;
        }
        if (type.equals("402")) {
            require(f.length == 8 && flags == 0 && horizontal(x,y,x2,y2,96), "Invalid OTA format");
            double negative = EngineOutputSupport.number(f,6), positive = EngineOutputSupport.number(f,7);
            require(positive>negative && EngineOutputSupport.finite(positive-negative), "Invalid OTA supply range");
            OTAElm part = new OTAElm(x,y);
            setEnds(part,x2,y2);
            configureOTA(part, negative, positive);
            return part;
        }
        if (type.equals("407")) {
            require(f.length == 8 && flags == 0 && horizontal(x,y,x2,y2,64), "Invalid optocoupler format");
            EngineOutputSupport.positive(f,6);
            require(f[7].equals("default-optocoupler-led") || f[7].equals("default"), "Unsupported optocoupler diode model");
            OptocouplerElm part = new OptocouplerElm(x,y);
            setEnds(part,x2,y2);
            configureOptocoupler(part, EngineOutputSupport.number(f,6), f[7]);
            return part;
        }
        if (type.equals("409")) {
            require(f.length == 10 && flags == 0 && horizontal(x,y,x2,y2,64), "Invalid real op amp format");
            EngineOutputSupport.positive(f,6,8);
            EngineOutputSupport.number(f,7);
            EngineOutputSupport.integer(f,9,0,2);
            return new OpAmpRealElm(x,y,x2,y2,flags,new StringTokenizer(f[6]+" "+f[7]+" "+f[8]+" "+f[9]));
        }
        if (type.equals("417")) {
            require(f.length == 6 && flags == 0 && horizontal(x,y,x2,y2,64), "Invalid unijunction format");
            boolean adaptive = CircuitElm.sim.adjustTimeStep;
            try {
                return new UnijunctionElm(x,y,x2,y2,flags,new StringTokenizer(""));
            } finally {
                // Overall timestep policy is controlled by the loaded document.
                CircuitElm.sim.adjustTimeStep = adaptive;
            }
        }
        return null;
    }

    static void configure(CircuitElm element, CircuitElm fresh) {
        if (element instanceof DarlingtonElm) {
            DarlingtonElm a = (DarlingtonElm) element, b = (DarlingtonElm) fresh;
            transistor(a,0).setBeta(transistor(b,0).beta);
            transistor(a,1).setBeta(transistor(b,1).beta);
        } else if (element instanceof OTAElm) {
            OTAElm a = (OTAElm) element, b = (OTAElm) fresh;
            configureOTA(a,b.negVolt,b.posVolt);
        } else if (element instanceof OptocouplerElm) {
            OptocouplerElm a = (OptocouplerElm) element, b = (OptocouplerElm) fresh;
            configureOptocoupler(a,b.ctr,b.diode.modelName);
        }
    }

    private static void require(boolean ok, String reason) { EngineOutputSupport.require(ok,reason); }

    private static boolean horizontal(int x,int y,int x2,int y2,int length) {
        return x2-x==length && y==32 && y2==32;
    }

    private static void setEnds(CircuitElm part,int x,int y) {
        part.x2=x;
        part.y2=y;
    }

    private static TransistorElm transistor(CompositeElm part,int index) {
        return (TransistorElm) part.compElmList.get(index);
    }

    private static void configureOTA(OTAElm p,double negative,double positive) {
        p.negVolt = negative;
        p.posVolt = positive;
        ((RailElm) p.compElmList.get(0)).maxVoltage = negative;
        ((RailElm) p.compElmList.get(1)).maxVoltage = positive;
    }

    private static void configureOptocoupler(OptocouplerElm part,double ctr,String model) {
        CCCSElm source = (CCCSElm) part.compElmList.get(1);
        String expression = source.exprString;
        source.setExpr(ctr + expression.substring(expression.indexOf('*')));
        part.ctr = ctr;
        part.diode.modelName = model;
        part.diode.setup();
    }
}
