import { useRef } from "react"

// Small source editor: native text undo, indentation, line numbers and TSX colouring.
function highlight(source: string) {
  const pattern =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Za-z][\w.:-]*|\b(?:import|from|export|default|const|let|return|function|if|else|true|false|undefined|type|as|number|string|boolean)\b|\b\d+(?:\.\d+)?\b)/g
  const parts = []
  let start = 0
  for (const match of source.matchAll(pattern)) {
    const offset = match.index!,
      text = match[0]
    parts.push(source.slice(start, offset))
    const color =
      text.startsWith("//") || text.startsWith("/*")
        ? "comment"
        : /^['"`]/.test(text)
          ? "string"
          : text.startsWith("<")
            ? "tag"
            : /^\d/.test(text)
              ? "number"
              : "keyword"
    parts.push(
      <span className={`syntax-${color}`} key={offset}>
        {text}
      </span>
    )
    start = offset + text.length
  }
  parts.push(source.slice(start))
  return parts
}
export function CodeEditor({
  source,
  onChange,
  disabled,
}: {
  source: string
  onChange: (source: string) => void
  disabled: boolean
}) {
  const paint = useRef<HTMLPreElement>(null),
    gutter = useRef<HTMLPreElement>(null)
  return (
    <div className="code-editor">
      <pre className="line-numbers" ref={gutter} aria-hidden="true">
        {source
          .split("\n")
          .map((_, i) => i + 1)
          .join("\n")}
      </pre>
      <div className="code-input">
        <pre className="code-paint" ref={paint} aria-hidden="true">
          {highlight(source)}
          {"\n"}
        </pre>
        <textarea
          aria-label="Symbol TSX source"
          value={source}
          disabled={disabled}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => {
            if (paint.current) {
              paint.current.scrollTop = e.currentTarget.scrollTop
              paint.current.scrollLeft = e.currentTarget.scrollLeft
            }
            if (gutter.current)
              gutter.current.scrollTop = e.currentTarget.scrollTop
          }}
          onKeyDown={(e) => {
            if (e.key !== "Tab" && e.key !== "Enter") return
            const input = e.currentTarget
            if (e.key === "Tab" && e.shiftKey) return
            e.preventDefault()
            const indent =
              source
                .slice(0, input.selectionStart)
                .split("\n")
                .at(-1)
                ?.match(/^\s*/)?.[0] ?? ""
            const text = e.key === "Tab" ? "  " : "\n" + indent
            // insertText retains the textarea's native undo history in Chromium.
            if (!document.execCommand("insertText", false, text)) {
              const start = input.selectionStart
              const end = input.selectionEnd
              onChange(source.slice(0, start) + text + source.slice(end))
              requestAnimationFrame(() =>
                input.setSelectionRange(
                  start + text.length,
                  start + text.length
                )
              )
            }
          }}
        />
      </div>
    </div>
  )
}
