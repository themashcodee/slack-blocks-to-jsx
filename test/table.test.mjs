// The `table` block accepts raw_text, raw_number and rich_text cells. These tests render a table
// with each cell type and lock in how raw_number cells display. Run against the built dist/ (CI
// builds first).

import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Message } from "../dist/index.mjs";

const render = (blocks) =>
  ReactDOMServer.renderToStaticMarkup(
    React.createElement(Message, { logo: "logo.png", name: "Tester", theme: "light", blocks }),
  );

const cells = (html) =>
  [...html.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(([, cell]) =>
    cell.replace(/<[^>]+>/g, ""),
  );

test("raw_number cells show their text when present, otherwise the formatted value", () => {
  const html = render([
    {
      type: "table",
      rows: [
        [
          { type: "raw_text", text: "Deal" },
          { type: "raw_text", text: "Amount" },
          { type: "raw_text", text: "Seats" },
        ],
        [
          { type: "raw_text", text: "Acme" },
          { type: "raw_number", value: 1200000, text: "$1.2M" },
          { type: "raw_number", value: 1234.5 },
        ],
      ],
    },
  ]);

  assert.deepEqual(cells(html), ["Deal", "Amount", "Seats", "Acme", "$1.2M", "1,234.5"]);
});

test("raw_number cells render alongside rich_text cells", () => {
  const html = render([
    {
      type: "table",
      rows: [
        [
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [{ type: "text", text: "Total", style: { bold: true } }],
              },
            ],
          },
          { type: "raw_number", value: 0 },
        ],
      ],
    },
  ]);

  assert.deepEqual(cells(html), ["Total", "0"]);
});
