import type { Component } from "./core"

export const componentSliders = {
  variableVoltage: {
    field: "voltage",
    defaultLabel: "Voltage",
    historyLabel: "Adjust variable voltage",
  },
  potentiometer: {
    field: "position",
    defaultLabel: "Potentiometer",
    historyLabel: "Adjust potentiometer wiper",
  },
  photoresistor: {
    field: "position",
    defaultLabel: "Light Brightness",
    historyLabel: "Adjust light brightness",
  },
  thermistor: {
    field: "position",
    defaultLabel: "Temperature",
    historyLabel: "Adjust temperature",
  },
} as const

export type SliderKind = keyof typeof componentSliders

export function hasSlider<T extends { kind: string }>(
  component: T
): component is T & { kind: SliderKind } {
  return Object.hasOwn(componentSliders, component.kind)
}

export type SliderAdjustment = {
  kind: string
  field?: string
  id: string
  value: number
}

export function sliderField(adjustment: SliderAdjustment): string {
  if (adjustment.field) return adjustment.field
  if (hasSlider(adjustment)) return componentSliders[adjustment.kind].field
  throw new Error("Missing slider property")
}

export function setProperty(
  parameters: Component["parameters"],
  path: string,
  value: number
) {
  const keys = path.split(".")
  let target = parameters
  for (const key of keys.slice(0, -1))
    target = target[key] as Component["parameters"]
  target[keys[keys.length - 1]] = value
}

// Keep both pot track sections resistive; exact endpoints create ideal shorts.
export const potPositionRange = { min: 0.001, max: 0.999 } as const

export function clampSliderValue(kind: string, field: string, value: number) {
  if (["photoresistor", "thermistor"].includes(kind) && field === "position")
    return Math.max(0, Math.min(1, value))
  return kind === "potentiometer" && field === "position"
    ? Math.max(potPositionRange.min, Math.min(potPositionRange.max, value))
    : value
}

// Slider position always increases left→right, even for descending voltage ranges.
export function sliderPosition(
  value: number,
  left: number,
  right: number,
  logarithmic = false
) {
  if (logarithmic && left > 0 && right > left)
    return (
      (Math.log(Math.max(left, value)) - Math.log(left)) /
      (Math.log(right) - Math.log(left))
    )
  const position = (value - left) / (right - left)
  return position === 0 ? 0 : position
}
export function sliderVoltage(
  position: number,
  left: number,
  right: number,
  logarithmic = false
) {
  if (logarithmic && left > 0 && right > left) {
    if (position <= 0) return left
    if (position >= 1) return right
    return Math.exp(
      Math.log(left) + position * (Math.log(right) - Math.log(left))
    )
  }
  return left + position * (right - left)
}

export function logarithmicSliderValue(
  position: number,
  min: number,
  max: number,
  step: number
) {
  if (position <= 0) return min
  if (position >= 1) return max
  const value = sliderVoltage(position, min, max, true)
  return Math.max(
    min,
    Math.min(max, min + Math.round((value - min) / step) * step)
  )
}
