import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { EditorDialog } from "./EditorDialog"
import { core } from "./core"
import type { CircuitDocument } from "./core"

export function FalstadImportDialog({
  onClose,
  onImport,
}: {
  onClose: () => void
  onImport: (document: CircuitDocument) => void
}) {
  const [text, setText] = useState("")
  const result = useMemo(
    () => (text.trim() ? core.falstad.importText(text) : null),
    [text]
  )
  return (
    <EditorDialog title="Import Falstad circuit" onClose={onClose}>
      <p className="text-sm text-muted-foreground">
        Paste text or XML from Falstad’s Export as Text. Unsupported records
        prevent import. Scope and slider settings are not imported yet.
      </p>
      <Textarea
        aria-label="Falstad circuit text"
        className="min-h-48 font-mono text-xs"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={5_000_000}
        placeholder="$ 1 0.000005 …"
      />
      {result && (
        <div aria-live="polite" className="max-h-40 overflow-y-auto text-sm">
          {result.document && (
            <p>
              {result.document.electrical.components.length} components ready to
              import.
            </p>
          )}
          {result.diagnostics.map((d, i) => (
            <p
              key={i}
              className={
                d.severity === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              {d.severity === "error" ? "Error" : "Warning"}
              {d.line ? ` on line ${d.line}` : ""}: {d.message}
            </p>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!result?.document}
          onClick={() => {
            if (result?.document)
              onImport({ ...result.document, id: crypto.randomUUID() })
          }}
        >
          Import
        </Button>
      </div>
    </EditorDialog>
  )
}
