// The `data_table` block is a rich, paginated, sortable table. These tests render the Block Kit
// docs example and lock in the caption, column and row header semantics, raw_number display,
// action_cell buttons, and pagination. Sorting and paging are client-side, so those tests mount
// into a happy-dom document and click the controls. Run against the built dist/ (CI builds first).

import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import ReactDOMServer from "react-dom/server";
import { createRoot } from "react-dom/client";
import { Window } from "happy-dom";
import { Message } from "../dist/index.mjs";

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const messageProps = (blocks) => ({ logo: "logo.png", name: "Tester", theme: "light", blocks });

const render = (blocks) =>
  ReactDOMServer.renderToStaticMarkup(React.createElement(Message, messageProps(blocks)));

const mount = async (blocks) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => root.render(React.createElement(Message, messageProps(blocks))));
  return container;
};

const click = (element) => act(async () => element.click());

const text = (value) => ({ type: "raw_text", text: value });
const number = (value, display) => ({
  type: "raw_number",
  value,
  ...(display ? { text: display } : {}),
});
const richText = (value, style) => ({
  type: "rich_text",
  elements: [
    {
      type: "rich_text_section",
      elements: [{ type: "text", text: value, ...(style && { style }) }],
    },
  ],
});

const docsExample = {
  type: "data_table",
  block_id: "docs-example",
  caption: "A Fabulous Table",
  rows: [
    [text("Name"), text("Department"), text("Badge")],
    [text("Data Refinement Department"), text("MDR"), richText("Blue", { bold: true })],
    [text("Art Sourcing Department"), text("O&D"), richText("Green")],
    [text("Wellness Department"), text("Wellness Center"), richText("Limited", { bold: true })],
  ],
};

const twelveRows = (pageSize) => ({
  type: "data_table",
  caption: "Tickets",
  ...(pageSize ? { page_size: pageSize } : {}),
  rows: [
    [text("Ticket"), text("Points")],
    ...Array.from({ length: 12 }, (_, i) => [text(`T-${i + 1}`), number(i + 1)]),
  ],
});

const bodyColumn = (container, column = 0) =>
  [...container.querySelectorAll("tbody tr")].map((tr) => tr.children[column].textContent);

const button = (container, label) =>
  [...container.querySelectorAll("button")].find(
    (b) => b.getAttribute("aria-label") === label || b.textContent === label,
  );

const indicator = (container) =>
  container.querySelector(".slack_blocks_to_jsx__data_table_pagination span").textContent;

test("caption and header row render as an accessible table", () => {
  const out = render([docsExample]);
  assert.match(out, /<caption[^>]*>A Fabulous Table<\/caption>/);
  assert.equal(out.match(/<th scope="col"/g).length, 3);
  assert.match(out, /<thead>.*Name.*Department.*Badge.*<\/thead>/);
  assert.match(out, /id="docs-example"/);
  assert.match(out, /Data Refinement Department/);
  assert.match(out, /font-semibold">Blue</);
});

test("row_header_column_index marks that column as the row header", () => {
  const out = render([docsExample]);
  assert.equal(out.match(/<th scope="row"/g).length, 3);
  assert.match(out, /<th scope="row"[^>]*><div><div><p><span><span>Data Refinement Department/);

  const second = render([{ ...docsExample, row_header_column_index: 1 }]);
  assert.match(second, /<th scope="row"[^>]*><div><div><p><span><span>MDR/);
  assert.doesNotMatch(second, /<th scope="row"[^>]*><div><div><p><span><span>Data Refinement/);
});

test("raw_number shows its text when present, otherwise the formatted value", () => {
  const out = render([
    {
      type: "data_table",
      caption: "Deals",
      rows: [
        [text("Deal"), text("Amount")],
        [text("Acme"), number(1200000, "$1.2M")],
        [text("Nimbus"), number(1234.5)],
      ],
    },
  ]);
  assert.match(out, />\$1\.2M</);
  assert.doesNotMatch(out, /1,200,000/);
  assert.match(out, />1,234\.5</);
});

test("action_cell renders the existing button element", () => {
  const out = render([
    {
      type: "data_table",
      caption: "Tasks",
      rows: [
        [text("Task"), text("Action")],
        [
          text("Write docs"),
          {
            type: "action_cell",
            element: {
              type: "button",
              text: { type: "plain_text", text: "Mark done" },
              action_id: "mark_done",
              value: "task_123",
              style: "primary",
            },
            fallback: text("Open"),
          },
        ],
      ],
    },
  ]);
  assert.match(
    out,
    /<button type="button" id="mark_done" class="[^"]*slack_blocks_to_jsx__button_element[^"]*bg-green-primary[^"]*">(?:(?!<\/button>).)*Mark done/,
  );
  assert.doesNotMatch(out, />Open</);
});

