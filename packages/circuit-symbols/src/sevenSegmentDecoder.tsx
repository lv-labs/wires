import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "sevenSegmentDecoder";
export const metadata = {
  prefix: "U",
  name: "7-Segment decoder",
  pins: {
    a: [100, -150],
    b: [100, -100],
    c: [100, -50],
    d: [100, 0],
    e: [100, 50],
    f: [100, 100],
    g: [100, 150],
    I3: [-100, -150],
    I2: [-100, -100],
    I1: [-100, -50],
    I0: [-100, 0],
  },
  parameters: {
    highVoltage: 5,
    segmentMode: 0,
    blankPin: false,
    blankOnF: false,
    lsbFirst: false,
  },
} as const;

export function Symbol({
  pinPositions = metadata.pins,
  pose,
  parameters,
}: SymbolProps) {
  return (
    <DiscreteChip
      pins={pinPositions}
      caption="SEG"
      pose={pose}
      columns={3}
      rows={[7, 14, 16][Number(parameters?.segmentMode ?? 0)]}
      labels={{ blank: "BI" }}
      inverted={["blank"]}
    />
  );
}
