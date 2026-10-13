// Self-contained fixtures for the playground. These live inside the playground
// folder (instead of ../test-blocks) because the library's test-blocks/ folder
// is gitignored. Keep these small and representative — the goal is "open the
// playground and immediately see every block type render", not full coverage.

export type Fixture = {
  id: string;
  label: string;
  blocks: unknown[];
};

function rawText(text: string) {
  return { type: "raw_text", text };
}

function richText(elements: unknown[]) {
  return { type: "rich_text", elements: [{ type: "rich_text_section", elements }] };
}

function actionCell(label: string, actionId: string, value: string, style?: "primary") {
  return {
    type: "action_cell",
    element: {
      type: "button",
      text: { type: "plain_text", text: label },
      action_id: actionId,
      value,
      ...(style ? { style } : {}),
    },
    fallback: rawText(label),
  };
}

export const FIXTURES: Fixture[] = [
  {
    id: "hello",
    label: "Hello world",
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "slack-blocks-to-jsx playground" },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Edit any file in `../src/**` and this preview reloads instantly. Pick a fixture from the sidebar, or paste your own JSON in the editor on the left.",
        },
      },
      { type: "divider" },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: "*Tip:* your edits to the JSON don't require a page refresh." },
        ],
      },
    ],
  },
  {
    id: "alert-levels",
    label: "Alert · all levels",
    blocks: [
      {
        type: "alert",
        level: "default",
        text: { type: "mrkdwn", text: "Default notice. Neutral tone for general announcements." },
      },
      {
        type: "alert",
        level: "info",
        text: { type: "mrkdwn", text: "Heads up — this channel will be archived next week." },
      },
      {
        type: "alert",
        level: "warning",
        text: {
          type: "mrkdwn",
          text: "Billing cycle ends in *3 days*. Update your payment method.",
        },
      },
      {
        type: "alert",
        level: "error",
        text: {
          type: "mrkdwn",
          text: "Deploy failed — `api-gateway` build exited with code 1.",
        },
      },
      {
        type: "alert",
        level: "success",
        text: { type: "mrkdwn", text: "PR merged. :tada: Production build is green." },
      },
    ],
  },
  {
    id: "card",
    label: "Card · standalone",
    blocks: [
      {
        type: "card",
        title: { type: "plain_text", text: "Acme Pro" },
        subtitle: { type: "plain_text", text: "Everything in Free, plus unlimited seats" },
        body: {
          type: "mrkdwn",
          text: "Unlimited integrations, SSO, audit logs, and priority support. Billed annually.",
        },
        hero_image: {
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=60",
          alt_text: "Dashboard preview",
        },
        actions: [
          {
            type: "button",
            text: { type: "plain_text", text: "Start trial" },
            style: "primary",
            action_id: "trial",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Contact sales" },
            action_id: "sales",
          },
        ],
      },
    ],
  },
  {
    id: "carousel",
    label: "Carousel · pricing",
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "Choose a plan" },
      },
      {
        type: "carousel",
        elements: [
          {
            type: "card",
            title: { type: "plain_text", text: "Free" },
            subtitle: { type: "plain_text", text: "$0 / month" },
            body: { type: "mrkdwn", text: "Up to 10 users. Community support." },
            actions: [
              {
                type: "button",
                text: { type: "plain_text", text: "Get started" },
                action_id: "free",
              },
            ],
          },
          {
            type: "card",
            title: { type: "plain_text", text: "Team" },
            subtitle: { type: "plain_text", text: "$12 / user / month" },
            body: { type: "mrkdwn", text: "Unlimited integrations. Email support." },
            actions: [
              {
                type: "button",
                text: { type: "plain_text", text: "Try free" },
                style: "primary",
                action_id: "team",
              },
            ],
          },
          {
            type: "card",
            title: { type: "plain_text", text: "Enterprise" },
            subtitle: { type: "plain_text", text: "Custom pricing" },
            body: { type: "mrkdwn", text: "SSO, audit logs, dedicated CSM." },
            actions: [
              {
                type: "button",
                text: { type: "plain_text", text: "Contact sales" },
                action_id: "ent",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "layout-mix",
    label: "Layout mix",
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "Release notes · v2.4" },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*What's new:* carousel, card, and alert blocks landed. Check the #changelog for details.",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View changelog" },
            url: "https://example.com/changelog",
            action_id: "changelog",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Report issue" },
            style: "danger",
            action_id: "report",
          },
        ],
      },
      { type: "divider" },
      {
        type: "context",
        elements: [
          {
            type: "image",
            image_url:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=60",
            alt_text: "avatar",
          },
          { type: "mrkdwn", text: "Posted by <@U012345> · 5 min ago" },
        ],
      },
    ],
  },
  {
    id: "markdown-block",
    label: "Markdown block",
    blocks: [
      {
        type: "markdown",
        text: [
          "## :rocket: Deploy — api v2.4.0",
          "",
          "Out to production :tada: Thanks for the reviews this week :clap::skin-tone-3:",
          "",
          "**What changed**",
          "",
          "- Carousel and card blocks :sparkles:",
          "- Faster cold starts :zap:",
          "- Dark mode contrast fixes :bug:",
          "",
          "**Rollout checklist**",
          "",
          "- [x] Migrations applied",
          "- [x] Smoke tests passing :white_check_mark:",
          "- [ ] Changelog updated :thumbsup:",
          "",
          "Roll back with `kubectl rollout undo deploy/api` if error rates spike :warning:",
          "",
          "```bash",
          "curl -s https://api.example.com/healthz | jq .status",
          "```",
        ].join("\n"),
      },
    ],
  },
  {
    id: "data-visualization",
    label: "Data visualization · charts",
    blocks: [
      {
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
          axis_config: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            x_label: "Day",
            y_label: "Users",
          },
        },
      },
      {
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
          axis_config: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            x_label: "Day",
            y_label: "People (delta)",
          },
        },
      },
      {
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
          axis_config: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            x_label: "Day",
            y_label: "Users",
          },
        },
      },
      {
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
      },
    ],
  },
  {
    id: "data-table",
    label: "Data table · sort + pages",
    blocks: [
      {
        type: "data_table",
        block_id: "data-table-docs",
        caption: "A Fabulous Table",
        rows: [
          [rawText("Name"), rawText("Department"), rawText("Badge")],
          [
            rawText("Data Refinement Department"),
            rawText("MDR"),
            richText([{ type: "text", text: "Blue", style: { bold: true } }]),
          ],
          [
            rawText("Art Sourcing Department"),
            rawText("O&D"),
            richText([
              { type: "text", text: "Green" },
              { type: "text", text: "review", style: { italic: true } },
            ]),
          ],
          [
            rawText("Wellness Department"),
            rawText("Wellness Center"),
            richText([{ type: "text", text: "Limited", style: { bold: true } }]),
          ],
        ],
      },
      {
        type: "data_table",
        block_id: "data-table-deals",
        caption: "Open deals",
        page_size: 5,
        rows: [
          [rawText("Deal"), rawText("Amount"), rawText("Seats"), rawText("Action")],
          ...(
            [
              ["Acme Expansion Deal", 1200000, "$1.2M", 450],
              ["Weather Forecast Integration", 85000, "$85K", 40],
              ["Retail Partner Portal", 310000, "$310K", 120],
              ["Sustainable Materials Sourcing", 42000, "$42K", 15],
              ["Global Distribution Network", 2400000, "$2.4M", 900],
              ["Clinic Scheduling Pilot", 9500, "$9.5K", 8],
              ["Fleet Telemetry Rollout", 640000, "$640K", 260],
            ] as const
          ).map(([deal, amount, amountText, seats], i) => [
            rawText(deal),
            { type: "raw_number", value: amount, text: amountText },
            { type: "raw_number", value: seats },
            actionCell("Open", "open_deal", `deal_${i + 1}`, i === 0 ? "primary" : undefined),
          ]),
        ],
      },
    ],
  },
];
