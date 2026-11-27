import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "relayCoil";
export const metadata = {
  name: "Relay coil",
  prefix: "K",
  pins: {
    a: [-100, 0],
    b: [100, 0],
  },
  parameters: {
    label: "label",
    inductance: 0.2,
    coilResistance: 20,
    onCurrent: 0.02,
    offCurrent: 0.015,
    switchingTime: 0.005,
    mode: 0,
    initialCoilCurrent: 0,
    initialState: 0,
    initialPosition: 0,
  },
} as const;
export const output = {
  type: "425",
  fields: {
    label: {
      label: "Label for linking relays",
      type: "string",
      maxLength: 80,
    },
    inductance: {
      label: "Coil inductance · H",
      type: "number",
      exclusiveMin: 0,
    },
    coilResistance: {
      label: "Coil resistance · Ω",
      type: "number",
      exclusiveMin: 0,
    },
    onCurrent: {
      label: "Pickup current · A",
      type: "number",
      exclusiveMin: 0,
    },
    offCurrent: {
      label: "Release current · A",
      type: "number",
      exclusiveMin: 0,
    },
    switchingTime: {
      label: "Switching time · s",
      type: "number",
      min: 0,
    },
    mode: {
      label: "Type",
      type: "number",
      integer: true,
      min: 0,
      max: 3,
    },
    initialCoilCurrent: {
      label: "Initial coil current · A",
      type: "number",
    },
    initialState: {
      label: "Initial relay state",
      type: "number",
      integer: true,
      min: 0,
      max: 3,
    },
    initialPosition: {
      label: "Initial position",
      type: "number",
      integer: true,
      min: 0,
      max: 1,
    },
  },
  sign: 1,
};

export function Symbol({
  parameters = metadata.parameters,
  measured,
}: SymbolProps) {
  const energized = measured?.energized ?? parameters.initialPosition === 1;
  return (
    <>
      <Lead from={metadata.pins.a} to={[-35, 0]} />
      <Lead from={metadata.pins.b} to={[35, 0]} />
      <rect
        x={-35}
        y={-45}
        width={70}
        height={90}
        rx={5}
        fill={energized ? "currentColor" : "none"}
        fillOpacity={energized ? 0.15 : 1}
      />
      <path
        d={
          parameters.mode === 3
            ? "M -20 18 L -8 -4 H 8 L 20 -18"
            : "M -20 10 V -10 H 20 V 10"
        }
      />
    </>
  );
}
