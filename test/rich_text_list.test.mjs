// Ordered lists carry a running count across sibling `rich_text_list` elements, because Slack
// splits one ordered list into several of them when the indent changes — the count is what makes
// the outer level resume at 3 after a nested a./b. The count was keyed on indent alone, so a
// bullet list at the same indent fed it too: two bullets followed by an ordered list numbered
// that list 3., 4. instead of 1., 2. These lock in the restart and the continuation cases it
// must not break. Run against the built dist/ via Node's built-in runner (CI builds first).

import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Message } from "../dist/index.mjs";

const section = (text) => ({
  type: "rich_text_section",
  elements: [{ type: "text", text }],
});

const list = (style, count, { indent, offset } = {}) => {
  const element = {
    type: "rich_text_list",
    style,
    elements: Array.from({ length: count }, (_, i) => section(`${style} ${i + 1}`)),
  };
  if (indent !== undefined) element.indent = indent;
  if (offset !== undefined) element.offset = offset;
  return element;
};

// The markers ("1.", "a.", or a bullet dot) share one span; bullets hold a nested span
// rather than text, so they come back empty and drop out.
const markers = (elements) => {
  const out = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Message, {
      logo: "logo.png",
      name: "Tester",
      theme: "light",
      blocks: [{ type: "rich_text", elements }],
    }),
  );

  return (out.match(/justify-center">([^<]*)</g) || [])
    .map((m) => m.slice('justify-center">'.length, -1))
    .filter(Boolean);
};

test("a bullet list does not seed the numbering of a following ordered list", () => {
  // the bug: the two bullets left the indent-0 counter at 2, so this numbered 3., 4.
  assert.deepEqual(markers([list("bullet", 2), list("ordered", 2)]), ["1.", "2."]);
});

test("an ordered list interrupted by a bullet list restarts", () => {
  assert.deepEqual(markers([list("ordered", 2), list("bullet", 2), list("ordered", 2)]), [
    "1.",
    "2.",
    "1.",
    "2.",
  ]);
});

test("an ordered list split by a deeper indent resumes at the next number", () => {
  // this is what the running count exists for — Slack sends the outer level as two elements
  assert.deepEqual(
    markers([
      list("ordered", 2, { indent: 0 }),
      list("ordered", 1, { indent: 1 }),
      list("ordered", 1, { indent: 0 }),
    ]),
    ["1.", "2.", "a.", "3."],
  );
});

test("consecutive ordered lists at the same indent keep counting", () => {
  assert.deepEqual(markers([list("ordered", 2), list("ordered", 2)]), ["1.", "2.", "3.", "4."]);
});

test("a non-list element between two ordered lists restarts numbering", () => {
  assert.deepEqual(markers([list("ordered", 2), section("interrupting line"), list("ordered", 2)]), [
    "1.",
    "2.",
    "1.",
    "2.",
  ]);
});

test("offset still sets the starting number", () => {
  assert.deepEqual(markers([list("ordered", 2, { indent: 0, offset: 5 })]), ["6.", "7."]);
});
