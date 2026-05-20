---
"slack-blocks-to-jsx": patch
---

Resolve Slack directive atoms (`<@U…>`, `<#C…>`, `<!subteam^…>`, `<!channel|here|everyone>`, `<!date^…>`) in `section`/`mrkdwn` text and other mrkdwn-typed text. Directives now fire the same hooks as the `rich_text` path. `verbatim: true` matches Slack's empirical behavior — it suppresses bare-form `@here` / `@channel` / `@everyone` interpolation but is otherwise a no-op (markdown sugar, code spans, angle-bracket URLs, and structured `<!…>` directives all render the same in both modes). HTML entity decoding (`&lt;`, `&gt;`, `&amp;`) is deferred from input pre-processing to leaf renderers, so escaped sequences like `&lt;@U123&gt;` (user typed `<@U123>` literally) stay literal instead of being incorrectly resolved as a user mention — matching Slack's renderer.
