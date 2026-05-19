import { describe, it, expect, vi } from "vitest";
import { renderMrkdwn } from "./render";

const VERBATIM_MODES: { name: string; verbatim: boolean }[] = [
  { name: "verbatim: false", verbatim: false },
  { name: "verbatim: true", verbatim: true },
];

describe("user mention directives", () => {
  VERBATIM_MODES.forEach(({ name, verbatim }) => {
    describe(name, () => {
      it("fires hooks.user with { id, name, style } when user is in data.users", () => {
        const user = vi.fn(({ id, name }) => <span data-testid="hook-user">@{name}</span>);
        const { getByTestId } = renderMrkdwn(`Hi <@U123>!`, verbatim, {
          data: { users: [{ id: "U123", name: "alice" }] },
          hooks: { user },
        });
        expect(user).toHaveBeenCalledTimes(1);
        expect(user).toHaveBeenCalledWith({ id: "U123", name: "alice", style: undefined });
        expect(getByTestId("hook-user").textContent).toBe("@alice");
      });

      it("fires hooks.user with raw id when user is not in data.users", () => {
        const user = vi.fn(({ id, name }) => <span>{name}</span>);
        renderMrkdwn(`Hi <@U999>!`, verbatim, { data: { users: [] }, hooks: { user } });
        expect(user).toHaveBeenCalledWith({ id: "U999", name: "U999", style: undefined });
      });

      it("respects the |fallback label form for users", () => {
        const user = vi.fn(({ id, name }) => <span data-testid="u">{name}</span>);
        const { getByTestId } = renderMrkdwn(`Hi <@U777|fallback>!`, verbatim, {
          data: { users: [] },
          hooks: { user },
        });
        expect(user).toHaveBeenCalledWith({ id: "U777", name: "fallback", style: undefined });
        expect(getByTestId("u").textContent).toBe("fallback");
      });

      it("falls back to default span when hook is not provided", () => {
        const { container } = renderMrkdwn(`Hi <@U123>!`, verbatim, {
          data: { users: [{ id: "U123", name: "alice" }] },
        });
        const span = container.querySelector(".slack_user");
        expect(span).not.toBeNull();
        expect(span!.textContent).toBe("@alice");
      });
    });
  });
});

