import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "busTransceiver";
export const metadata = {
  name: "Bus transceiver",
  prefix: "U",
  pins: {
    enable: [-50, -100],
    direction: [100, -100],
    A3: [-50, 0],
    A2: [-50, 50],
    A1: [-50, 100],
    A0: [-50, 150],
    B3: [100, 0],
    B2: [100, 50],
    B1: [100, 100],
    B0: [100, 150],
  },
  parameters: {
    highVoltage: 5,
    dataBits: 4,
    lsbFirst: false,
  },
} as const;

export function Symbol({
  pinPositions = metadata.pins,
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  return (
    <DiscreteChip
      pins={pinPositions}
      columns={2}
      rows={Number(parameters.dataBits) + 2}
      caption="XCVR"
      labels={{ enable: "OE", direction: "DIR" }}
      inverted={["enable"]}
      pose={pose}
    />
  );
}
