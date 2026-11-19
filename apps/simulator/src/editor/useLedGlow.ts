import { useEffect, useState } from "react"

export const LED_GLOW_STORAGE_KEY = "circuit-editor.led-glow.v1"
export function parseLedGlow(value: string | null): number {
  // Preserve preferences from the original on/off toggle.
  if (value === "false") return 0
  if (value === null || value === "true" || value.trim() === "") return 1
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(0, Math.min(1, number)) : 1
}
export function readLedGlow(storage?: Pick<Storage, "getItem">): number {
  try {
    return parseLedGlow((storage ?? localStorage).getItem(LED_GLOW_STORAGE_KEY))
  } catch {
    return 1
  }
}
export function useLedGlow() {
  const [intensity, setIntensity] = useState(() => readLedGlow())
  useEffect(() => {
    try {
      localStorage.setItem(LED_GLOW_STORAGE_KEY, String(intensity))
    } catch {
      /* Keep the preference for this session if storage is unavailable. */
    }
  }, [intensity])
  useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.key === LED_GLOW_STORAGE_KEY || event.key === null)
        setIntensity(parseLedGlow(event.newValue))
    }
    window.addEventListener("storage", update)
    return () => window.removeEventListener("storage", update)
  }, [])
  return [intensity, setIntensity] as const
}
