import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "nmos";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "Q",
  name: "NMOS",
  pins: {
    gate: [-48, 0],
    source: [48, 16],
    drain: [48, -16],
  },
  parameters: {
    threshold: 1.5,
    beta: 0.02,
    bodyDiode: true,
    bodyTerminal: false,
    showBulk: true,
    digitalSymbol: false,
    showBodyDiode: false,
    swapTerminals: false,
  },
} as const;

export function Symbol({
  pose,
  parameters = metadata.parameters,
}: SymbolProps) {
  return (
    <>
      <g transform={parameters.swapTerminals ? "scale(1 -1)" : undefined}>
        <Lead from={metadata.pins.gate} to={[-16, 0]} />
        <Lead from={metadata.pins.drain} to={[-8, -16]} />
        <Lead from={metadata.pins.source} to={[-8, 16]} />
        <path
          d="M -16 -20
            V 20
            M -8 -20
            V 20"
        />
        {parameters.digitalSymbol === true && <circle cx={-20} cy={0} r={3} />}
        {parameters.showBulk !== false && !parameters.digitalSymbol && (
          <>
            <path
              d="M 0 -16
                V 16
                M 0 0
                H 10"
            />
            {parameters.bodyDiode === true &&
            parameters.bodyTerminal === true ? (
              <Lead from={[48, 0]} to={[10, 0]} />
            ) : (
              <path
                d="M 10 0
                  V 16
                  H 32"
              />
            )}
            {parameters.bodyDiode === true &&
              parameters.showBodyDiode === true && (
                <path
                  d="M 28 -12
                    V 12
                    M 24 -4
                    L 28 4
                    L 32 -4
                    Z
                    M 24 4
                    H 32"
                />
              )}
          </>
        )}
      </g>
      <UprightText pose={pose} y={5} fontSize={9}>
        NMOS
      </UprightText>
    </>
  );
}
