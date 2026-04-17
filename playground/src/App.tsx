import { useEffect, useMemo, useState } from "react";
import { Message, type Block } from "slack-blocks-to-jsx";
import { FIXTURES } from "./fixtures";

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
                <Message
                  blocks={blocks}
                  theme={theme}
                  logo={PLACEHOLDER_LOGO}
                  name="Playground"
                  showBlockKitDebug
                />
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
