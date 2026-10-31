/**
 * Which attribute a URL is about to be written into. The allowlist differs per kind because the
 * same scheme can be harmless in one sink and executable in another: an inline `data:image/*` is
 * fine as an `<img src>`, but `data:text/html` runs as a document inside an `<iframe src>`.
 */
export type UrlKind = "link" | "image" | "frame";

/**
 * Decides what a block URL becomes before it reaches an `href` or `src` attribute.
 *
 * Return the URL to render (unchanged or rewritten), or `undefined` to drop the attribute so the
 * element renders inert. Never return `""`: React keeps an empty `href`, which is a link to the
 * current page.
 */
export type UrlTransform = (url: string, kind: UrlKind) => string | undefined;

// Browsers strip leading C0 controls and spaces, and every tab/newline, before reading the
// scheme — so " javascript:" and "java\nscript:" both execute as javascript:. Normalize the same
// way before inspecting the scheme, but always hand back the caller's original string.
const LEADING_CONTROLS = /^[\u0000-\u0020]+/;
const TAB_OR_NEWLINE = /[\t\n\r]/g;
const SCHEME = /^([a-zA-Z][a-zA-Z0-9+.-]*):/;

const ALLOWED_SCHEMES: Record<UrlKind, ReadonlySet<string>> = {
  link: new Set(["http", "https", "mailto"]),
  image: new Set(["http", "https"]),
  frame: new Set(["http", "https"]),
};

/**
 * The default `urlTransform`.
 *
 * - `link`  → `http:`, `https:`, `mailto:`
 * - `image` → `http:`, `https:`, `data:image/*`
 * - `frame` → `http:`, `https:`
 *
 * Relative and scheme-relative URLs have no scheme to abuse and pass through untouched. Anything
 * else (`javascript:`, `vbscript:`, `data:text/html`, `file:`, custom app schemes, …) is rejected
 * and the attribute is dropped. To extend the allowlist, wrap it rather than replacing it:
 *
 * ```tsx
 * <Message urlTransform={(url, kind) => (url.startsWith("slack://") ? url : safeUrl(url, kind))} />
 * ```
 */
export const safeUrl: UrlTransform = (url, kind) => {
  if (typeof url !== "string") return undefined;

  const normalized = url.replace(LEADING_CONTROLS, "").replace(TAB_OR_NEWLINE, "");
  if (normalized === "") return undefined;

  const match = SCHEME.exec(normalized);
  // No scheme: relative or scheme-relative, resolved against the page's own origin.
  if (!match) return url;

  const scheme = (match[1] ?? "").toLowerCase();
  if (ALLOWED_SCHEMES[kind].has(scheme)) return url;
  if (kind === "image" && /^data:image\//i.test(normalized)) return url;

  return undefined;
};
