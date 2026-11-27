import { Gate } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "andGate";
export const metadata = {
  prefix: "U",
  name: "AND gate",
  pins: {
    a: [-150, -50],
    b: [-150, 50],
    out: [150, 0],
  },
  parameters: {
    highVoltage: 5,
    inputCount: 2,
    propagationDelay: 0,
    schmittInputs: false,
    invertInputs: false,
  },
} as const;

export function Symbol({
  pinPositions = metadata.pins,
  parameters = metadata.parameters,
}: SymbolProps) {
  return (
    <Gate
      pins={pinPositions}
      parameters={parameters}
      shape="and"
    />
  );
}
