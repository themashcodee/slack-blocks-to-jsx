// U+E000 / U+E001 sit in the Unicode Private Use Area, so they can't occur in a Slack mrkdwn
// payload — which makes them unambiguous placeholder delimiters.
//
// They are built with String.fromCharCode rather than written as literals or `\u` escapes on
// purpose: both of those forms render as invisible glyphs in most editors and diff viewers, and
// an earlier revision of this file lost them entirely to copy/paste. When they go missing,
// PLACEHOLDER_PATTERN silently degrades to /([0-9a-z]+)/g and matches every lowercase word in
// the message, so restore() swaps real words for masked tokens — `<@U1><@U2>` collapses to
// `<@U2>`, and with 11+ masked regions the word "a" becomes token 10. Keeping the source pure
// ASCII means that failure can't happen again. See __tests__/directives.test.tsx.
const PLACEHOLDER_OPEN = String.fromCharCode(0xe000);
const PLACEHOLDER_CLOSE = String.fromCharCode(0xe001);
const PLACEHOLDER_PATTERN = new RegExp(`${PLACEHOLDER_OPEN}([0-9a-z]+)${PLACEHOLDER_CLOSE}`, "g");

// Belt and braces: strip any pre-existing sentinels from the input so a payload can't forge a
// placeholder and trick restore() into emitting a token it never masked.
const SENTINELS = new RegExp(`[${PLACEHOLDER_OPEN}${PLACEHOLDER_CLOSE}]`, "g");

const FENCED_CODE = /```\n[\s\S]*?\n```/g;
const INLINE_CODE = /`[^`\n]+`/g;

// Slack-formed directive atoms. Pre-masked before the URL-rewrite regex pass so it cannot
// mangle their interiors (defense in depth: `isValidURL` happens to leave directives alone
// today, but the protection is incidental, not deliberate).
const DIRECTIVE_USER = /<@[^|>\s]+(?:\|[^>]*)?>/;
const DIRECTIVE_CHANNEL = /<#[^|>\s]+(?:\|[^>]*)?>/;
const DIRECTIVE_USERGROUP = /<!subteam\^[^|>\s]+(?:\|[^>]*)?>/;
const DIRECTIVE_BROADCAST = /<!(?:here|channel|everyone)>/;
const DIRECTIVE_DATE = /<!date\^[^>]+>/;

const DIRECTIVE_PATTERN_GLOBAL = new RegExp(
  [
    DIRECTIVE_USER.source,
    DIRECTIVE_CHANNEL.source,
    DIRECTIVE_USERGROUP.source,
    DIRECTIVE_BROADCAST.source,
    DIRECTIVE_DATE.source,
  ].join("|"),
  "g",
);

type Mask = {
  masked: string;
  restore: (input: string) => string;
};

const createMask = (input: string, patterns: RegExp[]): Mask => {
  const tokens: string[] = [];
  let masked = input.replace(SENTINELS, "");
  for (const pattern of patterns) {
    masked = masked.replace(pattern, (match) => {
      const id = tokens.length.toString(36);
      tokens.push(match);
      return `${PLACEHOLDER_OPEN}${id}${PLACEHOLDER_CLOSE}`;
    });
  }
  return {
    masked,
    restore: (s) =>
      s.replace(PLACEHOLDER_PATTERN, (full, id) => {
        const idx = parseInt(id, 36);
        return tokens[idx] ?? full;
      }),
  };
};

export const maskProtectedRegions = (input: string): Mask =>
  createMask(input, [FENCED_CODE, INLINE_CODE, DIRECTIVE_PATTERN_GLOBAL]);
