// Select carets, input placeholders and carousel arrows are vertically centred without a
// translate transform: a host page on Tailwind v4 emits its own `.-translate-y-1/2` rule (the
// `translate` property), which stacks on this library's v3 `transform` and shifts them up by a
// full element height. Also locks in that the date/time picker placeholder hides the native
// `mm/dd/yyyy` / `--:-- --` text instead of drawing over it. Run against the built dist/.

import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Message } from "../dist/index.mjs";

const render = (blocks) =>
  ReactDOMServer.renderToStaticMarkup(
    React.createElement(Message, { logo: "logo.png", name: "Tester", theme: "light", blocks }),
  );

const text = (t) => ({ type: "plain_text", text: t });
const option = { text: text("One"), value: "1" };

const elements = [
  { type: "static_select", action_id: "a", placeholder: text("Static"), options: [option] },
  { type: "multi_static_select", action_id: "b", placeholder: text("Multi"), options: [option] },
  { type: "users_select", action_id: "c", placeholder: text("Users") },
  { type: "multi_users_select", action_id: "d", placeholder: text("Multi users") },
  { type: "channels_select", action_id: "e", placeholder: text("Channels") },
  { type: "multi_channels_select", action_id: "f", placeholder: text("Multi channels") },
  { type: "conversations_select", action_id: "g", placeholder: text("Conversations") },
  { type: "multi_conversations_select", action_id: "h", placeholder: text("Multi conv") },
  { type: "external_select", action_id: "i", placeholder: text("External") },
  { type: "multi_external_select", action_id: "j", placeholder: text("Multi external") },
  { type: "datepicker", action_id: "k", placeholder: text("Date") },
  { type: "timepicker", action_id: "l", placeholder: text("Time") },
];

const inputs = [
  { type: "email_text_input", action_id: "m" },
  { type: "number_input", is_decimal_allowed: false, action_id: "n" },
  { type: "url_text_input", action_id: "o" },
].map((element) => ({ type: "input", label: text("Label"), element }));

const carousel = {
  type: "carousel",
  elements: [1, 2, 3, 4].map((i) => ({ type: "card", title: text(`Card ${i}`) })),
};

test("pickers, input placeholders and carousel arrows centre without a translate transform", () => {
  const out = render([{ type: "actions", elements }, ...inputs, carousel]);

  assert.doesNotMatch(out, /translate-/);
  assert.equal((out.match(/absolute right-1 inset-y-0 flex/g) || []).length, 10);
  assert.equal((out.match(/absolute left-2 inset-y-0 flex items-center/g) || []).length, 5);
});

for (const [type, initial] of [
  ["datepicker", { initial_date: "2026-11-03" }],
  ["timepicker", { initial_time: "09:30" }],
]) {
  test(`${type} hides the native field text behind its placeholder only while empty`, () => {
    const empty = render([
      { type: "actions", elements: [{ type, action_id: "x", placeholder: text("Pick one") }] },
    ]);
    assert.match(empty, /Pick one/);
    assert.match(empty, /<input[^>]*class="[^"]*text-transparent/);

    const filled = render([
      {
        type: "actions",
        elements: [{ type, action_id: "x", placeholder: text("Pick one"), ...initial }],
      },
    ]);
    assert.doesNotMatch(filled, /Pick one/);
    assert.doesNotMatch(filled, /text-transparent/);
    assert.match(filled, /<input[^>]*class="[^"]*text-black-primary/);
  });
}
