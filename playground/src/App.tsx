import { useEffect, useMemo, useRef, useState } from "react";
import { Message, type Block } from "slack-blocks-to-jsx";
import { FIXTURES } from "./fixtures";

// Library-package override. The "Library package" field (and the ?package= query
// param the PR-preview comment links to) load a different build of the library at
// runtime instead of the bundled local source. ?pr=N adds a one-click preset for
// that PR's pkg.pr.new build.
const REPO = "themashcodee/slack-blocks-to-jsx";
const PKG = "slack-blocks-to-jsx";

const QUERY = new URLSearchParams(window.location.search);
const INITIAL_PACKAGE = QUERY.get("package") ?? "";
const PR_NUMBER = QUERY.get("pr");
const PRESET_BUILD = PR_NUMBER ? `https://pkg.pr.new/${PKG}@${PR_NUMBER}` : null;

// esm.sh serves one shared React instance per pinned version, so pinning the
// override build, our React, and ReactDOM all to 18.3.1 keeps a single instance
// (no "invalid hook call" from two Reacts).
const REACT_URL = "https://esm.sh/react@18.3.1";
const REACT_DOM_URL = "https://esm.sh/react-dom@18.3.1/client";

// Turn a field value — a version (`1.1.0`), a pkg.pr.new build URL, or any ESM
// URL — into a browser-loadable esm.sh module URL with React pinned.
const resolveBuildUrl = (pkg: string): string => {
  let base: string;
  if (pkg.startsWith("https://pkg.pr.new/")) {
    // A pkg.pr.new tarball isn't browser-ESM; route it through esm.sh's /pr/.
    // Compact form (`pkg@ref`) lacks the owner/repo esm.sh needs, so add it.
    const rest = pkg.slice("https://pkg.pr.new/".length);
    base = rest.includes("/") ? `https://esm.sh/pr/${rest}` : `https://esm.sh/pr/${REPO}/${rest}`;
  } else if (/^https?:\/\//.test(pkg)) {
    base = pkg;
  } else {
    const version = pkg.includes("@") ? pkg.slice(pkg.lastIndexOf("@") + 1) : pkg;
    base = `https://esm.sh/${PKG}@${version}`;
  }
  return base + (base.includes("?") ? "&" : "?") + "deps=react@18.3.1,react-dom@18.3.1";
};

// A 1x1 transparent pixel so <Message>'s required `logo` prop has something
// to render — the playground doesn't care about the Slack-chrome avatar.
const PLACEHOLDER_LOGO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect width='36' height='36' rx='6' fill='%231264a3'/><text x='18' y='23' font-family='system-ui,sans-serif' font-size='16' font-weight='600' fill='white' text-anchor='middle'>PG</text></svg>";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "pg-theme";

const readStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
};

type ParseResult = { blocks: Block[]; error: null } | { blocks: null; error: string };

const parseBlocks = (text: string): ParseResult => {
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      return { blocks: null, error: "Top-level JSON must be an array of blocks." };
    }
    return { blocks: parsed as Block[], error: null };
  } catch (err) {
    return { blocks: null, error: (err as Error).message };
  }
};

// Renders the ?package= override build in its OWN React root (loaded from esm.sh),
// fully isolated from the playground's bundled React. Props are plain data, so we
// just (re)render imperatively when they change.
const OverrideMessage = ({ url, blocks, theme }: { url: string; blocks: Block[]; theme: Theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<{ R: any; root: any; Message: any } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | { error: string }>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    Promise.all([
      import(/* @vite-ignore */ url),
      import(/* @vite-ignore */ REACT_URL),
      import(/* @vite-ignore */ REACT_DOM_URL),
    ])
      .then(([mod, react, reactDom]) => {
        if (cancelled || !containerRef.current) return;
        const R = react.default ?? react;
        const createRoot = reactDom.createRoot ?? reactDom.default.createRoot;
        runtimeRef.current = { R, root: createRoot(containerRef.current), Message: mod.Message };
        setStatus("ready");
      })
      .catch((err: Error) => !cancelled && setStatus({ error: err.message }));
    return () => {
      cancelled = true;
      runtimeRef.current?.root.unmount();
      runtimeRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt) return;
    rt.root.render(
      rt.R.createElement(rt.Message, {
        blocks,
        theme,
        logo: PLACEHOLDER_LOGO,
        name: "Playground",
        showBlockKitDebug: true,
      }),
    );
  }, [blocks, theme, status]);

  return (
    <>
      {status === "loading" && (
        <p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>Loading build…</p>
      )}
      {typeof status === "object" && (
        <div className="pg-editor-error">Failed to load build: {status.error}</div>
      )}
      <div ref={containerRef} />
    </>
  );
};

