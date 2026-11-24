import type { SymbolProps } from "../svg";
import { Lead } from "../svg";

export const kind = "npn";
export const metadata = {

  prefix: "Q",
  name: "NPN transistor",
  pins: {
    base: [-200, 0],
    collector: [100, -200],
    emitter: [100, 200],
  },
  parameters: {
    beta: 100,
    model: "default",
    swapTerminals: false,
    drawCircle: false,
  },
} as const;

export function Symbol({ parameters = metadata.parameters }: SymbolProps) {
  return (
    <g transform={parameters.swapTerminals ? "scale(1 -1)" : undefined}>
      {parameters.drawCircle === true && <circle cx={4} r={28} />}
      <Lead from={metadata.pins.base} to={[-60, 0]} />
      <Lead from={metadata.pins.collector} to={[100, -100]} />
      <Lead from={metadata.pins.emitter} to={[100, 100]} />
      <circle r="111" cx="50"/>
      <path d="M 25 -75
      V 75" strokeWidth="20" />
      
     <path
     d="M -60, 0
     20, 0" />
   
      <path
        d="M 25 -25,
         100 -100"
      />
      
      <path
        d="M 25 25,
         100 100"
      />
      
     
      <path
        d="M 90 90,
         70 50"
      />
      
      <path
        d="M 90 90,
         50 70"
      />
    </g>
  );
}
