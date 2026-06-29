const PLACEHOLDER_OPEN = "";
const PLACEHOLDER_CLOSE = "";
const PLACEHOLDER_PATTERN = new RegExp(`${PLACEHOLDER_OPEN}([0-9a-z]+)${PLACEHOLDER_CLOSE}`, "g");

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
  let masked = input;
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
