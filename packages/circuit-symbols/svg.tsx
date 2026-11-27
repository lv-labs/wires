import type { ReactNode, SVGProps } from "react";

export type Pin = readonly [number, number];
export type Pose = { rotation: number; mirror: boolean };
export type Measurement = number | string | boolean | null | number[];
export type SymbolProps = {
  pinPositions?: Record<string, Pin>;
  parameters?: Record<string, unknown>;
  pose?: Pose;
  current?: number;
  reading?: string;
  running?: boolean;
  highlighted?: boolean;
  glow?: boolean | number;
  measured?: Record<string, Measurement>;
  graphicSize?: { width: number; height: number };
};

export function Lead({ from, to }: { from: Pin; to: Pin }) {
  return (
    <path
      d={`
        M ${from[0]} ${from[1]}
        L ${to[0]} ${to[1]}
      `}
    />
  );
}

export function Upright({
  pose,
  x = 0,
  y = 0,
  children,
}: {
  pose?: Pose;
  x?: number;
  y?: number;
  children: ReactNode;
}) {
  if (!pose || (!pose.rotation && !pose.mirror)) return <>{children}</>;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${pose.mirror ? -1 : 1} 1) rotate(${-pose.rotation}) translate(${-x} ${-y})`}
    >
      {children}
    </g>
  );
}

export function UprightText({
  pose,
  x = 0,
  y = 0,
  fontSize,
  style,
  overline = false,
  ...props
}: Omit<SVGProps<SVGTextElement>, "x" | "y"> & {
  pose?: Pose;
  overline?: boolean;
  x?: number;
  y?: number;
}) {
  return (
    <Upright pose={pose} x={x} y={y}>
      <text
        x={x}
        y={y}
        stroke="none"
        fill="currentColor"
        fontSize={fontSize}
        textDecoration={overline ? "overline" : undefined}
        style={
          typeof fontSize === "number" || overline
            ? {
                fontSize:
                  typeof fontSize === "number"
                    ? `calc(${fontSize}px * var(--symbol-text-scale, 1))`
                    : undefined,
                textDecorationThickness: overline ? "0.1em" : undefined,
                ...style,
              }
            : style
        }
        {...props}
      />
    </Upright>
  );
}

export function Meter({
  pins,
  letter,
  pose,
  circle = true,
}: {
  pins: { a: Pin; b: Pin };
  letter: string;
  pose?: Pose;
  circle?: boolean;
}) {
  if (!circle)
    return letter === "A" ? (
      <>
        <Lead from={pins.a} to={pins.b} />
        <path
          d="M -12 -10
            L 12 0, -12 10
            Z"
          fill="currentColor"
          stroke="none"
        />
      </>
    ) : (
      <>
        <Lead from={pins.a} to={[-25, 0]} />
        <Lead from={pins.b} to={[25, 0]} />
      </>
    );
  return (
    <>
      <Lead from={pins.a} to={[-50, 0]} />
      <Lead from={pins.b} to={[50, 0]} />
      <circle r={50} />
      <UprightText pose={pose} dy="0.35em" textAnchor="middle" fontSize={64}>
        {letter}
      </UprightText>
    </>
  );
}

export function Gate({
  pins,
  shape,
  invertedOutput = false,
  parameters = {},
}: {
  pins: Record<string, Pin>;
  shape: "and" | "or" | "xor";
  invertedOutput?: boolean;
  parameters?: Record<string, unknown>;
}) {
  const { out, ...inputs } = pins;
  const inputPins = Object.entries(inputs);
  const halfHeight = Math.max(
    100,
    ...inputPins.map(([, [, y]]) => Math.abs(y) + 50),
  );
  const curvedInput = shape !== "and";
  const extraCurveOffset = shape === "xor" ? 15 : 0;
  const bubbleRadius = 15;

  return (
    <>
      {inputPins.map(([id, pin]) => {
        const y = pin[1];
        // Match the quadratic input curve at this lead's height.
        const edge = curvedInput ? -65 - 35 * (y / halfHeight) ** 2 : -100;
        const contact = edge - extraCurveOffset;
        const inverted = parameters.invertInputs === true;
        return (
          <g key={id}>
            <Lead
              from={pin}
              to={[contact - (inverted ? 2 * bubbleRadius : 0), y]}
            />
            {inverted && (
              <circle cx={contact - bubbleRadius} cy={y} r={bubbleRadius} />
            )}
          </g>
        );
      })}
      <Lead from={out} to={[invertedOutput ? 130 : 100, 0]} />
      {curvedInput ? (
        <path
          d={`M -100 ${-halfHeight}
            C 0 ${-halfHeight} 60 ${-halfHeight * 0.5} 100 0
            C 60 ${halfHeight * 0.5} 0 ${halfHeight} -100 ${halfHeight}
            Q -30 0 -100 ${-halfHeight} Z`}
        />
      ) : (
        <path
          d={`M -100 ${-halfHeight} H 0
            A 100 ${halfHeight} 0 0 1 0 ${halfHeight}
            H -100 Z`}
        />
      )}
      {shape === "xor" && (
        <path d={`M -115 ${-halfHeight} Q -45 0 -115 ${halfHeight}`} />
      )}
      {invertedOutput && <circle cx={115} cy={0} r={bubbleRadius} />}
      {parameters.schmittInputs === true && (
        <path d="M -45 20 H -10 V -20 H 25 M -30 20 V -20 H 5" strokeWidth={5} />
      )}
    </>
  );
}

export function Display({
  pins,
  value,
  pose,
}: {
  pins: Record<string, Pin>;
  value: string;
  pose?: Pose;
}) {
  const text = value.length > 8 ? value.slice(0, 8) + "…" : value;
  const halfHeight = Math.max(
    75,
    ...Object.values(pins).map(([, y]) => Math.abs(y) + 50),
  );
  return (
    <>
      <rect x={-75} y={-halfHeight} width={225} height={2 * halfHeight} rx={12} />
      <UprightText
        pose={pose}
        x={50}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.min(36, 190 / Math.max(1, text.length))}
      >
        {text}
      </UprightText>
      {Object.entries(pins).map(([name, pin], index) => (
        <g key={name}>
          <Lead from={pin} to={[-75, pin[1]]} />
          <UprightText
            pose={pose}
            x={-60}
            y={pin[1]}
            dominantBaseline="central"
            fontSize={25}
          >
            {index}
          </UprightText>
        </g>
      ))}
    </>
  );
}

export function ClockTriangle({
  at: [x, y],
  direction = 1,
}: {
  at: Pin;
  direction?: 1 | -1;
}) {
  return <path d={`M ${x} ${y - 16} L ${x + direction * 24} ${y} L ${x} ${y + 16}`} />;
}

export function Chip({
  pins,
  labels = {},
  overlined = [],
  bubbles = [],
  clocks = [],
  pose,
}: {
  pins: Record<string, Pin>;
  labels?: Record<string, string>;
  overlined?: readonly string[];
  bubbles?: readonly string[];
  clocks?: readonly string[];
  pose?: Pose;
}) {
  const halfHeight =
    Math.max(...Object.values(pins).map(([, y]) => Math.abs(y))) + 75;
  return (
    <>
      <rect x={-125} y={-halfHeight} width={250} height={halfHeight * 2} rx={12} />
      {Object.entries(pins).map(([name, pin]) => {
        const left = pin[0] < 0;
        const direction = left ? -1 : 1;
        const edge = direction * 125;
        const bubble = bubbles.includes(name);
        const radius = 8;
        return (
          <g key={name}>
            <Lead from={pin} to={[edge + (bubble ? direction * 2 * radius : 0), pin[1]]} />
            {bubble && <circle cx={edge + direction * radius} cy={pin[1]} r={radius} />}
            {clocks.includes(name) ? (
              <ClockTriangle at={[edge, pin[1]]} direction={left ? 1 : -1} />
            ) : (
              <UprightText
                pose={pose}
                x={left ? -110 : 110}
                y={pin[1]}
                dominantBaseline="central"
                textAnchor={left ? "start" : "end"}
                fontSize={32}
                overline={overlined.includes(name)}
              >
                {labels[name] ?? name}
              </UprightText>
            )}
          </g>
        );
      })}
    </>
  );
}

export function Motor({
  pins,
  letter,
  angle,
  pose,
}: {
  pins: Record<string, Pin>;
  letter: string;
  angle: number;
  pose?: Pose;
}) {
  return (
    <>
      {Object.entries(pins).map(([name, pin]) => {
        const left = pin[0] < 0;
        return (
          <g key={name}>
            <Lead from={pin} to={[left ? -24 : 24, pin[1] / 2]} />
            <UprightText
              pose={pose}
              x={left ? -44 : 44}
              y={pin[1] - 5}
              textAnchor={left ? "start" : "end"}
              fontSize={8}
            >
              {name}
            </UprightText>
          </g>
        );
      })}
      <circle r={24} />
      <path
        d={`
          M 0 0
          L ${Math.cos(angle) * 17} ${Math.sin(angle) * 17}
        `}
      />
      <UprightText pose={pose} y={5} textAnchor="middle" fontSize={10}>
        {letter}
      </UprightText>
    </>
  );
}

export function SwitchPole({
  common,
  a,
  b,
  y,
  position,
}: {
  common: Pin;
  a: Pin;
  b: Pin;
  y: number;
  position: number;
}) {
  const aY = y + (a[1] > b[1] ? 16 : -16);
  const bY = 2 * y - aY;
  const bladeY = position === 0 ? aY : position === 1 ? bY : y;
  return (
    <>
      <Lead from={common} to={[-20, y]} />
      <Lead from={a} to={[20, aY]} />
      <Lead from={b} to={[20, bY]} />
      <circle cx={20} cy={aY} r={2} />
      <circle cx={20} cy={bY} r={2} />
      <path
        d={`
          M -20 ${y}
          L 18 ${bladeY}
        `}
      />
    </>
  );
}
