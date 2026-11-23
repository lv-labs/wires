import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { EditorDialog } from "./EditorDialog"
import { listEntries, removeEntry } from "./circuitWorkspace"
import type { CircuitEntry } from "./circuitWorkspace"
import type { CircuitDocument } from "./core"

export function RecoveryDialog({
  draftId,
  currentDocument,
  onRestore,
  onClose,
}: {
  draftId: string
  currentDocument: CircuitDocument
  onRestore: (document: CircuitDocument) => void
  onClose: () => void
}) {
  const [entries, setEntries] = useState<CircuitEntry[]>([])
  const [error, setError] = useState("")
  const [discarding, setDiscarding] = useState<string | null>(null)
  const refresh = useCallback(() => {
    try {
      setEntries(listEntries("draft"))
    } catch {
      setError("Recovery drafts are unavailable in this browser.")
    }
  }, [])
  useEffect(() => {
    refresh()
    window.addEventListener("storage", refresh)
    return () => window.removeEventListener("storage", refresh)
  }, [refresh])
  const seen = new Set([JSON.stringify(currentDocument)])
  const drafts = entries.filter((entry) => {
    const snapshot = JSON.stringify(entry.document)
    if (entry.id === draftId || seen.has(snapshot)) return false
    seen.add(snapshot)
    // Empty starting sheets are not useful recovery candidates.
    return (
      entry.document.electrical?.components?.length ||
      entry.document.electrical?.wires?.length ||
      entry.document.layout?.drawings?.length
    )
  })
  return (
    <EditorDialog title="Recover a circuit" onClose={onClose}>
      <p className="text-sm text-muted-foreground">
        Recent recovery drafts from this browser. Restore a draft to continue
        editing.
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {!drafts.length && (
        <p className="text-sm text-muted-foreground">
          No other circuits to recover.
        </p>
      )}
      {drafts.map((entry) => (
        <div key={entry.id} className="space-y-2 rounded border p-3">
          <p className="font-medium">
            {entry.document.title || "Untitled circuit"}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(entry.updated).toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                try {
                  onRestore(entry.document)
                } catch (cause) {
                  setError(String(cause))
                }
              }}
            >
              Restore
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDiscarding(entry.id)}
            >
              Discard
            </Button>
          </div>
          {discarding === entry.id && (
            <div className="space-y-2">
              <p className="text-sm">
                Discard this recovery draft? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={async () => {
                    try {
                      // Also discard older identical records hidden by deduplication.
                      for (const duplicate of entries.filter(
                        (item) =>
                          item.id !== draftId &&
                          JSON.stringify(item.document) ===
                            JSON.stringify(entry.document)
                      ))
                        await removeEntry("draft", duplicate.id)
                      setDiscarding(null)
                      refresh()
                    } catch (cause) {
                      setError(String(cause))
                    }
                  }}
                >
                  Confirm discard
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDiscarding(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </EditorDialog>
  )
}

export function OpenLinkDialog({
  onOpen,
  onClose,
}: {
  onOpen: (value: string) => Promise<void>
  onClose: () => void
}) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [opening, setOpening] = useState(false)
  return (
    <EditorDialog title="Open from link" onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={async (event) => {
          event.preventDefault()
          if (opening) return
          setOpening(true)
          try {
            await onOpen(value.trim())
            onClose()
          } catch (cause) {
            setError(String(cause))
            setOpening(false)
          }
        }}
      >
        <label className="grid gap-2 text-sm">
          Circuit link
          <textarea
            data-primary
            aria-label="Circuit link"
            className="min-h-24 w-full rounded border p-2 text-xs"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Paste a Wires circuit link…"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" disabled={opening || !value.trim()}>
          {opening ? "Opening…" : "Open circuit"}
        </Button>
      </form>
    </EditorDialog>
  )
}
