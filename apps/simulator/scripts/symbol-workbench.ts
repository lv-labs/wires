import ts from "typescript"
import { readFile, writeFile, readdir } from "node:fs/promises"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { randomUUID } from "node:crypto"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"
import {
  validateSymbolSource,
  validateWaveformSource,
} from "./symbol-source.ts"

const run = promisify(execFile)
const root = new URL("../../../packages/circuit-symbols/src/", import.meta.url)
const generator = new URL("./generate-symbols.mjs", import.meta.url)
const catalog = new URL(
  "../../../packages/circuit-core/catalog.js",
  import.meta.url
)
const glyphFile = new URL("../waveforms.tsx", root)
const glyphPath = fileURLToPath(glyphFile)
export function symbolWorkbench(): Plugin {
  let saving = false
  const drafts = new Map<
    string,
    { source: string; file: string; glyphDraft?: string }
  >()
  return {
    name: "symbol-workbench",
    enforce: "pre",
    async resolveId(id, importer) {
      const token = id.match(/^\/__symbol_preview\/([a-f0-9-]+)\.tsx$/)?.[1]
      if (token && drafts.has(token)) return `\0symbol-workbench:${token}.tsx`
      const match = importer?.match(
        /^\0symbol-workbench:([a-f0-9-]+)(:glyph)?\.tsx$/
      )
      if (match) {
        const draft = drafts.get(match[1])
        if (!draft) return
        const resolved = await this.resolve(
          id,
          match[2] ? glyphPath : draft.file,
          { skipSelf: true }
        )
        if (
          resolved?.id.split("?")[0] === glyphPath &&
          draft.glyphDraft !== undefined
        )
          return `\0symbol-workbench:${match[1]}:glyph.tsx`
        return resolved
      }
    },
    load(id) {
      const match = id.match(/^\0symbol-workbench:([a-f0-9-]+)(:glyph)?\.tsx$/)
      if (!match) return
      const draft = drafts.get(match[1])
      if (!draft)
        throw new Error("Preview expired; edit the source to refresh it")
      const source = match[2] ? draft.glyphDraft : draft.source
      if (source === undefined) throw new Error("Missing waveform glyph draft")
      return ts.transpileModule(source, {
        fileName: match[2] ? glyphPath : draft.file,
        compilerOptions: {
          target: ts.ScriptTarget.ES2023,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
        },
      }).outputText
    },
    async configureServer(server) {
      const kinds = new Set(
        (await readdir(root))
          .filter((name) => name.endsWith(".tsx"))
          .map((name) => name.slice(0, -4))
      )
      kinds.add("waveformGlyphs")
      server.middlewares.use("/__symbols", async (req, res) => {
        res.setHeader("Content-Type", "application/json")
        res.setHeader("Cache-Control", "no-store")
        const reply = (code: number, value: unknown) => {
          res.statusCode = code
          res.end(JSON.stringify(value))
        }
        const match = req.url
          ?.split("?")[0]
          .match(/^\/([a-z][a-zA-Z0-9]+)(\/preview)?$/)
        const kind = match?.[1]
        if (!kind || !kinds.has(kind)) {
          reply(404, { error: "Unknown symbol" })
          return
        }
        const file =
          kind === "waveformGlyphs" ? glyphFile : new URL(`${kind}.tsx`, root)
        try {
          if (req.method === "GET" && !match?.[2]) {
            reply(200, { kind, source: await readFile(file, "utf8") })
            return
          }
          if (req.method !== "POST") {
            reply(405, { error: "Method not allowed" })
            return
          }
          if (
            req.headers.origin !== `http://${req.headers.host}` &&
            req.headers.origin !== `https://${req.headers.host}`
          ) {
            reply(403, { error: "Same-origin requests only" })
            return
          }
          let body = ""
          for await (const chunk of req) {
            body += chunk
            if (body.length > 600000) {
              reply(413, { error: "Source too large" })
              return
            }
          }
          let data
          try {
            data = JSON.parse(body)
            if (kind === "waveformGlyphs") validateWaveformSource(data.draft)
            else validateSymbolSource(data.draft, kind)
            if (data.glyphDraft !== undefined)
              validateWaveformSource(data.glyphDraft)
          } catch (error) {
            reply(400, {
              error: error instanceof Error ? error.message : String(error),
            })
            return
          }
          if (match?.[2]) {
            const token = randomUUID(),
              path = fileURLToPath(file)
            drafts.set(token, {
              source: data.draft,
              file: path,
              glyphDraft: data.glyphDraft,
            })
            // Bound memory without writing drafts into the library or restarting Vite.
            while (drafts.size > 256) drafts.delete(drafts.keys().next().value!)
            reply(200, { url: `/__symbol_preview/${token}.tsx` })
            return
          }
          if (saving) {
            reply(409, { error: "A save is already in progress" })
            return
          }
          saving = true
          try {
            const source = await readFile(file, "utf8")
            if (source !== data.source) {
              reply(409, {
                error: "Source changed on disk. Reload source before saving.",
              })
              return
            }
            const previousCatalog = await readFile(catalog, "utf8")
            await writeFile(file, data.draft)
            try {
              await run(process.execPath, [generator.pathname])
            } catch (error) {
              await writeFile(file, source)
              await writeFile(catalog, previousCatalog)
              throw error
            }
            reply(200, { kind, source: data.draft })
          } finally {
            saving = false
          }
        } catch (error) {
          reply(500, {
            error: error instanceof Error ? error.message : String(error),
          })
        }
      })
    },
  }
}
