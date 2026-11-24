import { useLayoutEffect, useRef, useState } from "react";
import { Lead, UprightText } from "../svg";
import type { SymbolProps } from "../svg";

export const kind = "labeledNode";
export const metadata = {
  // Original 16-unit artwork, scaled to the 50-unit sheet grid.
  drawingScale: 3.125,
  prefix: "NET",
  name: "Labeled node",
  pins: {
    in: [-48, 0],
  },
  parameters: {
    name: "NET",
    boxStyle: "none",
  },
} as const;

export const output = {
  type: "207",
  fields: {
    name: {
      label: "Net name",
      type: "string",
      maxLength: 80,
    },
    boxStyle: {
      label: "Box style",
      type: "string",
      maxLength: 6,
      choices: ["solid", "dashed", "none"],
      optional: true,
    },
  },
  sign: null,
};

export function Symbol({
  parameters = metadata.parameters,
  pose,
}: SymbolProps) {
  const label = String(parameters.name ?? metadata.parameters.name);
  const boxStyle = parameters.boxStyle ?? metadata.parameters.boxStyle;
  const text = useRef<SVGTextElement>(null);
  const [size, setSize] = useState({
    width: Array.from(label).length * 10 + 12,
    height: 24,
  });
  useLayoutEffect(() => {
    const box = text.current?.getBBox();
    if (box && box.height > 0) {
      setSize({ width: box.width + 12, height: box.height + 8 });
    }
  }, [label]);

  // The box stays upright with the text. Keep its near edge at the end of the lead.
  const edge = -24;
  const quarterTurn = (pose?.rotation ?? 0) % 180 !== 0;
  const width = quarterTurn ? size.height : size.width;
  const height = quarterTurn ? size.width : size.height;
  return (
    <>
      <Lead from={metadata.pins.in} to={[edge, 0]} />
      {boxStyle !== "none" && (
        <rect
          x={edge}
          y={-height / 2}
          width={width}
          height={height}
          strokeDasharray={boxStyle === "dashed" ? "5 4" : undefined}
        />
      )}
      <UprightText
        ref={text}
        pose={pose}
        x={edge + width / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, sans-serif"
        fontSize={10}
      >
        {label}
      </UprightText>
    </>
  );
}
