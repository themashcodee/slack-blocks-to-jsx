// The `layout` block arranges child blocks into rows of up to three side-by-side items. These
// tests render the Block Kit docs example and lock in the label visibility, the grid_lines
// borders, the 1:2:3 width weights, per-item alignment, recursive child rendering, and that
// `fallback` is ignored. Run against the built dist/ via Node's built-in runner (CI builds first).

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

const section = (text) => ({ type: "section", text: { type: "mrkdwn", text } });

const count = (out, pattern) => (out.match(pattern) || []).length;

const dealSummary = {
  type: "layout",
  block_id: "deal_summary_layout",
  label: "Deal summary for Borant Corp",
  is_label_visible: true,
  rows: [
    {
      items: [
        { block: section("*Stage*\nNegotiation") },
        { block: section("*Amount*\n$125,000") },
        { block: section("*Close*\n2026-08-15") },
      ],
    },
    { items: [{ block: section("*Next Steps*\nSchedule sponsor meeting") }] },
    {
      items: [
        {
          width: "narrow",
          horizontal_alignment: "end",
          block: {
            type: "actions",
            elements: [
              {
                type: "button",
                action_id: "view_sf",
                style: "primary",
                text: { type: "plain_text", text: "View in Salesforce" },
              },
            ],
          },
        },
      ],
    },
  ],
};

const withLines = (grid_lines) => ({
  type: "layout",
  label: "Lines",
  grid_lines,
  rows: [{ items: [{ block: section("row one") }] }, { items: [{ block: section("row two") }] }],
});

test("docs example: visible label, every row's child blocks, block id", () => {
  const out = render([dealSummary]);
  assert.match(out, /id="deal_summary_layout"/);
  assert.match(out, /slack_blocks_to_jsx__layout_label">Deal summary for Borant Corp</);
  assert.equal(count(out, /slack_blocks_to_jsx__layout_row"/g), 3);
  assert.equal(count(out, /slack_blocks_to_jsx__layout_item[" ]/g), 5);
  for (const text of ["Negotiation", "\\$125,000", "2026-08-15", "Schedule sponsor meeting"]) {
    assert.match(out, new RegExp(text));
  }
  assert.match(out, /<button[^>]*id="view_sf"/);
});

test("label is not rendered when is_label_visible is false or omitted", () => {
  const out = render([{ ...dealSummary, is_label_visible: false }]);
  assert.doesNotMatch(out, /layout_label/);
  assert.doesNotMatch(out, /Deal summary for Borant Corp/);

  const { is_label_visible, ...omitted } = dealSummary;
  assert.doesNotMatch(render([omitted]), /Deal summary for Borant Corp/);
});

test("grid_lines: none has no borders, outer has only the outer border, rows adds dividers", () => {
  const none = render([withLines(undefined)]);
  assert.doesNotMatch(none, /layout_grid[^"]*border|border[^"]*layout_grid/);
  assert.doesNotMatch(none, /border-t/);

  const outer = render([withLines("outer")]);
  assert.match(outer, /slack_blocks_to_jsx__layout_grid[^"]*rounded-lg border /);
  assert.doesNotMatch(outer, /border-t/);

  const rows = render([withLines("rows")]);
  assert.match(rows, /slack_blocks_to_jsx__layout_grid[^"]*rounded-lg border /);
  // one divider between the two rows, none above the first
  assert.equal(count(rows, /layout_row[^"]*border-t/g), 1);
});

test("widths weight a row 1:2:3 (standard by default) with a minimum per width", () => {
  const out = render([
    {
      type: "layout",
      label: "Widths",
      rows: [
        {
          items: [
            { width: "narrow", block: section("a") },
            { block: section("b") },
            { width: "wide", block: section("c") },
          ],
        },
      ],
    },
  ]);
  const grows = [...out.matchAll(/style="flex-grow:(\d);flex-shrink:1;min-width:(\d+)px"/g)].map(
    (m) => [Number(m[1]), Number(m[2])],
  );
  assert.equal(grows.length, 3);
  assert.deepEqual(
    grows.map(([grow]) => grow),
    [1, 2, 3],
  );
  assert.ok(grows[0][1] < grows[1][1] && grows[1][1] < grows[2][1]);
});

test("horizontal_alignment positions the content; omitted alignment fills the cell", () => {
  const out = render([
    {
      type: "layout",
      label: "Alignment",
      rows: [
        {
          items: [
            { horizontal_alignment: "start", block: section("s") },
            { horizontal_alignment: "center", block: section("c") },
            { horizontal_alignment: "end", block: section("e") },
            { block: section("fill") },
          ],
        },
      ],
    },
  ]);
  assert.match(out, /slack_blocks_to_jsx__layout_item items-start/);
  assert.match(out, /slack_blocks_to_jsx__layout_item items-center/);
  assert.match(out, /slack_blocks_to_jsx__layout_item items-end/);
  assert.equal(count(out, /layout_item_content w-fit/g), 3);
  assert.equal(count(out, /layout_item_content w-full/g), 1);
});

test("child blocks render recursively, including a container nested in an item", () => {
  const out = render([
    {
      type: "layout",
      label: "Nested",
      rows: [
        {
          items: [
            {
              block: {
                type: "container",
                title: { type: "plain_text", text: "Inner container" },
                child_blocks: [section("inside the container")],
              },
            },
            { block: { type: "divider" } },
          ],
        },
      ],
    },
  ]);
  assert.match(out, /role="group" aria-label="Inner container"/);
  assert.match(out, /inside the container/);
  assert.match(out, /slack_blocks_to_jsx__divider/);
});

test("fallback blocks are not rendered, and the layout adds no grid or table semantics", () => {
  const out = render([
    {
      ...dealSummary,
      fallback: [section("FALLBACK ONLY")],
    },
  ]);
  assert.doesNotMatch(out, /FALLBACK ONLY/);
  assert.doesNotMatch(out, /role="(grid|table|row|gridcell|group)"/);
});
