// The `data_visualization` block renders Slack's pie / bar / area / line charts.
// Slack draws these with ECharts → SVG; this library hand-rolls lightweight inline
// SVG instead (no charting dependency). These tests render the exact JSON fixtures
// from the Block Kit examples and lock in the title (<h3>), the accessible
// aria-label patterns, the legend, axis labels, negative-value handling, the pie
// percentages, and the chart action buttons. Run against the built dist/ via Node's
// built-in runner (CI builds before testing).

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

const lineMulti = {
  type: "data_visualization",
  block_id: "viz-line-multi",
  title: "Weekly active users by platform",
  chart: {
    type: "line",
    series: [
      {
        name: "Desktop",
        data: [
          { label: "Mon", value: 800 },
          { label: "Tue", value: 920 },
          { label: "Wed", value: 880 },
          { label: "Thu", value: 1010 },
          { label: "Fri", value: 1120 },
        ],
      },
      {
        name: "Mobile",
        data: [
          { label: "Mon", value: 400 },
          { label: "Tue", value: 530 },
          { label: "Wed", value: 500 },
          { label: "Thu", value: 590 },
          { label: "Fri", value: 600 },
        ],
      },
    ],
    axis_config: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri"], x_label: "Day", y_label: "Users" },
  },
};

const barNegative = {
  type: "data_visualization",
  block_id: "viz-bar-negative",
  title: "Net headcount change",
  chart: {
    type: "bar",
    series: [
      {
        name: "Delta",
        data: [
          { label: "Mon", value: 4 },
          { label: "Tue", value: -2 },
          { label: "Wed", value: 6 },
          { label: "Thu", value: -1 },
          { label: "Fri", value: 3 },
        ],
      },
    ],
    axis_config: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri"], x_label: "Day", y_label: "People (delta)" },
  },
};

const areaMulti = {
  type: "data_visualization",
  block_id: "viz-area-multi",
  title: "Concurrent users by platform",
  chart: {
    type: "area",
    series: [
      {
        name: "Desktop",
        data: [
          { label: "Mon", value: 2800 },
          { label: "Tue", value: 3000 },
          { label: "Wed", value: 3400 },
          { label: "Thu", value: 3200 },
          { label: "Fri", value: 3500 },
        ],
      },
      {
        name: "Mobile",
        data: [
          { label: "Mon", value: 1400 },
          { label: "Tue", value: 1500 },
          { label: "Wed", value: 1700 },
          { label: "Thu", value: 1600 },
          { label: "Fri", value: 1800 },
        ],
      },
    ],
    axis_config: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri"], x_label: "Day", y_label: "Users" },
  },
};

const pieMulti = {
  type: "data_visualization",
  block_id: "viz-pie-multi",
  title: "Plan distribution by tier",
  chart: {
    type: "pie",
    segments: [
      { label: "Free", value: 4200 },
      { label: "Pro", value: 2300 },
      { label: "Business+", value: 1100 },
      { label: "Enterprise", value: 480 },
    ],
  },
};

test("line chart: title is an <h3>, with an accessible aria-label and an SVG", () => {
  const out = render([lineMulti]);
  assert.match(out, /<h3[^>]*>Weekly active users by platform<\/h3>/);
  assert.match(out, /<svg[^>]*role="img"/);
  assert.match(
    out,
    /aria-label="Line chart: Weekly active users by platform\. The X axis is Day, the Y axis is Users\. There are 2 series: Desktop and Mobile\."/,
  );
});

test("line chart: axis labels and category ticks render as SVG text", () => {
  const out = render([lineMulti]);
  // axis titles
  assert.match(out, />Day</);
  assert.match(out, />Users</);
  // a couple of category labels
  assert.match(out, />Mon</);
  assert.match(out, />Fri</);
  // legend carries both series names
  assert.match(out, /slack_blocks_to_jsx__data_visualization_legend/);
  assert.match(out, />Desktop</);
  assert.match(out, />Mobile</);
});

test("bar chart: single-series phrasing and negative values both render", () => {
  const out = render([barNegative]);
  assert.match(
    out,
    /aria-label="Bar chart: Net headcount change\. The X axis is Day, the Y axis is People \(delta\)\. There is 1 series: Delta\."/,
  );
  // bars are <rect>s; a negative-aware domain means a zero baseline tick (0) is present
  assert.match(out, /<rect/);
  assert.match(out, />0</);
});

test("area chart: aria-label uses the Area phrasing", () => {
  const out = render([areaMulti]);
  assert.match(
    out,
    /aria-label="Area chart: Concurrent users by platform\. The X axis is Day, the Y axis is Users\. There are 2 series: Desktop and Mobile\."/,
  );
  assert.match(out, /<path/);
});

test("line and area charts render smooth (curved) paths", () => {
  // monotone-cubic interpolation emits cubic bézier (C) commands rather than straight L segments
  assert.match(render([lineMulti]), /<path[^>]*d="M[^"]* C /);
  assert.match(render([areaMulti]), /<path[^>]*d="M[^"]* C /);
});

test("pie chart: aria-label lists segments with percentages summing to 100", () => {
  const out = render([pieMulti]);
  assert.match(
    out,
    /aria-label="Pie chart: Plan distribution by tier, with 4 segments\. Segments: Free \(52%\), Pro \(28%\), Business\+ \(14%\), and Enterprise \(6%\)\."/,
  );
  // pie slices are <path>s; legend shows the computed percentages
  assert.match(out, /Free · 52%/);
  assert.match(out, /Enterprise · 6%/);
});

test("every chart exposes the View-as-table and Download actions", () => {
  const out = render([lineMulti]);
  assert.match(out, /aria-label="View as table"/);
  assert.match(out, /aria-label="Download chart data"/);
});

test("block_id is applied as the container id", () => {
  const out = render([pieMulti]);
  assert.match(out, /id="viz-pie-multi"/);
});

test("a chart with no usable data renders nothing rather than crashing", () => {
  const empty = { type: "data_visualization", title: "Empty", chart: { type: "line", series: [] } };
  const out = render([empty]);
  assert.doesNotMatch(out, /<svg/);
  assert.doesNotMatch(out, /Empty/);
});
