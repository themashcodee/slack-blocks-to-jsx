// Self-contained fixtures for the playground. These live inside the playground
// folder (instead of ../test-blocks) because the library's test-blocks/ folder
// is gitignored. Keep these small and representative — the goal is "open the
// playground and immediately see every block type render", not full coverage.

export type Fixture = {
  id: string;
  label: string;
  blocks: unknown[];
};

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
    id: "markdown-emoji",
    label: "Markdown · emoji",
    blocks: [
      {
        type: "markdown",
        text: [
          "Emoji now render inside `markdown` blocks, just like in `section` blocks:",
          "",
          "- Standard: :tada: :smile: :rocket:",
          "- Aliases: :thumbsup: :hankey:",
          "- Skin tone: :wave::skin-tone-3:",
          "",
          "Inside code they stay literal — inline `:tada:` and fenced:",
          "",
          "```",
          ":no_entry: :tada:",
          "```",
        ].join("\n"),
      },
    ],
  },
];
