import { Gate } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "nandGate";
export const metadata = {

  prefix: "U",
  name: "NAND gate",
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
  pose,
  parameters = metadata.parameters,
}: SymbolProps) {
  return (
    <Gate
      pins={metadata.pins}
      parameters={parameters}
      label="NAND"
      pose={pose}
    />
  );
}
