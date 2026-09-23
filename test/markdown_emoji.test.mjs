// Emoji interpolation in the `markdown` block — it renders through react-markdown
// (not the mrkdwn parser) and previously showed `:shortcode:` as literal text.
// These lock in parity with mrkdwn blocks: standard, aliases, skin tones, custom
// emoji via hooks, and code-span exclusion. Run against the built dist/ via Node's
// built-in runner (no test framework needed); CI builds before testing.

import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Message } from "../dist/index.mjs";

const render = (text, hooks) =>
  ReactDOMServer.renderToStaticMarkup(
    React.createElement(Message, {
      logo: "logo.png",
      name: "Tester",
      theme: "light",
      hooks,
      blocks: [{ type: "markdown", text }],
    }),
  );

test("standard shortcodes render as unicode", () => {
  const out = render(":tada:");
  assert.match(out, /🎉/);
  // the literal shortcode must be gone — that was the bug.
  assert.doesNotMatch(out, /:tada:/);
});

test("surrounding text and multiple emoji are preserved", () => {
  const out = render("ship it :tada: nice :smile:");
  assert.match(out, /ship it/);
  assert.match(out, /nice/);
  assert.match(out, /🎉/);
  assert.match(out, /😄/);
});

test("shortcode aliases resolve via the fallback map", () => {
  // `thumbsup` isn't a node-emoji name; it resolves through the library's
  // missing-emoji map, exactly like it does in mrkdwn blocks.
  assert.match(render(":thumbsup:"), /👍/);
});

test("skin-tone modifiers render", () => {
  const out = render(":wave::skin-tone-3:");
  assert.match(out, /👋/);
  assert.match(out, /🏼/);
});

test("custom emoji go through hooks.emoji while standard emoji fall back to parse()", () => {
  const hooks = {
    emoji: ({ name }, parse) => {
      if (name === "blob-dance") {
        return React.createElement("img", {
          className: "custom-emoji",
          "data-name": name,
          src: `https://cdn.example.com/${name}.png`,
          alt: name,
        });
      }
      return parse({ name });
    },
  };

  const out = render("standard :tada: custom :blob-dance:", hooks);
  // custom name → consumer-provided image
  assert.match(out, /custom-emoji/);
  assert.match(out, /data-name="blob-dance"/);
  assert.doesNotMatch(out, /:blob-dance:/);
  // standard name → unicode via the parse() fallback
  assert.match(out, /🎉/);
});

test("emoji inside code spans are left untouched", () => {
  const out = render("`:tada:`");
  assert.match(out, /:tada:/);
  assert.doesNotMatch(out, /🎉/);
});

test("emoji inside fenced code blocks are left untouched", () => {
  const out = render("```\n:tada:\n```");
  assert.match(out, /:tada:/);
  assert.doesNotMatch(out, /🎉/);
});
