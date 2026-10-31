// Block payloads are untrusted input, and every `href`/`src` sink used to write their URLs out
// unfiltered — a `javascript:` rich_text link or a `data:text/html` video_url rendered as-is.
// These lock in the per-kind scheme allowlist (`safeUrl`) at every sink, the browser-style
// normalisation that defeats obfuscated schemes, the hooks never seeing a rejected URL, and the
// `urlTransform` escape hatch. Run against the built dist/ via Node's built-in runner (CI builds
// first).

import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Message, safeUrl } from "../dist/index.mjs";

const render = (blocks, props = {}) =>
  ReactDOMServer.renderToStaticMarkup(
    React.createElement(Message, {
      logo: "logo.png",
      name: "Tester",
      theme: "light",
      // keeps the header's own <img src={logo}> out of the output so every src is a block URL
      withoutWrapper: true,
      blocks,
      ...props,
    }),
  );

// opening tags of `tag` in the output, e.g. every `<a ...>`
const tags = (html, tag) => html.match(new RegExp(`<${tag}\\b[^>]*>`, "g")) ?? [];
const hasAttr = (tag, attr) => new RegExp(`\\s${attr}=`).test(tag);

// A rejected URL must leave the element in place (so the test isn't passing because nothing
// rendered) but strip the attribute.
const assertInert = (html, tag, attr) => {
  const found = tags(html, tag);
  assert.ok(found.length > 0, `expected at least one <${tag}> in ${html}`);
  for (const t of found) assert.ok(!hasAttr(t, attr), `expected no ${attr} on ${t}`);
};

const plain = (text) => ({ type: "plain_text", text });
const mrkdwn = (text) => ({ type: "mrkdwn", text });

// ---- one builder per sink -----------------------------------------------------------------

const richTextLink = (url, text = "click") => ({
  type: "rich_text",
  elements: [{ type: "rich_text_section", elements: [{ type: "link", url, text }] }],
});
const section = (text) => ({ type: "section", text: mrkdwn(text) });
const markdown = (text) => ({ type: "markdown", text });
const taskCard = (url) => ({
  type: "task_card",
  task_id: "t1",
  title: "Task",
  sources: [{ type: "url", url, text: "source" }],
});
const urlSource = (url) => ({
  type: "context_actions",
  elements: [{ type: "url", url, text: "source" }],
});
const video = (video_url, extra = {}) => ({
  type: "video",
  title: plain("Clip"),
  alt_text: "clip",
  thumbnail_url: "https://example.com/thumb.png",
  video_url,
  ...extra,
});
const imageBlock = (image_url) => ({ type: "image", image_url, alt_text: "alt" });
const slackFileImage = (url) => ({ type: "image", slack_file: { url }, alt_text: "alt" });
const contextImage = (image_url) => ({
  type: "context",
  elements: [{ type: "image", image_url, alt_text: "alt" }],
});
const accessoryImage = (image_url) => ({
  type: "section",
  text: mrkdwn("text"),
  accessory: { type: "image", image_url, alt_text: "alt" },
});
const card = (url) => ({
  type: "card",
  title: plain("Card"),
  hero_image: { image_url: url, alt_text: "hero" },
  icon: { image_url: url, alt_text: "icon" },
});
const container = (url) => ({
  type: "container",
  title: plain("Box"),
  icon: { type: "image", image_url: url, alt_text: "icon" },
  child_blocks: [],
});
const usersSelect = (image) => ({
  type: "actions",
  elements: [
    {
      type: "users_select",
      action_id: "pick",
      focus_on_load: true, // opens the dropdown so the avatars render
      people: [{ id: "U1", name: "Ann", image, online: true, sleeping: false }],
    },
  ],
});

const JS = "javascript:alert(1)";

// ---- the default allowlist, per sink kind ---------------------------------------------------

test("safeUrl applies a different allowlist per sink kind", () => {
  assert.equal(safeUrl("https://example.com/a", "link"), "https://example.com/a");
  assert.equal(safeUrl("http://example.com/a", "frame"), "http://example.com/a");
  assert.equal(safeUrl("mailto:a@example.com", "link"), "mailto:a@example.com");
  assert.equal(safeUrl("mailto:a@example.com", "image"), undefined);

  const png = "data:image/png;base64,iVBORw0KGgo=";
  assert.equal(safeUrl(png, "image"), png);
  assert.equal(safeUrl(png, "link"), undefined);
  assert.equal(safeUrl(png, "frame"), undefined); // data: executes inside an iframe
  assert.equal(safeUrl("data:text/html,<script>alert(1)</script>", "image"), undefined);

  for (const kind of ["link", "image", "frame"]) {
    assert.equal(safeUrl(JS, kind), undefined);
    assert.equal(safeUrl("vbscript:MsgBox(1)", kind), undefined);
    assert.equal(safeUrl("file:///etc/passwd", kind), undefined);
    assert.equal(safeUrl("slack://channel?id=C1", kind), undefined);
    assert.equal(safeUrl("", kind), undefined);
  }
});

