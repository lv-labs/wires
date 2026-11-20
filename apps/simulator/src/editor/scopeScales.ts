export const timeDivisions = [
  1e-5, 2e-5, 5e-5, 1e-4, 2e-4, 5e-4, 0.001, 0.002, 0.005, 0.01, 0.02,
]

export const valueDivisions = [
  1e-6, 2e-6, 5e-6, 1e-5, 2e-5, 5e-5, 1e-4, 2e-4, 5e-4, 0.001, 0.002, 0.005,
  0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10,
]

export const minimumValueDivision = 1e-12
export const positionLimit = 8
const positionStep = 0.5
const positionPresets = Array.from(
  { length: (2 * positionLimit) / positionStep + 1 },
  (_, i) => i * positionStep - positionLimit
)

export function adjacentValueDivisions(scale: number) {
  // Auto-fit calculates the same values using exponents, which can differ
  // from the preset literals by a floating-point rounding error.
  return {
    smaller: valueDivisions.findLast((preset) => preset < scale * (1 - 1e-12)),
    larger: valueDivisions.find((preset) => preset > scale * (1 + 1e-12)),
  }
}

export function adjacentPositions(offset: number) {
  return {
    smaller: positionPresets.findLast((preset) => preset < offset),
    larger: positionPresets.find((preset) => preset > offset),
  }
}
