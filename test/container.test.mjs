// The `container` block groups child blocks together with an optional title, subtitle,
// icon, configurable width, and optional collapse/expand behavior. These tests render the
// JSON fixtures from the Block Kit examples and lock in the accessible group label, the
// header (button vs static div depending on `is_collapsible`), the initial collapsed state
// (SSR reflects `default_collapsed`), and that child blocks render through the normal block
// dispatcher. Run against the built dist/ via Node's built-in runner (CI builds first).

import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Message } from "../dist/index.mjs";

const render = (blocks) =>
  ReactDOMServer.renderToStaticMarkup(
    React.createElement(Message, {
      logo: "logo.png",
      name: "Tester",
      theme: "light",
      blocks,
    }),
  );

const child = (text) => ({ type: "section", text: { type: "mrkdwn", text } });

const collapsible = {
  type: "container",
  block_id: "bkb_collapsible",
  title: { type: "plain_text", text: "Bulk update: 2 records selected" },
  subtitle: { type: "plain_text", text: "Review changes before confirming" },
  is_collapsible: true,
  child_blocks: [child("DCW-1024"), { type: "divider" }, child("DCW-1025")],
};

const nonCollapsible = {
  type: "container",
  block_id: "no-collapse",
  title: { type: "plain_text", text: "Static container" },
  is_collapsible: false,
  child_blocks: [child("always visible")],
};

const defaultCollapsed = {
  type: "container",
  block_id: "default-collapsed",
  title: { type: "plain_text", text: "Collapsed by default" },
  icon: { type: "image", alt_text: "icon", image_url: "https://example.com/icon.png" },
  is_collapsible: true,
  default_collapsed: true,
  child_blocks: [child("hidden until expanded")],
};

test("collapsible: group label, expandable button header, and child blocks render", () => {
  const out = render([collapsible]);
  assert.match(out, /role="group" aria-label="Bulk update: 2 records selected"/);
  // collapsible header is a <button> that starts expanded
  assert.match(out, /<button[^>]*aria-expanded="true"/);
  assert.match(out, /Review changes before confirming/);
  // child blocks render through the normal dispatcher
  assert.match(out, /DCW-1024/);
  assert.match(out, /DCW-1025/);
  assert.match(out, /id="bkb_collapsible"/);
});

test("non-collapsible: header is a static div (no button / aria-expanded), content shown", () => {
  const out = render([nonCollapsible]);
  assert.doesNotMatch(out, /aria-expanded/);
  assert.doesNotMatch(out, /<button/);
  assert.match(out, /always visible/);
});

test("default_collapsed: starts collapsed so child content is not rendered, icon shows", () => {
  const out = render([defaultCollapsed]);
  assert.match(out, /<button[^>]*aria-expanded="false"/);
  assert.doesNotMatch(out, /hidden until expanded/);
  assert.match(out, /<img[^>]*src="https:\/\/example.com\/icon.png"/);
});
