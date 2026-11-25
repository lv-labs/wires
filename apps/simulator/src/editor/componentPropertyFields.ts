import { core } from "./core"
import type { Component } from "./core"

export function spdtPositionLabels(
  parameters: Component["parameters"]
): string[] {
  const requested = Number(parameters.throwCount ?? 2)
  const count =
    Number.isInteger(requested) && requested >= 2 && requested <= 10
      ? requested
      : 2
  return [
    ...Array.from({ length: count }, (_, i) => String.fromCharCode(65 + i)),
    ...(parameters.centerOff && count === 2 ? ["Off"] : []),
  ]
}

export function normaliseSpdtSettings(
  parameters: Component["parameters"]
): Component["parameters"] {
  const count = Number(parameters.throwCount ?? 2)
  if (!Number.isInteger(count) || count < 2 || count > 10)
    throw new Error("Number of throws must be a whole number from 2 to 10.")
  const position = Number(parameters.position ?? 0)
  return {
    ...parameters,
    throwCount: count,
    position:
      Number.isInteger(position) &&
      position >= 0 &&
      position < spdtPositionLabels(parameters).length
        ? position
        : 0,
    // The original Switch2Elm clears momentary operation for more than 2 throws.
    momentary: count === 2 && parameters.momentary === true,
  }
}

const propertyOrders: Record<string, string[]> = {
  voltmeter: ["mode", "scale", "showVoltage", "circleSymbol", "resistance"],
  ammeter: ["mode", "scale", "circleSymbol"],
  capacitor: ["capacitance", "integration", "initialVoltage"],
  polarizedCapacitor: [
    "maxReverseVoltage",
    "capacitance",
    "integration",
    "initialVoltage",
  ],
  inductor: ["inductance", "integration", "initialCurrent"],
  transformer: ["inductance", "ratio", "coupling", "integration"],
  tappedTransformer: ["inductance", "ratio", "coupling", "integration"],
  threePhaseMotor: [
    "statorInductance",
    "rotorInductance",
    "mutualInductance",
    "statorResistance",
    "rotorResistance",
    "friction",
    "inertia",
  ],
  fuse: ["i2t", "resistance", "iecSymbol"],
}

export function propertyOrder(kind: string, key: string): number {
  const index = propertyOrders[kind]?.indexOf(key) ?? -1
  return index < 0 ? Number.MAX_SAFE_INTEGER : index
}

// Presentation conversions follow the bundled Java getEditInfo/setEditValue
// methods. Documents and the solver continue to use their existing SI values.
export function propertyNumber(
  component: Component,
  key: string,
  value: number,
  saving = false
): number {
  if (component.kind === "threePhaseMotor" && key === "mutualInductance") {
    const scale = Math.sqrt(
      Number(component.parameters.statorInductance) *
        Number(component.parameters.rotorInductance)
    )
    return saving ? value * scale : value / scale
  }
  if (
    ["transformer", "tappedTransformer"].includes(component.kind) &&
    key === "ratio"
  )
    return 1 / value
  let scale = 1
  if (component.kind === "memristor") {
    if (["initialDopedWidth", "totalWidth"].includes(key)) scale = 1e9
    if (key === "mobility") scale = 1e12
  }
  if (["pmos", "pjfet"].includes(component.kind) && key === "threshold")
    scale = -1
  return saving ? value / scale : value * scale
}

export function propertyCaption(
  component: Component,
  key: string
): string | undefined {
  if (core.catalog.counterKind(component.kind) && key === "bits")
    return component.kind === "counter" ? "Bits · 3 to 30" : "Bits · 2 to 30"
  if (component.kind === "ringCounter" && key === "initialValue")
    return "Initial outputs · bit mask (Q0 = 1)"
  if (key === "mode") {
    if (
      ["voltmeter", "testPoint", "ammeter", "wattmeter"].includes(
        component.kind
      )
    )
      return "Value"
    if (component.kind === "decimalDisplay") return "Base"
  }
  if (component.kind === "stopTrigger" && key === "direction")
    return "Trigger type"
  if (["transformer", "tappedTransformer"].includes(component.kind)) {
    if (key === "ratio") return "Turns ratio · primary / secondary (N1/N2)"
    if (key === "inductance") return "Primary inductance · H"
  }
  if (component.kind === "customTransformer" && key === "inductance")
    return "Base inductance · H"
  if (component.kind === "threePhaseMotor") {
    if (key === "mutualInductance")
      return "Coupling coefficient · greater than 0, less than 1"
    if (key === "friction") return "Friction coefficient · N·m·s/rad"
    if (key === "inertia") return "Moment of inertia · kg·m²"
  }
  if (component.kind === "memristor")
    return (
      {
        onResistance: "Minimum resistance · Ω",
        offResistance: "Maximum resistance · Ω",
        initialDopedWidth: "Width of doped region · nm",
        totalWidth: "Total width · nm",
        mobility: "Mobility · µm²/(V·s)",
      } as Record<string, string>
    )[key]
  if (["analogSwitch", "analogSpdtSwitch"].includes(component.kind)) {
    if (key === "inverted") return "Normally closed"
    if (key === "pulldown") return "Pulldown resistor"
  }
  if (component.kind === "logicOutput" && key === "pulldown")
    return "Current required"
  if (key === "swapTerminals")
    return ["npn", "pnp"].includes(component.kind)
      ? "Swap emitter/collector"
      : "Swap drain/source"
  if (key === "beta" && ["npn", "pnp"].includes(component.kind))
    return "Beta / hFE"
}

export function propertyChoices(
  component: Component,
  key: string
): string[] | undefined {
  if (key === "scale" && ["voltmeter", "ammeter"].includes(component.kind)) {
    const unit = component.kind === "ammeter" ? "A" : "V"
    return ["Auto", unit, `m${unit}`, `µ${unit}`]
  }
  if (key === "mode") {
    if (["voltmeter", "testPoint"].includes(component.kind))
      return [
        "Voltage",
        "RMS voltage",
        "Max voltage",
        "Min voltage",
        "Peak-to-peak voltage",
        "Binary value",
      ]
    if (component.kind === "ammeter") return ["Current", "RMS current"]
    if (component.kind === "wattmeter") return ["Instantaneous", "Average"]
    if (component.kind === "decimalDisplay")
      return ["Decimal", "Hexadecimal", "Octal"]
  }
  if (component.kind === "sevenSegment") {
    if (key === "segments") return ["7 segments", "14 segments", "16 segments"]
    if (key === "extra") return ["None", "Decimal point", "Colon"]
    if (key === "diodeDirection") return ["Logic inputs", "Common cathode", "Common anode"]
  }
  if (component.kind === "stopTrigger" && key === "direction") return ["≥", "≤"]
}

export function mosfetPropertyVisible(
  key: string,
  options: Record<string, unknown>
): boolean {
  if (key === "digitalSymbol") return !options.showBulk
  if (key === "bodyDiode")
    return Boolean(options.showBulk) && !options.digitalSymbol
  if (["bodyTerminal", "showBodyDiode"].includes(key))
    return Boolean(
      options.showBulk && !options.digitalSymbol && options.bodyDiode
    )
  return true
}
