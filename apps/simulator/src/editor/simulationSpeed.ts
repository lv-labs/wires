// The bundled Falstad startup circuit and New Blank Circuit both load at 172.
export const defaultSimulationSpeed = 172
export const maxSimulationSpeed = 259

export function snapSimulationSpeed(value: number) {
  return Math.abs(value - defaultSimulationSpeed) <= 6
    ? defaultSimulationSpeed
    : value
}

export function simulationPacing(speed: number) {
  const intervalMs = 16
  // Falstad targets 160 * getIterCount() solver steps per second.
  const stepsPerSecond = speed === 0 ? 0 : 16 * Math.exp((speed - 61) / 24)
  const steps = (stepsPerSecond * intervalMs) / 1000
  return {
    batchSteps: speed === 0 ? 0 : Math.max(1, Math.round(steps)),
    intervalMs: steps > 0 && steps < 1 ? 1000 / stepsPerSecond : intervalMs,
  }
}
