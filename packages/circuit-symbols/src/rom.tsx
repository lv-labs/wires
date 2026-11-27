import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "rom";
export const metadata = {
  name: "ROM",
  prefix: "U",
  pins: {
    enable: [-50, -100],
    A3: [-50, -50],
    A2: [-50, 0],
    A1: [-50, 50],
    A0: [-50, 100],
    D3: [100, -50],
    D2: [100, 0],
    D1: [100, 50],
    D0: [100, 100],
  },
  parameters: {
    highVoltage: 5,
    dataBits: 4,
    lsbFirst: false,
    addressBits: 4,
    contents: "",
    hexDisplay: false,
    reloadOnReset: true,
  },
} as const;

export function Symbol({
  pinPositions = metadata.pins,
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  const rows =
    Math.max(Number(parameters.addressBits), Number(parameters.dataBits)) + 1;
  return (
    <DiscreteChip
      pins={pinPositions}
      columns={2}
      rows={rows}
      caption="ROM"
      labels={{ enable: "OE" }}
      inverted={["enable"]}
      pose={pose}
    />
  );
}
