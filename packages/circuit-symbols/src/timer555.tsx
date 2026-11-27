import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "timer555";
export const metadata = {
  name: "555 Timer",
  prefix: "U",
  pins: {
    discharge: [-150, -100],
    trigger: [-150, 0],
    threshold: [-150, 100],
    supply: [0, -200],
    control: [-50, 200],
    out: [150, 0],
    reset: [150, -100],
    ground: [50, 200],
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
  ["discharge", [-125, -100], "DIS", "7", -110, -100, "start"],
  ["trigger", [-125, 0], "TRG", "2", -110, 0, "start"],
  ["threshold", [-125, 100], "THR", "6", -110, 100, "start"],
  ["supply", [0, -150], "VCC", "8", 0, -125, "middle"],
  ["control", [-50, 150], "CTL", "5", -50, 125, "middle"],
  ["out", [125, 0], "OUT", "3", 110, 0, "end"],
  ["reset", [125, -100], "RST", "4", 110, -100, "end"],
  ["ground", [50, 150], "GND", "1", 50, 125, "middle"],
] as const;

export function Symbol({ parameters = metadata.parameters, pose }: SymbolProps) {
  return (
    <>
      <rect x={-125} y={-150} width={250} height={300} rx={12} />
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
              fontSize={30}
              textAnchor={align}
              dominantBaseline="central"
              overline={!parameters.pinNumbers && (pin === "trigger" || pin === "reset")}
            >
              {parameters.pinNumbers ? number : name}
            </UprightText>
          </g>
        );
      })}
      <UprightText pose={pose} x={0} y={-53} fontSize={38} textAnchor="middle" dominantBaseline="central">
        555
      </UprightText>
    </>
  );
}