test("pagination shows page_size rows (default 5) and hides controls for a single page", () => {
  const defaults = render([twelveRows()]);
  assert.equal(defaults.match(/<th scope="row"/g).length, 5);
  assert.match(defaults, /1–5 of 12/);
  assert.match(defaults, /aria-label="Previous page" disabled=""/);

  const custom = render([twelveRows(10)]);
  assert.equal(custom.match(/<th scope="row"/g).length, 10);
  assert.match(custom, /1–10 of 12/);

  const single = render([docsExample]);
  assert.doesNotMatch(single, /slack_blocks_to_jsx__data_table_pagination/);
  assert.doesNotMatch(single, /Next page/);
});

test("next and previous move between pages", async () => {
  const container = await mount([twelveRows()]);
  assert.deepEqual(bodyColumn(container), ["T-1", "T-2", "T-3", "T-4", "T-5"]);

  await click(button(container, "Next page"));
  assert.deepEqual(bodyColumn(container), ["T-6", "T-7", "T-8", "T-9", "T-10"]);
  assert.equal(indicator(container), "6–10 of 12");
  assert.equal(button(container, "Previous page").disabled, false);

  await click(button(container, "Next page"));
  assert.deepEqual(bodyColumn(container), ["T-11", "T-12"]);
  assert.equal(indicator(container), "11–12 of 12");
  assert.equal(button(container, "Next page").disabled, true);

  await click(button(container, "Previous page"));
  assert.equal(indicator(container), "6–10 of 12");
});

test("sorting is numeric when every cell is raw_number, otherwise alphabetical", async () => {
  const container = await mount([
    {
      type: "data_table",
      caption: "Mixed",
      rows: [
        [text("Label"), text("Score")],
        [text("100"), number(100)],
        [text("9"), number(9)],
        [text("25"), number(25)],
      ],
    },
  ]);

  await click(button(container, "Score"));
  assert.deepEqual(bodyColumn(container, 1), ["9", "25", "100"]);
  assert.equal(container.querySelectorAll("thead th")[1].getAttribute("aria-sort"), "ascending");

  await click(button(container, "Score"));
  assert.deepEqual(bodyColumn(container, 1), ["100", "25", "9"]);
  assert.equal(container.querySelectorAll("thead th")[1].getAttribute("aria-sort"), "descending");

  await click(button(container, "Label"));
  assert.deepEqual(bodyColumn(container, 0), ["100", "25", "9"]);
  assert.equal(container.querySelectorAll("thead th")[0].getAttribute("aria-sort"), "ascending");
  assert.equal(container.querySelectorAll("thead th")[1].hasAttribute("aria-sort"), false);
});

test("sorting resets to the first page", async () => {
  const container = await mount([twelveRows()]);
  await click(button(container, "Next page"));
  assert.equal(indicator(container), "6–10 of 12");

  await click(button(container, "Points"));
  await click(button(container, "Points"));
  assert.equal(indicator(container), "1–5 of 12");
  assert.deepEqual(bodyColumn(container), ["T-12", "T-11", "T-10", "T-9", "T-8"]);
});

test("a data table with no rows renders nothing", () => {
  const out = render([{ type: "data_table", caption: "Empty", rows: [] }]);
  assert.doesNotMatch(out, /slack_blocks_to_jsx__data_table/);
});
