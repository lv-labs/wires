import ts from "typescript"

function literal(node: ts.Node): unknown {
  if (ts.isAsExpression(node)) return literal(node.expression)
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (ts.isStringLiteral(node)) return node.text
  if (
    ts.isPrefixUnaryExpression(node) &&
    node.operator === ts.SyntaxKind.MinusToken
  )
    return -Number(literal(node.operand))
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties.map((property) => {
        if (!ts.isPropertyAssignment(property))
          throw new Error("Metadata must contain literal properties")
        const name = property.name
        if (!ts.isIdentifier(name) && !ts.isStringLiteral(name))
          throw new Error("Metadata must contain named properties")
        return [name.text, literal(property.initializer)]
      })
    )
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (node.kind === ts.SyntaxKind.NullKeyword) return null
  throw new Error(
    "Symbol metadata must remain literal data for catalog generation"
  )
}
export function validateSymbolSource(
  source: unknown,
  kind: string
): asserts source is string {
  if (typeof source !== "string" || source.length > 200000)
    throw new Error("Invalid symbol source")
  validateTsx(source, `${kind}.tsx`)
  const ast = ts.createSourceFile(
    `${kind}.tsx`,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const declarations = new Map<string, ts.Expression>()
  let symbol = false
  for (const statement of ast.statements) {
    const exported =
      ts.canHaveModifiers(statement) &&
      ts
        .getModifiers(statement)
        ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    if (!exported) continue
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name?.text === "Symbol" &&
      statement.body
    )
      symbol = true
    if (ts.isVariableStatement(statement))
      for (const d of statement.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer)
          declarations.set(d.name.text, d.initializer)
      }
  }
  if (!symbol && !declarations.has("Symbol"))
    throw new Error("Keep the named Symbol export")
  const kindNode = declarations.get("kind"),
    metadataNode = declarations.get("metadata")
  if (!kindNode || literal(kindNode) !== kind)
    throw new Error(`Keep the symbol kind as "${kind}"`)
  if (!metadataNode) throw new Error("Keep the metadata export")
  const metadata = literal(metadataNode) as {
    drawingScale?: number
    pins?: Record<string, unknown>
  }
  if (
    !metadata ||
    typeof metadata !== "object" ||
    !metadata.pins ||
    typeof metadata.pins !== "object" ||
    Array.isArray(metadata.pins)
  )
    throw new Error("Metadata needs a pins object")
  for (const pin of Object.values(metadata.pins))
    if (
      !Array.isArray(pin) ||
      pin.length !== 2 ||
      !pin.every((n) => typeof n === "number" && Number.isFinite(n))
    )
      throw new Error("Pin positions must be numeric [x, y] pairs")
  if (
    metadata.drawingScale !== undefined &&
    (typeof metadata.drawingScale !== "number" ||
      !Number.isFinite(metadata.drawingScale) ||
      metadata.drawingScale <= 0)
  )
    throw new Error("drawingScale must be a positive number")
}

function validateTsx(source: string, fileName: string) {
  const result = ts.transpileModule(source, {
    fileName,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2023,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
    },
  })
  const errors =
    result.diagnostics?.filter(
      (d) => d.category === ts.DiagnosticCategory.Error
    ) ?? []
  if (errors.length)
    throw new Error(
      errors
        .map((d) => {
          const position =
            d.file && d.start !== undefined
              ? d.file.getLineAndCharacterOfPosition(d.start)
              : null
          return `${position ? `${position.line + 1}:${position.character + 1} · ` : ""}${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`
        })
        .join("\n")
    )
}
export function validateWaveformSource(
  source: unknown
): asserts source is string {
  if (typeof source !== "string" || source.length > 200000)
    throw new Error("Invalid waveform glyph source")
  validateTsx(source, "waveforms.tsx")
  const ast = ts.createSourceFile(
    "waveforms.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  for (const name of ["WaveformGlyph", "SweepGlyph"]) {
    const exported = ast.statements.some(
      (statement) =>
        ts.isFunctionDeclaration(statement) &&
        statement.name?.text === name &&
        statement.body &&
        ts
          .getModifiers(statement)
          ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    )
    if (!exported) throw new Error(`Keep the named ${name} function export`)
  }
}
