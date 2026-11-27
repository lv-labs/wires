import { Lead } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "nmos";
export const metadata = {
  drawingScale: 0.5,
  prefix: "Q",
  name: "NMOS",
  pins: {
    gate: [-200, 0],
    source: [100, 200],
    drain: [100, -200],
  },
  parameters: {
    threshold: 1.5,
    beta: 0.02,
    bodyDiode: true,
    bodyTerminal: false,
    showBulk: true,
    digitalSymbol: false,
    showBodyDiode: true,
    swapTerminals: false,
  },
} as const;

export function Symbol({
  parameters = metadata.parameters,
}: SymbolProps) {
  const { gate, source, drain } = metadata.pins;
  const bodyPin = [
    (source[0] + drain[0]) / 2,
    (source[1] + drain[1]) / 2,
  ] as const;
  const showBulk = parameters.showBulk !== false && !parameters.digitalSymbol;
  const hasBodyPin =
    parameters.bodyDiode === true && parameters.bodyTerminal === true;
  const showBodyDiode =
    parameters.bodyDiode === true && parameters.showBodyDiode === true;

  return (
    <>
      <g transform={parameters.swapTerminals ? "scale(1 -1)" : undefined}>
        <circle cx={65} r={110} strokeWidth={10} />
        <Lead from={gate} to={[10, 0]} />
        <Lead from={drain} to={[100, -70]} />
        <Lead from={source} to={[100, 70]} />
        <path d="M 10 -75 V 75" strokeWidth={10} />
        {showBulk ? (
          <path
            d="M 30 -90
              V -50
              M 30 -20
              V 20
              M 30 50
              V 90"
            strokeWidth={10}
          />
        ) : (
          <path d="M 30 -90 V 90" strokeWidth={10} />
        )}
        <path
          d="M 30 -70
            H 100
            M 30 70
            H 100"
        />
        {showBulk && (
          <>
            {hasBodyPin ? (
              <Lead from={bodyPin} to={[30, 0]} />
            ) : (
              <path
                d="M 30 0
                  H 100
                  V 70"
              />
            )}
            <polygon points="40,0 80,-15 80,15" fill="currentColor" />
            {(showBodyDiode || !hasBodyPin) && (
              <circle cx={100} cy={70} r={10} fill="currentColor" />
            )}
            {showBodyDiode && (
              <>
                <circle cx={100} cy={-70} r={10} fill="currentColor" />
                {hasBodyPin ? (
                  <>
                    <path
                      d="M 100 -70
                        V 70
                        M 90 45
                        H 110
                        M 90 -45
                        H 110"
                    />
                    <polygon
                      points="90,25 100,45 110,25"
                      fill="currentColor"
                    />
                    <polygon
                      points="90,-25 100,-45 110,-25"
                      fill="currentColor"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M 100 -70
                        H 130
                        V 70
                        H 100
                        M 115 -15
                        H 145"
                    />
                    <polygon
                      points="115,10 130,-15 145,10"
                      fill="currentColor"
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </g>

    </>
  );
}
