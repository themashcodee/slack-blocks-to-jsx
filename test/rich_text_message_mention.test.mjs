// Slack sends a pasted message permalink as a `message_mention` rich_text element, not a `link`.
// The section renderer had no branch for it, so the link silently vanished from the message.
// These lock in that it renders as a link to its `url`, keeps its style, goes through the `link`
// hook, and is still vetted by `urlTransform`. Run against the built dist/ via Node's built-in
// runner (CI builds first).

import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Message } from "../dist/index.mjs";

const PERMALINK = "https://acme.slack.com/archives/C0CDT7DGXT4/p1793456222823149";

const render = (elements, props = {}) =>
  ReactDOMServer.renderToStaticMarkup(
    React.createElement(Message, {
      logo: "logo.png",
      name: "Tester",
      theme: "light",
      withoutWrapper: true,
      blocks: [{ type: "rich_text", elements: [{ type: "rich_text_section", elements }] }],
      ...props,
    }),
  );

const mention = (overrides = {}) => ({
  type: "message_mention",
  message_ts: "1793456222.823149",
  channel_id: "C0CDT7DGXT4",
  author_id: "U088HCYD486",
  text: PERMALINK,
  url: PERMALINK,
  ...overrides,
});

test("renders a message_mention as a link to its permalink", () => {
  const out = render([{ type: "text", text: "See " }, mention()]);

  assert.match(out, /See /);
  assert.match(
    out,
    new RegExp(`<a target="_blank" rel="noreferrer noopener" href="${PERMALINK}"[^>]*>${PERMALINK}</a>`),
  );
});

test("keeps the mention's style on the link", () => {
  const out = render([mention({ style: { bold: true, italic: true } })]);
  const anchor = out.match(/<a\b[^>]*>/)?.[0] ?? "";

  assert.match(anchor, /font-semibold/);
  assert.match(anchor, /italic/);
});

test("goes through the link hook", () => {
  const seen = [];
  render([mention()], {
    hooks: {
      link: ({ href, children }) => {
        seen.push({ href, children });
        return React.createElement("span", null, children);
      },
    },
  });

  assert.deepEqual(seen, [{ href: PERMALINK, children: PERMALINK }]);
});

test("an unsafe url renders as an inert link", () => {
  const out = render([mention({ url: "javascript:alert(1)", text: "javascript:alert(1)" })]);
  const anchor = out.match(/<a\b[^>]*>/)?.[0];

  assert.ok(anchor, out);
  assert.doesNotMatch(anchor, /\shref=/);
});
