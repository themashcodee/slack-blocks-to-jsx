// A rich_text block's `rich_text_section` children are separate lines in Slack, but the
// renderer marked each one `inline-block`, so sibling sections flowed onto a single line
// ("123", "asd", "test" rendered as "123asdtest"). The parent is a plain div with no column
// layout, so nothing else introduced a break. These lock in the block-level section element,
// the zero-height empty sections Slack emits between lines, and the branches that were never
// affected (quote, preformatted, list). Run against the built dist/ via Node's built-in
// runner (CI builds first).

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

const section = (text) => ({
  type: "rich_text_section",
  elements: text === "" ? [] : [{ type: "text", text }],
});

const multiline = {
  type: "rich_text",
  block_id: "multiline",
  elements: [section("123"), section("asd"), section("test")],
};

test("sibling sections are block-level so each renders on its own line", () => {
  const out = render([multiline]);
  const sections = out.match(/<p class="[^"]*slack_blocks_to_jsx__rich_text_section_element"/g);

  assert.equal(sections?.length, 3);
  for (const tag of sections) {
    assert.match(tag, /class="block /);
    // inline-block was the bug: it flowed the sections onto one line.
    assert.doesNotMatch(tag, /inline-block/);
  }
});

test("section text keeps its order inside the rich_text container", () => {
  const out = render([multiline]);
  assert.match(out, /<div id="multiline" class="slack_blocks_to_jsx__rich_text">/);
  assert.match(out, /123[\s\S]*asd[\s\S]*test/);
});

test("empty sections Slack emits between lines render as empty block paragraphs", () => {
  const out = render([
    {
      type: "rich_text",
      elements: [section("first"), section(""), section("second")],
    },
  ]);

  // no content and no styling of its own, so an empty section collapses to zero height
  assert.match(out, /<p class="block slack_blocks_to_jsx__rich_text_section_element"><\/p>/);
});

test("quote and preformatted branches are untouched", () => {
  const out = render([
    {
      type: "rich_text",
      elements: [
        section("line"),
        { type: "rich_text_quote", elements: [{ type: "text", text: "quoted" }] },
        { type: "rich_text_preformatted", elements: [{ type: "text", text: "code" }] },
      ],
    },
  ]);

  assert.match(out, /<blockquote[^>]*slack_blocks_to_jsx__rich_text_quote_element/);
  assert.match(out, /quoted/);
  assert.match(out, /slack_blocks_to_jsx__rich_text_preformatted_element/);
  assert.match(out, /code/);
});

test("sections nested in list items still render their content", () => {
  const out = render([
    {
      type: "rich_text",
      elements: [
        {
          type: "rich_text_list",
          style: "bullet",
          elements: [section("one"), section("two")],
        },
      ],
    },
  ]);

  assert.match(out, /slack_blocks_to_jsx__rich_text_list_element/);
  assert.match(out, /one[\s\S]*two/);
});
