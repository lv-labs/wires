import type { Plugin } from "vite"
import type { IncomingMessage, ServerResponse } from "node:http"

// Both editor routes mount the same React app and theme provider.
export function editorPages(): Plugin {
  const rewrite = (
    req: IncomingMessage,
    _res: ServerResponse,
    next: () => void
  ) => {
    const [pathname, query] = (req.url ?? "/").split("?")
    const page =
      pathname === "/editor" || pathname === "/editor/"
        ? "/index.html"
        : pathname === "/symbols" ||
            pathname === "/symbols/" ||
            pathname === "/symbols.html"
          ? "/index.html"
          : null
    if (page) req.url = page + (query === undefined ? "" : `?${query}`)
    next()
  }
  return {
    name: "editor-pages",
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}
