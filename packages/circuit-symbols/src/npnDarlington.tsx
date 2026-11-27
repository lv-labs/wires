import { DarlingtonPair } from "../darlingtonPair";

export const kind = "npnDarlington";
export const metadata = {
  name: "Darlington pair (NPN)",
  prefix: "Q",
  pins: {
    base: [-100, 0],
    collector: [100, -50],
    emitter: [100, 50],
  },
  parameters: {
    beta1: 100,
    beta2: 100,
  },
} as const;
export const output = {
  type: "400",
  fields: {
    beta1: {
      label: "First transistor gain (β)",
      type: "number",
      exclusiveMin: 0,
    },
    beta2: {
      label: "Second transistor gain (β)",
      type: "number",
      exclusiveMin: 0,
    },
  },
  sign: null,
};

export function Symbol() {
  return <DarlingtonPair pins={metadata.pins} pnp={false} />;
}
