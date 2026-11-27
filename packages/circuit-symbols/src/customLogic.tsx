import { DiscreteChip } from "../discreteChip";
import type { SymbolProps } from "../svg";

export const kind = "customLogic";
export const metadata = {
  name: "Custom logic",
  prefix: "U",
  pins: {
    I0: [-50, 0],
    I1: [-50, 50],
    Q0: [100, 0],
  },
  parameters: {
    highVoltage: 5,
    modelName: "Custom logic",
    inputLabels: "A,B",
    outputLabels: "Q",
    rules: "11=1\n??=0",
    initialOutputs: "",
  },
} as const;

export function Symbol({
  pinPositions = metadata.pins,
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  const inputs = String(parameters.inputLabels)
    .split(",")
    .map((pin) => pin.trim())
    .filter(Boolean);
  const outputs = String(parameters.outputLabels)
    .split(",")
    .map((pin) => pin.trim())
    .filter(Boolean);
  const labels = Object.fromEntries([
    ...inputs.map((label, i) => [`I${i}`, label]),
    ...outputs.map((label, i) => [`Q${i}`, label]),
  ]);
  return (
    <DiscreteChip
      pins={pinPositions}
      columns={2}
      rows={Math.max(inputs.length, outputs.length)}
      caption={String(parameters.modelName).slice(0, 12)}
      labels={labels}
      pose={pose}
    />
  );
}
