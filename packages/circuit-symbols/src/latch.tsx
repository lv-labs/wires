import { Chip } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "latch";
export const metadata = {
  prefix: "U",
  name: "Latch / register (4 bit)",
  pins: {
    I0: [-150, 100],
    I1: [-150, 0],
    I2: [-150, -100],
    I3: [-150, -200],
    O0: [150, 100],
    O1: [150, 0],
    O2: [150, -100],
    O3: [150, -200],
    load: [-150, 200],
  },
  parameters: {
    highVoltage: 5,
    initialValue: 0,
    edgeTriggered: true,
  },
} as const;

export function Symbol({
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  return (
    <Chip
      pins={metadata.pins}
      labels={{ load: "Ld" }}
      clocks={parameters.edgeTriggered ? ["load"] : []}
      pose={pose}
    />
  );
}