describe("channel mention directives", () => {
  VERBATIM_MODES.forEach(({ name, verbatim }) => {
    describe(name, () => {
      it("fires hooks.channel with resolved name", () => {
        const channel = vi.fn(({ id, name }) => <span data-testid="c">#{name}</span>);
        const { getByTestId } = renderMrkdwn(`See <#C123>!`, verbatim, {
          data: { channels: [{ id: "C123", name: "general" }] },
          hooks: { channel },
        });
        expect(channel).toHaveBeenCalledWith({ id: "C123", name: "general", style: undefined });
        expect(getByTestId("c").textContent).toBe("#general");
      });

      it("respects |fallback label form", () => {
        const channel = vi.fn(({ id, name }) => <span data-testid="c">#{name}</span>);
        renderMrkdwn(`See <#C999|fallback>!`, verbatim, {
          data: { channels: [] },
          hooks: { channel },
        });
        expect(channel).toHaveBeenCalledWith({ id: "C999", name: "fallback", style: undefined });
      });
    });
  });
});

describe("usergroup mention directives", () => {
  VERBATIM_MODES.forEach(({ name, verbatim }) => {
    describe(name, () => {
      it("fires hooks.usergroup with resolved name", () => {
        const usergroup = vi.fn(({ id, name }) => <span data-testid="g">@{name}</span>);
        const { getByTestId } = renderMrkdwn(`Tag <!subteam^S123>!`, verbatim, {
          data: { user_groups: [{ id: "S123", name: "team" }] },
          hooks: { usergroup },
        });
        expect(usergroup).toHaveBeenCalledWith({ id: "S123", name: "team", style: undefined });
        expect(getByTestId("g").textContent).toBe("@team");
      });

      it("respects |fallback label form", () => {
        const usergroup = vi.fn(({ id, name }) => <span data-testid="g">@{name}</span>);
        renderMrkdwn(`Tag <!subteam^S999|@team>!`, verbatim, {
          data: { user_groups: [] },
          hooks: { usergroup },
        });
        expect(usergroup).toHaveBeenCalledWith({ id: "S999", name: "@team", style: undefined });
      });
    });
  });
});

describe("broadcast directives", () => {
  VERBATIM_MODES.forEach(({ name, verbatim }) => {
    describe(name, () => {
      it("fires hooks.atHere for <!here>", () => {
        const atHere = vi.fn(() => <span data-testid="h">@here</span>);
        const { getByTestId } = renderMrkdwn(`Hey <!here>!`, verbatim, { hooks: { atHere } });
        expect(atHere).toHaveBeenCalledWith(undefined);
        expect(getByTestId("h")).toBeInTheDocument();
      });

      it("fires hooks.atChannel for <!channel>", () => {
        const atChannel = vi.fn(() => <span data-testid="c">@channel</span>);
        const { getByTestId } = renderMrkdwn(`<!channel>`, verbatim, { hooks: { atChannel } });
        expect(atChannel).toHaveBeenCalledWith(undefined);
        expect(getByTestId("c")).toBeInTheDocument();
      });

      it("fires hooks.atEveryone for <!everyone>", () => {
        const atEveryone = vi.fn(() => <span data-testid="e">@everyone</span>);
        const { getByTestId } = renderMrkdwn(`<!everyone>`, verbatim, { hooks: { atEveryone } });
        expect(atEveryone).toHaveBeenCalledWith(undefined);
        expect(getByTestId("e")).toBeInTheDocument();
      });
    });
  });
});

describe("date directives", () => {
  VERBATIM_MODES.forEach(({ name, verbatim }) => {
    describe(name, () => {
      it("fires hooks.date with timestamp, format, link, fallback (no link)", () => {
        const date = vi.fn(() => <span data-testid="d">date!</span>);
        const { getByTestId } = renderMrkdwn(
          `Posted <!date^1717000000^{date_pretty}|May 29>`,
          verbatim,
          { hooks: { date } },
        );
        expect(date).toHaveBeenCalledWith({
          timestamp: "1717000000",
          format: "{date_pretty}",
          link: null,
          fallback: "May 29",
        });
        expect(getByTestId("d")).toBeInTheDocument();
      });

      it("preserves the optional link", () => {
        const date = vi.fn(() => <span data-testid="d">date!</span>);
        renderMrkdwn(
          `Posted <!date^1717000000^{date_pretty}^https://example.test|May 29>`,
          verbatim,
          { hooks: { date } },
        );
        expect(date).toHaveBeenCalledWith({
          timestamp: "1717000000",
          format: "{date_pretty}",
          link: "https://example.test",
          fallback: "May 29",
        });
      });
    });
  });
});

describe("code-span suppression", () => {
  it("does not fire hooks.user for directives inside inline code (non-verbatim)", () => {
    const user = vi.fn();
    const { container } = renderMrkdwn("Try \\`<@U123>\\`".replace(/\\`/g, "`"), false, {
      hooks: { user },
      data: { users: [{ id: "U123", name: "alice" }] },
    });
    expect(user).not.toHaveBeenCalled();
    expect(container.textContent).toContain("<@U123>");
  });

  it("does not fire hooks.user for directives inside fenced code", () => {
    const user = vi.fn();
    const { container } = renderMrkdwn("```\n<@U123>\n```", false, {
      hooks: { user },
      data: { users: [{ id: "U123", name: "alice" }] },
    });
    expect(user).not.toHaveBeenCalled();
    expect(container.textContent).toContain("<@U123>");
  });
});

describe("escaped entities", () => {
  it("decodes &amp; in link URLs", () => {
    const { container } = renderMrkdwn(
      `<https://example.test/?a=1&amp;b=2|report>`,
      false,
    );
    const anchor = container.querySelector("a");
    expect(anchor).not.toBeNull();
    expect(anchor!.getAttribute("href")).toBe("https://example.test/?a=1&b=2");
    expect(anchor!.textContent).toBe("report");
  });
});

describe("regression — non-directive markdown", () => {
  it("renders bold via *single-asterisk* in non-verbatim", () => {
    const { container } = renderMrkdwn(`Hi *bold* world`, false);
    expect(container.querySelector("strong")?.textContent).toBe("bold");
  });

  it("renders inline code in non-verbatim", () => {
    const { container } = renderMrkdwn("Try `code`", false);
    expect(container.querySelector("code")?.textContent).toBe("code");
  });

  it("does NOT bold *text* in verbatim mode (renders literal)", () => {
    const { container } = renderMrkdwn(`Hi *bold* world`, true);
    expect(container.querySelector("strong")).toBeNull();
    expect(container.textContent).toContain("*bold*");
  });

  it("auto-links bare URLs in non-verbatim", () => {
    const { container } = renderMrkdwn(`Visit <https://example.com>`, false);
    const anchor = container.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe("https://example.com");
  });

  it("does NOT auto-link bare URLs in verbatim", () => {
    const { container } = renderMrkdwn(`Visit <https://example.com>`, true);
    expect(container.querySelector("a")).toBeNull();
    expect(container.textContent).toContain("<https://example.com>");
  });
});

describe("mixed content", () => {
  it("resolves a user mention and renders an autolinked URL alongside it (non-verbatim)", () => {
    const user = vi.fn(({ name }) => <span data-testid="u">@{name}</span>);
    const { container, getByTestId } = renderMrkdwn(
      `Hi <@U123>, see <https://example.com|here>`,
      false,
      { hooks: { user }, data: { users: [{ id: "U123", name: "alice" }] } },
    );
    expect(getByTestId("u").textContent).toBe("@alice");
    const anchor = container.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe("https://example.com");
    expect(anchor?.textContent).toBe("here");
  });

  it("resolves a user mention next to literal text in verbatim", () => {
    const user = vi.fn(({ name }) => <span data-testid="u">@{name}</span>);
    const { container, getByTestId } = renderMrkdwn(`Hi <@U123>!`, true, {
      hooks: { user },
      data: { users: [{ id: "U123", name: "alice" }] },
    });
    expect(getByTestId("u").textContent).toBe("@alice");
    expect(container.textContent).toContain("Hi ");
    expect(container.textContent).toContain("!");
  });
});
