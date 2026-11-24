import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createServer } from "vite"

// Render the actual panel without its browser-only dialog portal. Capture the
// form so submissions exercise the same handler used by Apply in the app.
const server = await createServer({
  plugins: [
    {
      name: "property-dialog-test",
      enforce: "pre",
      transform(source, id) {
        if (id.endsWith("/editor/EditorDialog.tsx"))
          return `export function EditorDialog({children}) {
      globalThis.__propertyTestForm = children; return children;
    }`
      },
    },
  ],
  server: { middlewareMode: true, ws: false, watch: null },
  appType: "custom",
})
const BrowserFormData = globalThis.FormData
try {
  const { ComponentProperties } = await server.ssrLoadModule(
    "/src/editor/ComponentProperties.tsx"
  )
  const { core } = await server.ssrLoadModule("/src/editor/core.ts")
  const { propertyNumber } = await server.ssrLoadModule(
    "/src/editor/componentPropertyFields.ts"
  )
  globalThis.FormData = class extends BrowserFormData {
    constructor(values) {
      super()
      for (const [key, value] of Object.entries(values))
        if (value !== undefined) this.set(key, String(value))
    }
  }
  function panel(kind, parameters = {}) {
    const component = {
      id: "c",
      kind,
      modelVersion: 1,
      parameters: {
        ...structuredClone(core.catalog.definitions[kind].parameters),
        ...parameters,
      },
    }
    let saved
    const html = renderToStaticMarkup(
      React.createElement(ComponentProperties, {
        component,
        frame: null,
        actions: [],
        onClose() {},
        onApply(value) {
          validate(component, value)
          saved = value
        },
      })
    )
    const form = globalThis.__propertyTestForm
    function defaults(node, values = {}) {
      if (Array.isArray(node)) {
        for (const child of node) defaults(child, values)
        return values
      }
      if (!React.isValidElement(node)) return values
      const p = node.props
      if (p.name && !p.disabled) {
        if ("defaultChecked" in p || "checked" in p) {
          if (p.checked ?? p.defaultChecked) values[p.name] = "on"
        } else if (p.value !== undefined) values[p.name] = p.value
        else if (p.defaultValue !== undefined) values[p.name] = p.defaultValue
      }
      defaults(p.children, values)
      return values
    }
    return {
      component,
      html,
      apply(changes = {}) {
        saved = undefined
        form.props.onSubmit({
          preventDefault() {},
          currentTarget: { ...defaults(form), ...changes },
        })
        assert.ok(saved, `${kind}: Apply must succeed`)
        return saved
      },
    }
  }
  function validate(component, parameters) {
    const doc = core.document.empty()
    doc.electrical.components.push({ ...component, parameters })
    doc.layout.components.c = { x: 0, y: 0, rotation: 0, mirror: false }
    core.document.validate(doc)
  }
  const { PropertySliderDialog } = await server.ssrLoadModule(
    "/src/editor/PropertySliders.tsx"
  )
  for (const existing of [undefined, {
    id: "slider", componentId: "c", field: "resistance",
    label: "Resistance", min: 1, max: 2, step: 0.1,
  }]) {
    for (const logarithmic of [false, true]) {
    for (const [min, max, step, expected] of [
      ["10u", "10m", "10u", [1e-5, 0.01, 1e-5]],
      ["1k", "2M", "5k", [1000, 2000000, 5000]],
    ]) {
      let saved
      const html = renderToStaticMarkup(React.createElement(PropertySliderDialog, {
        component: panel("resistor").component,
        existing,
        onSave(value) { saved = value },
        onClose() {},
      }))
      assert.doesNotMatch(html, /type="number"/)
      globalThis.__propertyTestForm.props.onSubmit({
        preventDefault() {},
        currentTarget: { min, max, step, label: "Resistance", scale: logarithmic ? "logarithmic" : "linear" },
      })
      for (const [index, field] of ["min", "max", "step"].entries())
        assert.ok(Math.abs(saved[field] - expected[index]) <= expected[index] * 1e-12)
      assert.equal(saved.logarithmic, logarithmic)
      if (existing) assert.equal(saved.id, existing.id)
      const reopened = renderToStaticMarkup(React.createElement(PropertySliderDialog, {
        component: panel("resistor").component,
        existing: saved,
        onSave() {},
        onClose() {},
      }))
      assert.ok(reopened.includes(`value="${logarithmic ? "logarithmic" : "linear"}" selected=""`))
      for (const [field, text] of [["min", min], ["max", max], ["step", step]])
        assert.ok(reopened.includes(`name="${field}" value="${text}"`), reopened)

    }
  }

  }
  for (const min of ["0", "-1k"]) {
    let saved
    renderToStaticMarkup(React.createElement(PropertySliderDialog, {
      component: panel("resistor").component,
      onSave(value) { saved = value }, onClose() {},
    }))
    globalThis.__propertyTestForm.props.onSubmit({
      preventDefault() {}, currentTarget: { min, max: "1M", step: "1k", scale: "logarithmic" },
    })
    assert.equal(saved, undefined, "Nonpositive logarithmic ranges must be rejected")
  }
  const { sliderPosition, sliderVoltage, logarithmicSliderValue } = await server.ssrLoadModule("/src/editor/componentSliders.ts")
  assert.equal(sliderVoltage(0.5, 1000, 1000000), 500500)
  assert.ok(Math.abs(sliderVoltage(0.5, 1000, 1000000, true) - Math.sqrt(1e9)) < 1e-9)
  for (const position of [0, 0.1, 0.5, 0.9, 1]) {
    const value = sliderVoltage(position, 1e-5, 1e6, true)
    assert.ok(Math.abs(sliderPosition(value, 1e-5, 1e6, true) - position) < 1e-12)
  }
  assert.equal(logarithmicSliderValue(0, 1000, 1000000, 5000), 1000)
  assert.equal(logarithmicSliderValue(1, 1000, 1000000, 5000), 1000000)
  assert.equal(logarithmicSliderValue(0.5, 1000, 1000000, 5000), 31000)
  console.log("Slider checks passed: prefixes, linear/logarithmic creation and editing, positive limits, mapping and step snapping.")
  for (const kind of Object.keys(core.catalog.definitions)) {
    const p = panel(kind)
    assert.doesNotMatch(p.html, /Sheet label|labelPosition|labelShowValue/)
    const saved = p.apply()
    validate(p.component, saved)
    assert.deepEqual(
      saved,
      p.component.parameters,
      `${kind}: opening and applying preserves defaults`
    )
  }
  assert.equal(panel("logicInput").apply({ momentary: "on" }).momentary, true)
  const pot = panel("potentiometer")
  assert.match(pot.html, />Show values<\/label>/)
  assert.equal(pot.apply({ showValues: "on" }).showValues, true)
  assert.equal(panel("potentiometer", { showValues: true }).apply().showValues, true)
  assert.equal(panel("potentiometer", { showValues: true }).apply({ showValues: undefined }).showValues, false)
  assert.match(panel("labeledNode").html, /value="none" selected="">No box<\/option>/)
  const labeledNode = panel("labeledNode", { boxStyle: "dashed" })
  assert.match(labeledNode.html, /name="boxStyle"/)
  assert.match(labeledNode.html, /value="dashed" selected="">Dashed box<\/option>/)
  assert.match(labeledNode.html, />Solid box<\/option>/)
  assert.equal(labeledNode.apply({ boxStyle: "none" }).boxStyle, "none")
  assert.throws(
    () => validate(labeledNode.component, { name: "NET", boxStyle: "invalid" }),
    /Invalid Box style/
  )
  assert.equal(
    panel("transformer").apply({ reverseSecondary: "on" }).reverseSecondary,
    true
  )
  for (const kind of ["voltageSource", "voltageRail"]) {
    for (const wave of [
      "dc",
      "sine",
      "square",
      "triangle",
      "sawtooth",
      "pulse",
    ]) {
      for (const phase of [undefined, 0, 0.12345678912345678, -Math.PI / 7]) {
        const waveform =
          wave === "dc"
            ? { kind: wave, voltage: -3.3 }
            : {
                kind: wave,
                amplitude: 2.5,
                frequency: 1234.5,
                offset: -0.2,
                ...(["square", "pulse"].includes(wave)
                  ? { dutyCycle: 0.12345678912345678 }
                  : {}),
                ...(phase === undefined ? {} : { phase }),
              }
        const p = panel(kind, { waveform })
        assert.deepEqual(
          p.apply().waveform,
          waveform,
          "Unchanged waveform parameters keep exact values and optional fields"
        )
      }
    }
  }
  const { componentValue } = await server.ssrLoadModule(
    "/src/editor/componentValue.ts"
  )
  const {format} = await server.ssrLoadModule("/src/editor/componentValue.ts")
  for (const kind of ["voltmeter", "ammeter"]) {
    const unit = kind === "ammeter" ? "A" : "V"
    for (const [scale, label] of [[0,"Auto"],[1,unit],[2,`m${unit}`],[3,`µ${unit}`]]) {
      const p = panel(kind, {scale})
      assert.match(p.html, new RegExp(`<option[^>]*value="${scale}" selected="">${label}</option>`))
      assert.equal(p.apply({scale:String(scale)}).scale, scale)
    }
    assert.equal(panel(kind).apply({circleSymbol:undefined}).circleSymbol, false)
    assert.equal(panel(kind, {circleSymbol:false}).apply({circleSymbol:"on"}).circleSymbol, true)
    const reading = (scale,value,mode=0) => componentValue(panel(kind, {scale,mode}).component, {measurement:{value}})
    assert.equal(reading(1,0.00123456), `0.001 ${unit}`)
    assert.equal(reading(2,0.00123456), `1.235 m${unit}`)
    assert.equal(reading(3,-0.0000005), `-0.5 µ${unit}`)
    assert.equal(reading(2,0), `0 m${unit}`)
    assert.equal(reading(0,0.00123456), format(0.00123456,unit))
    assert.equal(reading(3,1e13), format(1e13,unit))
    assert.equal(reading(3,NaN), "—")
    assert.equal(reading(3,null), "—")
    assert.equal(reading(2,0.00123456,1), `1.235 m${unit} RMS`)
  }
  assert.equal(componentValue(panel("voltmeter", {scale:3,mode:5}).component, {measurement:{value:1}}), "1", "Binary mode ignores unit scaling")
  for (const [count, label] of [[2, "B"], [3, "C"], [10, "J"]]) {
    const p = panel("spdtSwitch", { throwCount: count, position: count - 1 })
    assert.match(
      p.html,
      new RegExp(
        `<option[^>]*value="${count - 1}" selected="">${label}</option>`
      )
    )
    assert.equal(
      componentValue(p.component),
      label
    )
    assert.equal(
      p.apply({ throwCount: "2" }).position,
      count === 2 ? 1 : 0,
      "Shrinking a switch resets a removed position"
    )
  }
  assert.equal(
    panel("spdtSwitch", { momentary: true }).apply({ throwCount: "3" })
      .momentary,
    false
  )
  assert.equal(panel("spdtSwitch", { momentary: true }).apply().momentary, true)
  assert.equal(
    componentValue(
      panel("spdtSwitch", { centerOff: true, position: 2 }).component
    ),
    "Off"
  )
  for (const invalid of ["1", "11", "3.5"])
    assert.throws(
      () => panel("spdtSwitch").apply({ throwCount: invalid }),
      /Apply must succeed/
    )
  for (const [kind, selected, label] of [
    ["voltmeter", 5, "Binary value"],
    ["testPoint", 4, "Peak-to-peak voltage"],
    ["ammeter", 1, "RMS current"],
    ["wattmeter", 1, "Average"],
    ["decimalDisplay", 2, "Octal"],
  ]) {
    const p = panel(kind, { mode: selected })
    assert.match(
      p.html,
      new RegExp(
        `<option[^>]*value="${selected}" selected="">${label}</option>`
      )
    )
    assert.equal(
      p.apply({ mode: "0" }).mode,
      0,
      "Numeric modes remain numbers when edited"
    )
  }
  assert.equal(
    panel("logicOutput").apply({ mode: "ternary" }).mode,
    "ternary",
    "Logic modes remain strings"
  )
  assert.equal(panel("stopTrigger").apply({ direction: "1" }).direction, 1)
  assert.match(panel("stopTrigger").html, /<select[^>]*name="direction"/)
  assert.match(panel("testPoint").html, /<input[^>]*name="label"/)
  assert.doesNotMatch(panel("testPoint").html, /<textarea/)
  assert.match(panel("text").html, /<textarea[^>]*name="text"/)
  assert.match(panel("instructionDisplay").html, /<textarea[^>]*name="lookup"/)
  for (const kind of ["transformer", "tappedTransformer"]) {
    const p = panel(kind, { ratio: 0.2 })
    assert.match(p.html, /name="ratio"[^>]*value="5"/)
    assert.equal(p.apply({ ratio: "10" }).ratio, 0.1)
  }
  const memristor = panel("memristor")
  assert.match(memristor.html, /name="totalWidth"[^>]*value="10"/)
  assert.match(memristor.html, /name="mobility"[^>]*value="100"/)
  const changed = memristor.apply({
    initialDopedWidth: "5",
    totalWidth: "20",
    mobility: "200",
  })
  assert.equal(changed.initialDopedWidth, 5e-9)
  assert.equal(changed.totalWidth, 2e-8)
  assert.equal(changed.mobility, 2e-10)
  validate(memristor.component, changed)
  for (const [kind, threshold, displayed] of [
    ["pmos", 1.5, -1.5],
    ["pjfet", -4, 4],
    ["nmos", 1.5, 1.5],
    ["njfet", -4, -4],
  ]) {
    const p = panel(kind, { threshold })
    assert.match(
      p.html,
      new RegExp(`name="threshold"[^>]*value="${displayed}"`)
    )
    assert.equal(
      p.apply({ threshold: String(displayed * 2) }).threshold,
      threshold * 2
    )
  }
  const bulk = panel("nmos", { bodyTerminal: true, showBodyDiode: true })
  assert.match(bulk.html, /name="bodyTerminal"/)
  assert.doesNotMatch(bulk.html, /name="digitalSymbol"/)
  const noDiode = panel("nmos", {
    bodyDiode: false,
    bodyTerminal: true,
    showBodyDiode: true,
  })
  assert.doesNotMatch(noDiode.html, /name="bodyTerminal"|name="showBodyDiode"/)
  assert.equal(
    noDiode.apply().bodyTerminal,
    true,
    "Hidden settings survive Apply"
  )
  const digital = panel("nmos", {
    showBulk: false,
    digitalSymbol: true,
    bodyTerminal: true,
  })
  assert.match(digital.html, /name="digitalSymbol"/)
  assert.doesNotMatch(
    digital.html,
    /name="bodyDiode"|name="bodyTerminal"|name="showBodyDiode"/
  )
  assert.equal(digital.apply().bodyTerminal, true)
  for (const kind of [
    "capacitor",
    "polarizedCapacitor",
    "inductor",
    "transformer",
    "tappedTransformer",
    "customTransformer",
  ]) {
    const p = panel(kind)
    assert.match(p.html, /Trapezoidal approximation/)
    assert.doesNotMatch(p.html, /<select[^>]*name="integration"/)
    assert.equal(p.apply({ integration: "on" }).integration, "trapezoidal")
    assert.equal(
      panel(kind, { integration: "trapezoidal" }).apply({
        integration: undefined,
      }).integration,
      "backwardEuler"
    )
  }
  const motor = panel("threePhaseMotor")
  assert.match(motor.html, /Coupling coefficient/)
  assert.doesNotMatch(motor.html, /Mutual inductance/)
  assert.ok(
    motor.html.indexOf('name="statorInductance"') <
      motor.html.indexOf('name="statorResistance"')
  )
  const motorEdit = motor.apply({
    statorInductance: "0.04",
    rotorInductance: "0.05",
    mutualInductance: "0.8",
  })
  assert.equal(motorEdit.mutualInductance, 0.8 * Math.sqrt(0.04 * 0.05))
  const retainedCoupling = panel("threePhaseMotor", {
    statorInductance: 0.04,
    rotorInductance: 0.05,
    mutualInductance: 0.02,
  })
  assert.equal(
    retainedCoupling.apply({ rotorInductance: "0.08" }).mutualInductance,
    (0.02 / Math.sqrt(0.04 * 0.05)) * Math.sqrt(0.04 * 0.08)
  )
  for (const invalid of ["0", "1", "-0.1"])
    assert.throws(
      () => panel("threePhaseMotor").apply({ mutualInductance: invalid }),
      /Apply must succeed/
    )
  for (const kind of ["photoresistor", "thermistor"]) {
    const p = panel(kind)
    assert.match(p.html, /<input[^>]*name="label"/)
    assert.equal(
      p.apply({ label: "Room sensor + west" }).label,
      "Room sensor + west"
    )
    assert.equal(p.apply({ label: "" }).label, "")
  }
  assert.equal(panel("fuse").apply({ iecSymbol: "on" }).iecSymbol, true)
  assert.equal(
    panel("fuse", { iecSymbol: true }).apply({ iecSymbol: undefined })
      .iecSymbol,
    false
  )

  const { ComponentSliderPanel } = await server.ssrLoadModule(
    "/src/editor/ComponentSliderPanel.tsx"
  )
  const sensorComponents = [
    {
      ...panel("thermistor").component,
      id: "temp",
      parameters: {
        ...core.catalog.definitions.thermistor.parameters,
        label: "Room temperature",
      },
    },
    {
      ...panel("photoresistor").component,
      id: "light",
      parameters: {
        ...core.catalog.definitions.photoresistor.parameters,
        label: "Window light",
      },
    },
  ]
  const sensorPanel = renderToStaticMarkup(
    React.createElement(ComponentSliderPanel, {
      propertySliders: [],
      allComponents: sensorComponents,
      components: sensorComponents,
      open: true,
      dismissible: true,
      focusOnOpen: false,
      documentId: "sensor-test",
      persistOrder: false,
      adjustment: null,
      onPropertyPreview() {},
      onEditPropertySlider() {},
      onRemovePropertySlider() {},
      onPreview() {},
      onCommit() {},
      onCancelAdjustment() {},
      onClose() {},
    })
  )
  assert.match(sensorPanel, /Room temperature/)
  assert.match(sensorPanel, /Window light/)
  assert.match(sensorPanel, /25 °C/)
  assert.match(sensorPanel, /3.4 klx/)
  // Conversion symmetry also covers non-default signed and fractional values.
  for (const [kind, key, value] of [
    ["transformer", "ratio", 0.3],
    ["memristor", "totalWidth", 7.4e-9],
    ["pmos", "threshold", -2],
  ])
    assert.ok(
      Math.abs(
        propertyNumber(
          { kind },
          key,
          propertyNumber({ kind }, key, value),
          true
        ) - value
      ) < 1e-14
    )
  console.log(
    `Property panels passed: ${Object.keys(core.catalog.definitions).length} default submissions, numeric/string choices, original units/ratios, signed FET thresholds, conditional MOSFET controls, dependent switch fields and unchanged waveform precision.`
  )
} finally {
  globalThis.FormData = BrowserFormData
  delete globalThis.__propertyTestForm
  await server.close()
}