test("safeUrl leaves relative and scheme-relative URLs alone", () => {
  for (const url of ["/docs/a", "docs/a", "//cdn.example.com/a.png", "?q=a:b", "#top:1", "a/b:c"]) {
    assert.equal(safeUrl(url, "link"), url);
    assert.equal(safeUrl(url, "image"), url);
  }
});

test("safeUrl sees through the obfuscations browsers ignore", () => {
  const disguised = [
    " javascript:alert(1)",
    "\t\njavascript:alert(1)",
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "java\nscript:alert(1)",
    "java\tscript:alert(1)",
    "java\rscript:alert(1)",
    "\n",
  ];
  for (const url of disguised) assert.equal(safeUrl(url, "link"), undefined, JSON.stringify(url));

  // …while an allowed URL comes back exactly as given, not normalised
  assert.equal(safeUrl(" HTTPS://Example.com", "link"), " HTTPS://Example.com");
});

// ---- every sink ------------------------------------------------------------------------------

test("every <a href> sink drops a javascript: URL but still renders the link", () => {
  const cases = {
    rich_text_link: richTextLink(JS),
    mrkdwn_link: section(`<${JS}|click>`),
    mrkdwn_inline_code_link: section(`\`[click](${JS})\``),
    markdown_block_link: markdown(`[click](${JS})`),
    task_card_source: taskCard(JS),
    url_source_element: urlSource(JS),
    video_title: video("https://example.com/embed", { title_url: JS }),
  };
  for (const [name, block] of Object.entries(cases)) {
    const out = render([block]);
    assert.doesNotMatch(out, /href=/, name);
    assertInert(out, "a", "href");
  }

  // a date's link is optional to begin with, so a rejected one renders the date with no anchor
  const date = render([section(`<!date^1700000000^{date}^${JS}|Nov 14>`)]);
  assert.match(date, /<span class="slack_date">November 14, 2023<\/span>/);
  assert.doesNotMatch(date, /<a\b/);
});

test("every <img src> sink drops a javascript: URL", () => {
  const stillRendersImg = {
    image_block: imageBlock(JS),
    image_block_slack_file: slackFileImage(JS),
    context_image_element: contextImage(JS),
    section_accessory_image: accessoryImage(JS),
  };
  for (const [name, block] of Object.entries(stillRendersImg)) {
    const out = render([block]);
    assert.doesNotMatch(out, /src=/, name);
    assertInert(out, "img", "src");
  }

  // these sinks gate the whole <img> on the URL, so a rejected one renders no image at all
  const cardOut = render([card(JS)]);
  assert.match(cardOut, /slack_blocks_to_jsx__card_title/);
  assert.doesNotMatch(cardOut, /<img/);

  const containerOut = render([container(JS)]);
  assert.match(containerOut, /slack_blocks_to_jsx__container_title/);
  assert.doesNotMatch(containerOut, /<img/);

  const selectOut = render([usersSelect(JS)]);
  assert.match(selectOut, /slack_blocks_to_jsx__users_select_element/);
  assert.match(selectOut, />A</); // falls back to the initial-letter avatar
  assert.doesNotMatch(selectOut, /<img/);
});

test("the video iframe only embeds http(s), and iframeProps cannot reintroduce a URL", () => {
  for (const url of [
    "data:text/html,<script>alert(1)</script>",
    "data:image/png;base64,AAAA",
    JS,
  ]) {
    const out = render([video(url)]);
    assertInert(out, "iframe", "src");
  }

  const ok = render([video("https://example.com/embed")]);
  assert.match(tags(ok, "iframe")[0], /src="https:\/\/example\.com\/embed"/);

  const spread = render([video("https://example.com/embed", { iframeProps: { src: JS } })]);
  const [iframe] = tags(spread, "iframe");
  assert.match(iframe, /src="https:\/\/example\.com\/embed"/);
  assert.doesNotMatch(iframe, /javascript/);
});

