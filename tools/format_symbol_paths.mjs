import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
const require = createRequire(
  new URL("../apps/simulator/package.json", import.meta.url),
);
const ts = require("typescript");
const root = new URL("../packages/circuit-symbols/", import.meta.url);
const checking = process.argv.includes("--check");
const tokenPattern =
  /[MmLlHhVvCcSsQqTtAaZz]|@[0-9]+@|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g;
function tokens(path) {
  const matches = [...path.matchAll(tokenPattern)];
  let end = 0;
  for (const match of matches) {
    if (!/^[\s,]*$/.test(path.slice(end, match.index))) return null;
    end = match.index + match[0].length;
  }
  if (!/^[\s,]*$/.test(path.slice(end))) return null;
  return matches.map((match) => match[0]);
}
function format(path, indent) {
  if (!/^\s*[Mm]\s*(?:[-+.\d]|@)/.test(path)) return null;
  const original = tokens(path);
  if (!original) return null;
  const commands = [];
  for (const token of original) {
    if (/^[a-z]$/i.test(token)) commands.push({ command: token, values: [] });
    else commands.at(-1).values.push(token);
  }
  const lines = commands.map(({ command, values }) => {
    const groups = [];
    const arity = {
      m: 2,
      l: 2,
      h: 1,
      v: 1,
      c: 6,
      s: 4,
      q: 4,
      t: 2,
      a: 7,
      z: 0,
    }[command.toLowerCase()];
    assert.ok(
      arity
        ? values.length >= arity && values.length % arity === 0
        : !values.length,
      `Invalid SVG command: ${command} ${values.join(" ")}`,
    );
    // Pairs are separated by commas; H/V coordinates remain scalar values.
    if (command.toLowerCase() === "a") {
      for (let i = 0; i < values.length; i += 7)
        groups.push(
          `${values[i]} ${values[i + 1]}, ${values[i + 2]}, ${values[i + 3]} ${values[i + 4]}, ${values[i + 5]} ${values[i + 6]}`,
        );
    } else if (arity === 1) groups.push(values.join(", "));
    else
      for (let i = 0; i < values.length; i += 2)
        groups.push(values.slice(i, i + 2).join(" "));
    return command + (values.length ? " " + groups.join(", ") : "");
  });
  const result = lines.join("\n" + indent);
  assert.deepEqual(
    tokens(result),
    original,
    "Formatting must preserve every command, coordinate and expression",
  );
  return result;
}
let paths = 0,
  changed = 0;
for (const name of [
  "svg.tsx",
  ...readdirSync(new URL("src/", root))
    .filter((name) => name.endsWith(".tsx"))
    .map((name) => "src/" + name),
]) {
  const file = new URL(name, root),
    source = readFileSync(file, "utf8");
  const ast = ts.createSourceFile(
    name,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const edits = [];
  function visit(node) {
    const start = node.getStart(ast);
    const lineStart = source.lastIndexOf("\n", start) + 1;
    const base = source.slice(lineStart).match(/^\s*/)[0].replace(/\n/g, "");
    const indent = base + "  ";
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const result = format(node.text, indent);
      if (result !== null) {
        paths++;
        const jsx = ts.isJsxAttribute(node.parent);
        const text = result.includes("\n")
          ? jsx
            ? `"${result}"`
            : "`" + result + "`"
          : JSON.stringify(result);
        edits.push({ start, end: node.end, text });
        return;
      }
    } else if (ts.isTemplateExpression(node)) {
      const expressions = node.templateSpans.map(
        (span) => "${" + span.expression.getText(ast) + "}",
      );
      const raw =
        node.head.text +
        node.templateSpans
          .map((span, i) => `@${i}@` + span.literal.text)
          .join("");
      const result = format(raw, indent);
      if (result !== null) {
        paths++;
        edits.push({
          start,
          end: node.end,
          text:
            "`" +
            (result.includes("\n")
              ? "\n" + indent + result + "\n" + base
              : result
            ).replace(/@(\d+)@/g, (_, i) => expressions[+i]) +
            "`",
        });
        return;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  let output = source;
  for (const edit of edits.sort((a, b) => b.start - a.start))
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  if (output !== source) {
    changed++;
    if (!checking) writeFileSync(file, output);
  }
}
console.log(
  `${checking ? "Checked" : "Formatted"} ${paths} SVG paths; ${changed} files ${checking ? "need formatting" : "updated"}.`,
);
if (checking && changed) process.exitCode = 1;
