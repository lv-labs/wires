import { lazy, Suspense } from "react"
import { CircuitEditor } from "@/editor/CircuitEditor"

const SymbolWorkbench = import.meta.env.DEV
  ? lazy(() => import("./symbol-workbench/App"))
  : null

export function App() {
  if (
    SymbolWorkbench &&
    /^\/symbols(?:\/|\.html)?$/.test(window.location.pathname)
  ) {
    return (
      <Suspense
        fallback={
          <div className="p-6 text-sm text-muted-foreground">
            Loading symbol workbench…
          </div>
        }
      >
        <SymbolWorkbench />
      </Suspense>
    )
  }
  return (
    <div className="flex h-full flex-col">
      <CircuitEditor />
    </div>
  )
}

export default App
