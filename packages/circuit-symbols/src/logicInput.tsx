import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "logicInput";
export const metadata = {
  prefix: "L",
  name: "Logic input",
  pins: {
    out: [0, 0],
  },
  parameters: {
    state: 1,
    highVoltage: 5,
    lowVoltage: 0,
    mode: "logic",
  },
} as const;

export function Symbol({
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  const state =
    parameters.mode === "logic"
      ? parameters.state === 0
        ? "L"
        : "H"
      : String(parameters.state);
  return (
    <>
      <circle r={50} cx={-100} />
      <Lead from={metadata.pins.out} to={[-50, 0]} />
      <UprightText
        pose={pose}
        x={-100}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="90"
      >
        {state}
      </UprightText>
    </>
  );
}