test("allowed URLs render untouched at every sink", () => {
  const out = render([
    richTextLink("https://example.com/a", "https"),
    richTextLink("mailto:me@example.com", "mail"),
    richTextLink("HTTPS://EXAMPLE.COM/B", "upper"),
    richTextLink("/relative/path", "relative"),
    section("<https://example.com/c|mrkdwn>"),
    markdown("[md](https://example.com/d) ![img](https://example.com/d.png)"),
    imageBlock("data:image/png;base64,iVBORw0KGgo="),
    imageBlock("//cdn.example.com/e.png"),
    taskCard("https://example.com/f"),
  ]);

  for (const expected of [
    'href="https://example.com/a"',
    'href="mailto:me@example.com"',
    'href="HTTPS://EXAMPLE.COM/B"',
    'href="/relative/path"',
    'href="https://example.com/c"',
    'href="https://example.com/d"',
    'src="https://example.com/d.png"',
    'src="data:image/png;base64,iVBORw0KGgo="',
    'src="//cdn.example.com/e.png"',
    'href="https://example.com/f"',
  ]) {
    assert.ok(out.includes(expected), `missing ${expected} in ${out}`);
  }
});

test("the markdown block routes links and images through the same filter", () => {
  const bad = render([markdown(`[x](${JS}) ![y](${JS}) ![z](data:text/html,<b>)`)]);
  assertInert(bad, "a", "href");
  assertInert(bad, "img", "src");

  // react-markdown's own filter would have blanked this; the override reaches it because the
  // block hands `urlTransform` to react-markdown instead of filtering after the fact
  const custom = render([markdown("[x](slack://channel?id=C1)")], {
    urlTransform: (url, kind) => (url.startsWith("slack://") ? url : safeUrl(url, kind)),
  });
  assert.match(custom, /href="slack:\/\/channel\?id=C1"/);
});

// ---- hooks never see a rejected URL ----------------------------------------------------------

test("hooks.link is skipped for a rejected URL and receives an allowed one", () => {
  const seen = [];
  const hooks = {
    link: ({ href, children }) => {
      seen.push(href);
      return React.createElement("b", { "data-hook": "" }, children);
    },
  };

  const bad = render(
    [richTextLink(JS), section(`<${JS}|x>`), video("https://e.com/v", { title_url: JS })],
    {
      hooks,
    },
  );
  assert.doesNotMatch(bad, /data-hook/);
  assertInert(bad, "a", "href");

  const good = render([richTextLink("https://example.com/a")], { hooks });
  assert.match(good, /data-hook/);
  assert.deepEqual(seen, ["https://example.com/a"]);
});

test("hooks.date receives null instead of a rejected link", () => {
  const links = [];
  const hooks = {
    date: ({ link }) => {
      links.push(link);
      return "date";
    },
  };
  render([section(`<!date^1700000000^{date}^${JS}|fallback>`)], { hooks });
  render([section("<!date^1700000000^{date}^https://example.com/e|fallback>")], { hooks });
  render([section("<!date^1700000000^{date}|fallback>")], { hooks });
  assert.deepEqual(links, [null, "https://example.com/e", null]);
});

// ---- the escape hatch ------------------------------------------------------------------------

test("a custom urlTransform replaces the default and is told which kind of sink is asking", () => {
  const seen = [];
  const urlTransform = (url, kind) => {
    seen.push(kind);
    return url.startsWith("slack://") ? url : undefined;
  };

  const out = render(
    [
      richTextLink("slack://channel?id=C1", "open"),
      imageBlock("https://example.com/a.png"),
      video("https://example.com/embed"),
    ],
    { urlTransform },
  );

  assert.match(out, /href="slack:\/\/channel\?id=C1"/);
  // the custom transform is authoritative: the default would have allowed these two
  assertInert(out, "img", "src");
  assertInert(out, "iframe", "src");
  assert.deepEqual(new Set(seen), new Set(["link", "image", "frame"]));
});

test("a custom urlTransform can rewrite a URL, not just allow or reject it", () => {
  const out = render([imageBlock("https://example.com/a.png")], {
    urlTransform: (url, kind) =>
      kind === "image" ? `https://proxy.example.com/?u=${encodeURIComponent(url)}` : url,
  });
  assert.match(out, /src="https:\/\/proxy\.example\.com\/\?u=https%3A%2F%2Fexample\.com%2Fa\.png"/);
});
