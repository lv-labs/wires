import { core } from "./core"
import type { Component } from "./core"
import { spdtPositionLabels } from "./componentPropertyFields"

export function format(value: number, unit = "") {
  if (!Number.isFinite(value)) return "—"
  if (Math.abs(value) < 1e-15) value = 0
  const scale = [
    [1e9, "G"],
    [1e6, "M"],
    [1e3, "k"],
    [1, ""],
    [1e-3, "m"],
    [1e-6, "µ"],
    [1e-9, "n"],
    [1e-12, "p"],
  ].find(([size]) => Math.abs(value) >= Number(size)) || [1, ""]
  return `${Number((value / Number(scale[0])).toPrecision(4))} ${scale[1]}${unit}`.trim()
}
function isSource(c: Component) {
  return c.kind === "voltageSource" || c.kind === "voltageRail"
}
function meterValue(value: number, unit: string, scale = 0) {
  if (!Number.isFinite(value)) return "—"
  if (![1, 2, 3].includes(scale) || Math.abs(value) > 1e12)
    return format(value, unit)
  const multiplier = [1, 1, 1e3, 1e6][scale]
  const prefix = ["", "", "m", "µ"][scale]
  // CircuitElm.getUnitTextWithScale uses up to three decimal places for
  // explicitly selected units; Auto retains the editor's SI-prefix formatter.
  return `${Number((value * multiplier).toFixed(3))} ${prefix}${unit}`
}
function logicLevel(p: Record<string, any>, voltage: number) {
  if (!Number.isFinite(voltage)) return "—"
  if (p.mode === "ternary")
    return voltage > p.threshold * 1.5
      ? "2"
      : voltage > p.threshold * 0.5
        ? "1"
        : "0"
  return p.mode === "numeric"
    ? voltage < p.threshold
      ? "0"
      : "1"
    : voltage < p.threshold
      ? "L"
      : "H"
}
function outputReading(c: Component, measured: Record<string, any>) {
  if (measured.text !== undefined) return String(measured.text)
  if (["dataExport", "audioOutput"].includes(c.kind))
    return `${measured.samples || 0} samples`
  if (c.kind === "stopTrigger") return measured.stopped ? "Stopped" : "Armed"
  if (["dcMotor", "threePhaseMotor"].includes(c.kind))
    return format(Number(measured.speed), "rad/s")
  if (c.kind === "lamp") return format(Number(measured.temperature), "K")
  if (c.kind === "variableVoltage")
    return format(Number((c.parameters as any).voltage), "V")
  if (
    ["voltmeter", "testPoint"].includes(c.kind) &&
    (c.parameters as any).mode === 5
  )
    return measured.value == null ? "—" : String(measured.value)
  const unit: Record<string, string> = {
    voltmeter: "V",
    testPoint: "V",
    ohmmeter: "Ω",
    ammeter: "A",
    wattmeter: "W",
  }
  return unit[c.kind]
    ? measured.value === null
      ? c.kind === "ohmmeter"
        ? `∞ ${unit[c.kind]}`
        : "—"
      : ["voltmeter", "ammeter"].includes(c.kind)
        ? meterValue(Number(measured.value), unit[c.kind], Number(c.parameters.scale ?? 0))
        : format(Number(measured.value), unit[c.kind])
    : ""
}
export function componentValue(
  c: Component,
  live?: {
    pinVoltages?: Record<string, number>
    measurement?: Record<string, any>
  }
) {
  const p = c.parameters as Record<string, any>
  if (c.kind === "ammeter")
    return `${outputReading(c, live?.measurement || {})}${p.mode === 1 ? " RMS" : ""}`
  if (["voltmeter", "ohmmeter", "wattmeter", "testPoint"].includes(c.kind)) {
    const mode = Number(p.mode || 0)
    const suffix =
      c.kind === "wattmeter"
        ? mode === 1
          ? " avg"
          : ""
        : ["voltmeter", "testPoint"].includes(c.kind)
          ? ["", " RMS", " max", " min", " pk–pk", ""][mode] || ""
          : ""
    return `${outputReading(c, live?.measurement || {})}${suffix}`
  }
  if (core.catalog.outputSpecs[c.kind])
    return c.kind === "variableVoltage"
      ? format(p.voltage, "V")
      : c.kind === "lamp"
        ? `${format(p.nominalPower, "W")} · ${format(p.nominalVoltage, "V")}`
        : c.kind === "labeledNode"
          ? p.name
          : core.catalog.graphic(c.kind)
            ? "Annotation"
            : core.catalog.definitions[c.kind].name
  if (c.kind === "pushSwitch")
    return p.normallyClosed ? "Normally closed" : "Normally open"
  if (c.kind === "mbbSwitch") return ["A", "A + B", "B", "A + B"][p.position]
  if (c.kind === "customTransformer")
    return `${p.turns1},${p.turns2}:${p.turns3} · ${format(p.inductance, "H")}`
  if (c.kind === "transmissionLine")
    return `${format(p.impedance, "Ω")} · ${format(p.delay, "s")}`
  if (c.kind === "resistor") return format(p.resistance, "Ω")
  if (c.kind === "transformer" || c.kind === "tappedTransformer")
    return `1:${p.ratio} · ${format(p.inductance, "H")}`
  if (c.kind === "spdtSwitch") return spdtPositionLabels(p)[p.position] ?? "—"
  if (c.kind === "dpdtSwitch") return p.position === 0 ? "A" : "B"
  if (["diode", "led", "zener"].includes(c.kind) && p.model) {
    const model = core.catalog.resolveDiodeModel(p.model)
    const name =
      typeof p.model === "string" ? p.model : (p.model as { name: string }).name
    return c.kind === "zener"
      ? `${format(model.breakdownVoltage, "V")} Zener · ${name}`
      : name
  }
  if (c.kind === "led") return format(p.forwardVoltage, "V")
  if (c.kind === "zener") return `${format(p.breakdownVoltage, "V")} Zener`
  if (c.kind === "inductor") return format(p.inductance, "H")
  if (c.kind === "currentSource") return format(p.current, "A")
  if (c.kind === "potentiometer")
    return `${format(p.resistance, "Ω")} · ${Number((p.position * 100).toPrecision(4))}%`
  if (["analogSwitch", "analogSpdtSwitch"].includes(c.kind))
    return `${format(p.onResistance, "Ω")} · ${format(p.threshold, "V")}${p.inverted ? " inverted" : ""}`
  if (["capacitor", "polarizedCapacitor"].includes(c.kind))
    return format(p.capacitance, "F")
  if (isSource(c))
    return p.waveform.kind !== "dc"
      ? `${format(p.waveform.amplitude, "V")} pk · ${format(p.waveform.frequency, "Hz")} · ${format(p.waveform.offset, "V")} offset`
      : format(p.waveform.voltage, "V")
  if (c.kind === "switch") return p.closed ? "Closed" : "Open"
  if (c.kind === "output")
    return p.showVoltage && Number.isFinite(live?.pinVoltages?.in)
      ? format(live!.pinVoltages!.in!, "V")
      : p.showVoltage
        ? "Shows voltage"
        : "Marker only"
  if (c.kind === "logicOutput")
    return `${Number.isFinite(live?.pinVoltages?.in) ? `${logicLevel(p, live!.pinVoltages!.in!)} · ${format(live!.pinVoltages!.in!, "V")}` : p.mode === "numeric" ? "Numeric" : p.mode === "ternary" ? "Ternary" : "Logic"} · ${format(p.threshold, "V")}`
  if (c.kind === "logicInput")
    return `${p.mode === "logic" ? (p.state === 0 ? "L" : "H") : p.state} · ${format(p.highVoltage, "V")} / ${format(p.lowVoltage, "V")}`
  if (["dFlipFlop", "jkFlipFlop", "tFlipFlop"].includes(c.kind))
    return `${format(p.highVoltage, "V")} · Q starts ${p.initialState ? "high" : "low"}${c.kind === "jkFlipFlop" && p.positiveEdge ? " · rising edge" : ""}`
  if (["counter", "latch", "halfAdder", "fullAdder"].includes(c.kind))
    return `${format(p.highVoltage, "V")}${["counter", "latch"].includes(c.kind) ? ` · starts ${p.initialValue}` : ""}${c.kind === "counter" && p.modulus ? ` · mod ${p.modulus}` : ""}`
  if (c.kind === "opamp")
    return `${format(p.minOutput, "V")} … ${format(p.maxOutput, "V")}`
  const reading = outputReading(c, live?.measurement || {})
  return reading
}

