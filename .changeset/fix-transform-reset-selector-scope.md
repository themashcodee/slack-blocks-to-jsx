---
"slack-blocks-to-jsx": patch
---

Fix select dropdown chevrons (and any other `transform`-based utility) rendering with no transform applied. The Tailwind `--tw-*` variable reset was scoped to `.slack_blocks_to_jsx.styles_enabled`, while the utility classes themselves are scoped to `#slack_blocks_to_jsx` (per `tailwind.config.js#important`). When the two scopes didn't align, the variables stayed unset and the browser dropped the resulting `transform: translate( , ) rotate( ) …` declaration as invalid. The reset is now scoped to `#slack_blocks_to_jsx` so it always matches the same elements as the generated utility classes.