export const App = () => {
  const [fixtureId, setFixtureId] = useState<string>(FIXTURES[0]!.id);
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());
  const [jsonText, setJsonText] = useState<string>(() =>
    JSON.stringify(FIXTURES[0]!.blocks, null, 2),
  );

  // Apply theme at the body level so the plain-CSS chrome reacts, AND pass
  // it through to <Message theme> so the library's `data-theme="dark"` hook
  // flips the scoped Tailwind dark variants.
  useEffect(() => {
    document.body.classList.toggle("pg-dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Whenever the sidebar selection changes, replace the editor contents.
  // The user's free-form edits are preserved until they pick a new fixture.
  const onPickFixture = (id: string) => {
    const fx = FIXTURES.find((f) => f.id === id);
    if (!fx) return;
    setFixtureId(id);
    setJsonText(JSON.stringify(fx.blocks, null, 2));
  };

  const { blocks, error: parseError } = useMemo(() => parseBlocks(jsonText), [jsonText]);

  // The "Library package" field, and which build (if any) is currently loaded.
  const [pkgInput, setPkgInput] = useState<string>(INITIAL_PACKAGE);
  const [activePkg, setActivePkg] = useState<string | null>(INITIAL_PACKAGE || null);

  // Load `value` (or fall back to local ../src when empty), keeping ?package= in
  // the URL so the current build stays shareable/bookmarkable.
  const loadBuild = (value: string) => {
    const v = value.trim();
    setActivePkg(v || null);
    const url = new URL(window.location.href);
    if (v) url.searchParams.set("package", v);
    else url.searchParams.delete("package");
    window.history.replaceState(null, "", url);
  };

  const overrideUrl = useMemo(
    () => (activePkg ? resolveBuildUrl(activePkg) : null),
    [activePkg],
  );

  return (
    <div className="pg-shell">
      <aside className="pg-sidebar">
        <div className="pg-sidebar-header">
          <span>Fixtures</span>
          <small style={{ fontWeight: 400, opacity: 0.6 }}>{FIXTURES.length}</small>
        </div>
        <div className="pg-sidebar-list">
          {FIXTURES.map((fx) => (
            <button
              key={fx.id}
              type="button"
              className={`pg-sidebar-item ${fx.id === fixtureId ? "is-active" : ""}`}
              onClick={() => onPickFixture(fx.id)}
            >
              {fx.label}
            </button>
          ))}
        </div>
        <div className="pg-sidebar-footer">
          <span>Theme</span>
          <div className="pg-theme-row">
            <button
              type="button"
              className={`pg-theme-btn ${theme === "light" ? "is-active" : ""}`}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
            <button
              type="button"
              className={`pg-theme-btn ${theme === "dark" ? "is-active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>
          <span style={{ opacity: 0.7 }}>
            Edits to <code>../src/**</code> hot-reload.
          </span>
        </div>
      </aside>

      <main className="pg-main">
        <div className="pg-toolbar">
          <span className="pg-title">slack-blocks-to-jsx playground</span>
          <input
            type="text"
            className="pg-pkg-input"
            placeholder="Library package (version or build URL)"
            title="Load a published version (e.g. 1.1.0) or a build URL (e.g. https://pkg.pr.new/slack-blocks-to-jsx@93). Empty = local ../src."
            value={pkgInput}
            onChange={(e) => setPkgInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadBuild(pkgInput)}
          />
          <button type="button" onClick={() => loadBuild(pkgInput)}>
            Load build
          </button>
          {PRESET_BUILD && (
            <button
              type="button"
              title={PRESET_BUILD}
              onClick={() => {
                setPkgInput(PRESET_BUILD);
                loadBuild(PRESET_BUILD);
              }}
            >
              pkg.pr #{PR_NUMBER}
            </button>
          )}
          {overrideUrl && (
            <button
              type="button"
              title="Switch back to the local ../src build"
              onClick={() => {
                setPkgInput("");
                loadBuild("");
              }}
            >
              Use local build
            </button>
          )}
          <span className="pg-spacer" />
          <button
            type="button"
            onClick={() => onPickFixture(fixtureId)}
            title="Reset editor to the currently selected fixture"
          >
            Reset
          </button>
        </div>

        <div className="pg-split">
          <section className="pg-editor">
            <textarea
              spellCheck={false}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
            {parseError && <div className="pg-editor-error">{parseError}</div>}
          </section>

          <section className="pg-preview">
            <div className="pg-preview-surface">
              {blocks ? (
                overrideUrl ? (
                  <OverrideMessage url={overrideUrl} blocks={blocks} theme={theme} />
                ) : (
                  <Message
                    blocks={blocks}
                    theme={theme}
                    logo={PLACEHOLDER_LOGO}
                    name="Playground"
                    showBlockKitDebug
                  />
                )
              ) : (
                <p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>
                  Fix the JSON on the left to see a preview.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
