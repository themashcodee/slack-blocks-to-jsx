---
"slack-blocks-to-jsx": patch
---

Resolve Slack directive atoms (`<@U…>`, `<#C…>`, `<!subteam^…>`, `<!channel|here|everyone>`, `<!date^…>`) in `section`/`mrkdwn` text and other mrkdwn-typed text. Directives now fire the same hooks as the `rich_text` path. `verbatim: true` matches Slack's empirical behavior — it suppresses bare-form `@here` / `@channel` / `@everyone` interpolation but is otherwise a no-op (markdown sugar, code spans, angle-bracket URLs, and structured `<!…>` directives all render the same in both modes). `&amp;` is now decoded alongside `&gt;` / `&lt;` so escaped ampersands don't leak into hrefs or visible text.
