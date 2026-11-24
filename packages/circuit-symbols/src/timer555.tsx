import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "timer555";
export const metadata = {
  name: "555 Timer",
  prefix: "U",
  pins: {
    discharge: [-100, -50],
    trigger: [-100, 50],
    threshold: [-100, 100],
    supply: [0, -150],
    control: [0, 150],
    out: [100, 0],
    reset: [100, -50],
    ground: [50, 150],
  },
  parameters: {
    resetPin: true,
    groundPin: true,
    pinNumbers: false,
    initialOutputVoltage: 0,
  },
} as const;

export const output = {
  type: "165",
  sign: null,
  fields: {
    resetPin: { label: "Reset pin (always shown with ground)", type: "boolean", default: true },
    groundPin: { label: "Ground pin", type: "boolean", default: true },
    pinNumbers: { label: "Show pin numbers", type: "boolean", default: false },
    initialOutputVoltage: { label: "Initial output voltage · V", type: "number", default: 0 },
  },
} as const;

const leads = [
  ["discharge", [-75, -50], "DIS", "7", -67, -50, "start"],
  ["trigger", [-75, 50], "TRG", "2", -67, 50, "start"],
  ["threshold", [-75, 100], "THR", "6", -67, 100, "start"],
  ["supply", [0, -120], "VCC", "8", 0, -107, "middle"],
  ["control", [0, 120], "CTL", "5", 0, 105, "middle"],
  ["out", [75, 0], "OUT", "3", 67, 0, "end"],
  ["reset", [75, -50], "RST", "4", 67, -50, "end"],
  ["ground", [50, 120], "GND", "1", 50, 105, "middle"],
] as const;

export function Symbol({ parameters = metadata.parameters, pose }: SymbolProps) {
  return (
    <>
      <rect x={-75} y={-120} width={150} height={240} rx={4} />
      {leads.map(([pin, end, name, number, x, y, align]) => {
        if (pin === "ground" && !parameters.groundPin) return null;
        if (pin === "reset" && !parameters.resetPin && !parameters.groundPin) return null;
        return (
          <g key={pin}>
            <Lead from={metadata.pins[pin]} to={end} />
            <UprightText
              pose={pose}
              x={x}
              y={y}
              fontSize={15}
              textAnchor={align}
              dominantBaseline="central"
              textDecoration={!parameters.pinNumbers && (pin === "trigger" || pin === "reset") ? "overline" : undefined}
            >
              {parameters.pinNumbers ? number : name}
            </UprightText>
          </g>
        );
      })}
      <UprightText pose={pose} x={0} y={0} fontSize={24} textAnchor="middle" dominantBaseline="central">
        555
      </UprightText>
    </>
  );
}
