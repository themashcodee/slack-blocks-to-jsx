// remark/mdast plugin for the `markdown` block (react-markdown + remark-gfm),
// which — unlike every other block type — has no emoji rule. It splits text
// nodes on `:shortcode:` into `SLACK_EMOJI_TAG` placeholders that markdown_block
// renders via the same <SlackEmoji> component the mrkdwn parser uses, so custom,
// standard, alias and skin-tone emoji all match. Code spans/blocks are never split.

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
