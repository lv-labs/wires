import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "potentiometer";
export const metadata = {

  prefix: "RV",
  name: "Potentiometer",
  pins: {
    a: [-100, 0],
    b: [100, 0],
    wiper: [0, 100],
  },
  parameters: {
    resistance: 1000,
    position: 0.5,
    label: "",
  },
} as const;

export function Symbol({ parameters }: SymbolProps) {
  const position =
    typeof parameters?.position === "number"
      ? parameters.position
      : metadata.parameters.position;
  const halfWidth = 70;
  const arrowX = (2 * position - 1) * halfWidth;
  const [wiperX, wiperY] = metadata.pins.wiper;
  return (
    <>
      <Lead from={metadata.pins.a} to={[-halfWidth, 0]} />
      <Lead from={metadata.pins.b} to={[halfWidth, 0]} />
      <rect x={-halfWidth} y={-30} width={2 * halfWidth} height={60} />
      <path
        d={`
          M ${wiperX} ${wiperY}
          V 70
          H ${arrowX}
          V 35
          M ${arrowX - 10} 45
          L ${arrowX} 35
          L ${arrowX + 10} 45
        `}
      />
      <path d="M -25 0
      L 25 0
      M 15 -10
      L 25 0
      L 15 10"
      />
    </>
  );
}
