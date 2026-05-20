// Slack escapes literal `&`, `<`, `>` in user-typed text as `&amp;`, `&lt;`, `&gt;` before the
// mrkdwn payload reaches us. We MUST decode them for display, but only at render time —
// decoding earlier would let escaped sequences like `&lt;@U123&gt;` (which a user typed
// literally) get tokenized as a real `<@U123>` user mention. Slack's own renderer behaves the
// same way: it tokenizes the raw payload first and decodes entities only when emitting text.
//
// Order matters: decode `&lt;` and `&gt;` first, then `&amp;`. If a literal `&gt;` was itself
// escaped (it arrives as `&amp;gt;`), this order keeps it as `&gt;` instead of double-decoding
// to `>`.
export const decodeEntities = (s: string): string =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
