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
  ...props
}: Omit<SVGProps<SVGTextElement>, "x" | "y"> & {
  pose?: Pose;
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
        style={
          typeof fontSize === "number"
            ? {
                fontSize: `calc(${fontSize}px * var(--symbol-text-scale, 1))`,
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
  label,
  pose,
  parameters = {},
}: {
  pins: { a: Pin; b: Pin; out: Pin };
  label: string;
  pose?: Pose;
  parameters?: Record<string, unknown>;
}) {
  const count = Number(parameters.inputCount ?? 2);
  let offset = -Math.floor(count / 2);
  const inputs: Pin[] =
    count === 2
      ? [pins.a, pins.b]
      : Array.from({ length: count }, () => {
          if (offset === 0 && count % 2 === 0) offset++;
          return [-48, 16 * offset++];
        });
  const height = Math.max(28, ...inputs.map((pin) => Math.abs(pin[1]) + 12));
  return (
    <>
      {inputs.map((pin, index) => (
        <g key={index}>
          <Lead from={pin} to={[parameters.invertInputs ? -32 : -24, pin[1]]} />
          {parameters.invertInputs === true && (
            <circle cx={-28} cy={pin[1]} r={4} />
          )}
        </g>
      ))}
      <Lead from={pins.out} to={[24, 0]} />
      <rect x={-24} y={-height} width={48} height={height * 2} />
      {parameters.schmittInputs === true && (
        <path
          d="M -20 -8
            H -16
            V -16
            H -12
            M -20 -16
            H -18
            V -8
            H -12"
        />
      )}
      <UprightText pose={pose} y={4} textAnchor="middle" fontSize={11}>
        {label}
      </UprightText>
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

export function Chip({
  pins,
  labels = {},
  pose,
}: {
  pins: Record<string, Pin>;
  labels?: Record<string, string>;
  pose?: Pose;
}) {
  const halfHeight =
    Math.max(...Object.values(pins).map(([, y]) => Math.abs(y))) + 16;
  return (
    <>
      <rect x={-24} y={-halfHeight} width={48} height={halfHeight * 2} />
      {Object.entries(pins).map(([name, pin]) => {
        const left = pin[0] < 0;
        return (
          <g key={name}>
            <Lead from={pin} to={[left ? -24 : 24, pin[1]]} />
            <UprightText
              pose={pose}
              x={left ? -20 : 20}
              y={pin[1] + 4}
              textAnchor={left ? "start" : "end"}
              fontSize={10}
            >
              {labels[name] ?? name}
            </UprightText>
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
