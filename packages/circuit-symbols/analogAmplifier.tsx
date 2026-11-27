import { Lead, UprightText } from "./svg";
import type { Pin, SymbolProps } from "./svg";

export function AnalogAmplifier({
  pins,
  pose,
  openCollector,
}: {
  pins: Record<string, Pin>;
  pose?: SymbolProps["pose"];
  openCollector?: boolean;
}) {
  const minusY = pins.minus[1],
    plusY = pins.plus[1];
  return (
    <>
      <path d="M -75 -85 L 85 0 L -75 85 Z" />
      <Lead from={pins.minus} to={[-75, minusY]} />
      <Lead from={pins.plus} to={[-75, plusY]} />
      <Lead from={pins.out} to={[85, 0]} />
      {pins.positiveSupply && <Lead from={pins.positiveSupply} to={[0, -45]} />}
      {pins.negativeSupply && <Lead from={pins.negativeSupply} to={[0, 45]} />}
      <UprightText
        pose={pose}
        x={-55}
        y={minusY + 7}
        textAnchor="middle"
        fontSize={27}
      >
        −
      </UprightText>
      <UprightText
        pose={pose}
        x={-55}
        y={plusY + 7}
        textAnchor="middle"
        fontSize={27}
      >
        +
      </UprightText>
      {openCollector && <path d="M 25 0 l 10 -10 l 10 10 l -10 10 Z" />}
    </>
  );
}
