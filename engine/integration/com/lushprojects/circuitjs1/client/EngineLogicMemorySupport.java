package com.lushprojects.circuitjs1.client;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Vector;

/** Validated individual-pin logic models and memories. */
final class EngineLogicMemorySupport {
    static ChipElm construct(String[] fields,int x,int y,int x2,int y2,int flags) {
        String type=fields[0];
        boolean logic=type.equals("208"), ram=type.equals("413"), rom=type.equals("436");
        boolean transceiver=type.equals("BusTransceiver");
        if (!(logic||ram||rom||transceiver)) return null;

        boolean custom=(flags&8192)!=0;
        int index=custom?7:6;
        int count=logic?5:transceiver?1:3;
        int mask=8192|(ram||rom?6:0);
        require(fields.length==index+count && (flags&~mask)==0 && x2-x==64 && y==32 && y2==32,
            "Invalid custom logic or memory record");
        double high=custom?EngineOutputSupport.number(fields,6):5;
        require(high>0,"Logic voltage must be positive");

        if (logic) {
            String name=EngineOutputSupport.decode(fields[index]);
            String[] inputs=labels(EngineOutputSupport.decode(fields[index+1]));
            String[] outputs=labels(EngineOutputSupport.decode(fields[index+2]));
            String rules=EngineOutputSupport.decode(fields[index+3]);
            String initial=EngineOutputSupport.decode(fields[index+4]);
            require(name.length()<=400&&!name.trim().isEmpty() && inputs.length<=16 &&
                outputs.length>=1 && outputs.length<=16 && rules.length()<=8192 &&
                (initial.isEmpty()||initial.length()==outputs.length&&initial.matches("[01]+")),
                "Invalid custom logic pins or initial state");
            for (String row : rules.split("\\r?\\n")) {
                String rule=row.trim().replace(" ","").toLowerCase();
                if (rule.isEmpty()||rule.startsWith("#")) continue;
                String[] terms=rule.split("=",-1);
                require(terms.length==2 && terms[0].length()>=inputs.length &&
                    terms[0].length()<=inputs.length+outputs.length && terms[0].matches("[01?+a-z-]*") &&
                    terms[1].length()==outputs.length && terms[1].matches("[01_a-z]+"),"Invalid custom logic rule");
            }
            CustomLogicModel model=new CustomLogicModel();
            model.name=name;
            model.inputs=inputs;
            model.outputs=outputs;
            model.infoText=name;
            model.rules=rules;
            model.parseRules(null);
            // The document owns each model definition. Register it only while
            // the native constructor looks it up, without leaking across parts.
            String temporaryName="wires-worker-model";
            CustomLogicModel.getModelWithName(temporaryName);
            CustomLogicModel.modelMap.put(temporaryName,model);
            try {
                StringBuilder args=new StringBuilder(custom?high+" ":"");
                args.append(temporaryName);
                for (int i=0;i<outputs.length;i++)
                    args.append(' ').append(!initial.isEmpty()&&initial.charAt(i)=='1'?high:0);
                return new WorkerLogic(x,y,x2,y2,flags,new StringTokenizer(args.toString()));
            } finally {
                CustomLogicModel.modelMap.remove(temporaryName);
            }
        }
        int addressBits=EngineOutputSupport.integer(fields,index,2,16);
        if (transceiver) {
            BusTransceiverElm part=new BusTransceiverElm(x,y);
            part.x2=x2;
            part.y2=y2;
            part.highVoltage=high;
            part.dataBits=addressBits;
            part.setupPins();
            return part;
        }

        int dataBits=EngineOutputSupport.integer(fields,index+1,2,16);
        String contents=EngineOutputSupport.decode(fields[index+2]);
        HashMap<Integer,Integer> words=memoryWords(contents,addressBits,dataBits,(flags&4)!=0);
        StringTokenizer args=new StringTokenizer((custom?high+" ":"")+addressBits+" "+dataBits+" -2");
        SRAMElm memory=ram?new SRAMElm(x,y,x2,y2,flags,args):new ROMElm(x,y,x2,y2,flags,args);
        memory.map=words;
        if ((flags&2)!=0) memory.initialMap=new HashMap<Integer,Integer>(words);
        return memory;
    }

    private static final class WorkerLogic extends CustomLogicElm {
        WorkerLogic(int x,int y,int x2,int y2,int flags,StringTokenizer st) { super(x,y,x2,y2,flags,st); }

        @Override void setVoltageSource(int j, VoltageSource source) {
            super.setVoltageSource(j,source);
            if (hasTriState()) source.setNodes(CircuitNode.ground,nodes[postCount+j]);
        }

        @Override boolean getMatrixConnection(int a,int b) {
            if (!hasTriState()) return super.getMatrixConnection(a,b);
            for (int i=0;i<outputCount;i++)
                if (comparePair(a,b,inputCount+i,postCount+i)) return true;
            return false;
        }
    }

    private static void require(boolean ok,String message) { EngineOutputSupport.require(ok,message); }

    private static String[] labels(String text) {
        require(text.length()<=400,"Pin labels too long");
        ArrayList<String> labels=new ArrayList<String>();
        for (String entry:text.split(",")) {
            String name=entry.trim();
            require(name.length()<=24,"Pin label too long");
            if (!name.isEmpty()) labels.add(name);
        }
        return labels.toArray(new String[labels.size()]);
    }

    private static HashMap<Integer,Integer> memoryWords(String contents,int addressBits,int dataBits,boolean hex) {
        require(contents.length()<=65536,"Memory contents too long");
        HashMap<Integer,Integer> words=new HashMap<Integer,Integer>();
        for (String row:contents.split("\\r?\\n")) {
            if (row.trim().isEmpty()) continue;
            String[] pair=row.split(":",-1);
            require(pair.length==2&&!pair[1].trim().isEmpty(),"Expected memory address and data");
            int address=word(pair[0].trim(),hex);
            for (String token:pair[1].trim().split("\\s+")) {
                int value=word(token,hex);
                require(address>=0&&address<(1<<addressBits)&&value>=0&&value<(1<<dataBits),"Memory word outside width");
                words.put(address++,value);
            }
        }
        return words;
    }

    private static int word(String token,boolean hex) {
        if(token.matches("0[xX][0-9a-fA-F]+"))return Integer.parseInt(token.substring(2),16);
        if(token.matches("0[bB][01]+"))return Integer.parseInt(token.substring(2),2);
        require(token.matches(hex?"[0-9a-fA-F]+":"[0-9]+"),"Invalid memory word");
        return Integer.parseInt(token,hex?16:10);
    }

    static void restoreRam(Vector<CircuitElm> previous,Vector<CircuitElm> fresh) {
        for (int i=0;i<previous.size()&&i<fresh.size();i++) {
            CircuitElm old=previous.get(i), next=fresh.get(i);
            if (old instanceof SRAMElm && !(old instanceof ROMElm) && next instanceof SRAMElm &&
                !(next instanceof ROMElm) && (next.flags&SRAMElm.FLAG_RELOAD_ON_RESET)==0)
                ((SRAMElm) next).map=new HashMap<Integer,Integer>(((SRAMElm) old).map);
        }
    }
}
