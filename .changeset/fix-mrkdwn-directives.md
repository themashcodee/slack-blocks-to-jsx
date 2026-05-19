---
"slack-blocks-to-jsx": patch
---

Resolve Slack directive atoms (`<@U…>`, `<#C…>`, `<!subteam^…>`, `<!channel|here|everyone>`, `<!date^…>`) in `section`/`mrkdwn` text and other mrkdwn-typed text. Directives now fire the same hooks as the rich_text path in both `verbatim: true` and `verbatim: false` modes. Code-span content stays literal (directives inside `` `…` `` or ` ```…``` ` are not resolved). `&amp;` is now decoded alongside the existing `&gt;` / `&lt;` decoding so link `href`s and visible text don't leak literal `&amp;`.
