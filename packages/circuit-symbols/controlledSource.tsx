import { Lead, UprightText } from "./svg";
import type { Pose } from "./svg";

export function ControlledSource({
  label,
  inputCount,
  pose,
}: {
  label: string;
  inputCount: number;
  pose?: Pose;
}) {
  const currentInput = label.startsWith("CC");
  const output = label.endsWith("VS") ? "V" : label === "VCCS" ? "C" : "O";
  const lastRow = Math.max(2, inputCount) - 1;
  const rows = [
    ...Array.from({ length: inputCount }, (_, index) => {
      const input = String.fromCharCode(
        65 + (currentInput ? Math.floor(index / 2) : index),
      );
      return {
        x: -100,
        row: index,
        text: currentInput ? input + (index % 2 ? "−" : "+") : input,
      };
    }),
    { x: 100, row: 0, text: output + "+" },
    { x: 100, row: 1, text: output + "−" },
  ];
  return (
    <>
      <rect x={-65} y={-25} width={130} height={(lastRow + 1) * 50} rx={4} />
      {rows.map(({ x, row, text }) => {
        const y = row * 50;
        return (
          <g key={text}>
            <Lead from={[x, y]} to={[Math.sign(x) * 65, y]} />
            <UprightText
              pose={pose}
              x={Math.sign(x) * 46}
              y={y}
              fontSize={14}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {text}
            </UprightText>
          </g>
        );
      })}
      <UprightText
        pose={pose}
        x={0}
        y={25}
        fontSize={20}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {label}
      </UprightText>
    </>
  );
}