/** Sheet artwork carries only a primary value or a live reading. */
export function sheetValue(
  c: Component,
  live?: Parameters<typeof componentValue>[1]
) {
  const p = c.parameters as Record<string, any>
  if (
    [
      "ground",
      "opamp",
      "switch",
      "pushSwitch",
      "spdtSwitch",
      "dpdtSwitch",
      "mbbSwitch",
      "logicInput",
      "logicOutput",
      "diode",
      "led",
      "npn",
      "pnp",
      "nmos",
      "pmos",
      "njfet",
      "pjfet",
    ].includes(c.kind)
  )
    return ""
  if (c.kind === "output")
    return p.showVoltage ? format(Number(live?.pinVoltages?.in), "V") : ""
  if (c.kind === "potentiometer") return format(p.resistance, "Ω")
  if (c.kind === "voltageSource" || c.kind === "voltageRail") {
    const w = p.waveform
    return w.kind === "dc"
      ? format(w.voltage, "V")
      : `${format(w.amplitude, "V")} · ${format(w.frequency, "Hz")}`
  }
  if (["transformer", "tappedTransformer"].includes(c.kind))
    return `1:${p.ratio}`
  if (c.kind === "zener")
    return format(
      p.model
        ? core.catalog.resolveDiodeModel(p.model).breakdownVoltage
        : p.breakdownVoltage,
      "V"
    )
  if (
    core.catalog.outputSpecs[c.kind] &&
    ![
      "variableVoltage",
      "voltmeter",
      "ammeter",
      "ohmmeter",
      "wattmeter",
      "testPoint",
      "labeledNode",
    ].includes(c.kind)
  )
    return ""
  if (
    ![
      "resistor",
      "capacitor",
      "polarizedCapacitor",
      "inductor",
      "currentSource",
      "variableVoltage",
      "voltmeter",
      "ammeter",
      "ohmmeter",
      "wattmeter",
      "testPoint",
      "labeledNode",
    ].includes(c.kind)
  )
    return ""
  return componentValue(c, live)
}
