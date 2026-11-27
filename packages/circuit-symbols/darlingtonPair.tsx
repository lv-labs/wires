import { Lead } from "./svg";
import type { Pin } from "./svg";

export function DarlingtonPair({
  pins,
  pnp,
}: {
  pins: Record<string, Pin>;
  pnp?: boolean;
}) {
  const side = pnp ? -1 : 1;
  return (
    <>
      <Lead from={pins.base} to={[-54, 0]} />
      <path d="M -54 -32 V 32 M -10 -35 V 35" />
      <path
        d={`M -54 ${-18 * side} L 10 ${-50 * side} H 100 M -10 ${-20 * side} L 24 ${-50 * side}
        M -54 ${18 * side} L -10 ${19 * side} M -10 ${20 * side} L 65 ${50 * side} H 100`}
      />
      <path
        d={pnp ? "M 40 -40 L 24 -34 L 32 -50 Z" : "M 42 31 L 61 48 L 37 44 Z"}
        fill="currentColor"
      />
    </>
  );
}
