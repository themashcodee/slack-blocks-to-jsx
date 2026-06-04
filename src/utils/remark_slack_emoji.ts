// A remark (mdast) plugin used only by the `markdown` block.
//
// Every other block type renders through the library's mrkdwn parser
// (utils/markdown_parser), which has a `slack_emoji` tokenizer rule. The
// `markdown` block instead renders through react-markdown + remark-gfm, and that
// pipeline has no emoji rule — so `:shortcode:` would otherwise show up as
// literal text. This plugin splits mdast text nodes on `:shortcode:` and emits
// placeholder elements (tag name `SLACK_EMOJI_TAG`) that markdown_block.tsx maps
// back to the SAME <SlackEmoji> component the mrkdwn parser uses. Reusing that
// component means custom emoji (consumer `hooks.emoji`), standard emoji
// (shortcode -> unicode / node-emoji), aliases and skin tones all behave
// identically across every block type, with no divergent logic.
//
// `code` (fenced) and `inlineCode` are literal mdast nodes whose content lives
// in `value`, not in child `text` nodes, so they are never split here — Slack
// does not interpolate emoji inside code, and neither do we.

// Tag name emitted into the hast tree via `data.hName`. markdown_block.tsx maps
// this through react-markdown's `components` prop.
export const SLACK_EMOJI_TAG = "slack-emoji";

// Mirrors the characters accepted by the mrkdwn slack_emoji tokenizer
// (see utils/markdown_parser/tokenizers/slack_emoji/parse.ts).
const EMOJI_REGEX = /:([a-zA-Z0-9_\-+']+):/g;

// Minimal mdast typings — `@types/mdast` is not a direct dependency of this
// package, so we describe only the shape this plugin touches.
interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  } & Record<string, unknown>;
}

// Split a text node's value into alternating text / emoji nodes. Returns null
// when the value contains no emoji shortcode (so the original node is kept).
function splitOnEmoji(value: string): MdastNode[] | null {
  EMOJI_REGEX.lastIndex = 0;
  let match = EMOJI_REGEX.exec(value);
  if (!match) return null;

  const nodes: MdastNode[] = [];
  let lastIndex = 0;

  while (match) {
    const full = match[0] ?? "";
    const name = match[1] ?? "";
    const start = match.index;

    if (start > lastIndex) {
      nodes.push({ type: "text", value: value.slice(lastIndex, start) });
    }

    nodes.push({
      type: "slackEmoji",
      value: full,
      data: { hName: SLACK_EMOJI_TAG, hProperties: { name } },
    });

    lastIndex = start + full.length;
    match = EMOJI_REGEX.exec(value);
  }

  if (lastIndex < value.length) {
    nodes.push({ type: "text", value: value.slice(lastIndex) });
  }

  return nodes;
}

function transform(node: MdastNode): void {
  const children = node.children;
  if (!children) return;

  const next: MdastNode[] = [];
  for (const child of children) {
    // Never interpolate emoji inside code spans / fenced code blocks.
    if (child.type === "code" || child.type === "inlineCode") {
      next.push(child);
      continue;
    }

    if (child.type === "text" && child.value) {
      const replacement = splitOnEmoji(child.value);
      if (replacement) {
        next.push(...replacement);
        continue;
      }
    }

    transform(child);
    next.push(child);
  }

  node.children = next;
}

export function remarkSlackEmoji() {
  return (tree: MdastNode): void => {
    transform(tree);
  };
}
