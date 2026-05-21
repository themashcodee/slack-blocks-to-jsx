# slack-blocks-to-jsx — Knowledge Base

> Book-style knowledge base for the `slack-blocks-to-jsx` React library.
> Use the index below to jump to the section you need — do **not** read linearly.
> When code or architecture changes, update the relevant chapter here in the same PR.

---

## Table of Contents

| Ch. | Section                                                                | Topic                                                   |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| 0   | [§0](#chapter-0--how-to-use-this-knowledge-base)                       | **How to use this knowledge base**                      |
| 0   | [§0.1](#01-what-this-document-is)                                      | What this document is                                   |
| 0   | [§0.2](#02-how-to-read-it-effectively)                                 | How to read it effectively                              |
| 0   | [§0.3](#03-when-to-update-it)                                          | When to update it                                       |
| 0   | [§0.4](#04-how-to-update-it)                                           | How to update it                                        |
| 0   | [§0.5](#05-style-rules)                                                | Style rules                                             |
| 0   | [§0.6](#06-who-maintains-this)                                         | Who maintains this                                      |
| 1   | [§1](#chapter-1--overview)                                             | Overview, identity, links                               |
| 1   | [§1.1](#11-package-identity)                                           | Package identity                                        |
| 1   | [§1.2](#12-what-it-does)                                               | What it does                                            |
| 1   | [§1.3](#13-repo--publish-links)                                        | Repo and publish links                                  |
| 2   | [§2](#chapter-2--installation--runtime-requirements)                   | Installation & runtime requirements                     |
| 2   | [§2.1](#21-install-command)                                            | Install command                                         |
| 2   | [§2.2](#22-peer-dependencies)                                          | Peer dependencies                                       |
| 2   | [§2.3](#23-runtime-dependencies)                                       | Runtime dependencies                                    |
| 2   | [§2.4](#24-css-import-requirement)                                     | CSS import requirement                                  |
| 3   | [§3](#chapter-3--public-api)                                           | Public API                                              |
| 3   | [§3.1](#31-exports-from-srcindexts)                                    | Exports from `src/index.ts`                             |
| 3   | [§3.2](#32-message-component-props)                                    | `Message` component props                               |
| 3   | [§3.3](#33-header-component)                                           | `Header` component                                      |
| 3   | [§3.4](#34-blockwrapper-component)                                     | `BlockWrapper` component                                |
| 3   | [§3.5](#35-component-dispatcher)                                       | Component dispatcher                                    |
| 4   | [§4](#chapter-4--blocks-reference)                                     | Blocks reference                                        |
| 4   | [§4.1](#41-layout--structure-blocks)                                   | Layout & structure blocks (section, divider, header)    |
| 4   | [§4.2](#42-media-blocks)                                               | Media blocks (image, video, file)                       |
| 4   | [§4.3](#43-interactive-blocks)                                         | Interactive blocks (actions, input, context_actions)    |
| 4   | [§4.4](#44-content-blocks)                                             | Content blocks (context, table, markdown)               |
| 4   | [§4.5](#45-ai-workflow-blocks)                                         | AI/workflow blocks (plan, task_card)                    |
| 4   | [§4.6](#46-status--rich-container-blocks-added-v110--slack-2026-04-16) | Status & rich-container blocks (alert, card, carousel)  |
| 4   | [§4.7](#47-rich-text-block)                                            | Rich text block (deep dive)                             |
| 5   | [§5](#chapter-5--elements-reference)                                   | Elements reference                                      |
| 5   | [§5.1](#51-button-family)                                              | Button family (button, workflow_button)                 |
| 5   | [§5.2](#52-single-select-menus)                                        | Single-select menus                                     |
| 5   | [§5.3](#53-multi-select-menus)                                         | Multi-select menus                                      |
| 5   | [§5.4](#54-choice-elements)                                            | Choice elements (radio_buttons, checkboxes)             |
| 5   | [§5.5](#55-text--input-elements)                                       | Text & input elements                                   |
| 5   | [§5.6](#56-date--time-pickers)                                         | Date & time pickers                                     |
| 5   | [§5.7](#57-file-upload--rich-text-input)                               | File upload & rich text input                           |
| 5   | [§5.8](#58-display-elements)                                           | Display elements (image, overflow, feedback, icon, url) |
| 6   | [§6](#chapter-6--type-system)                                          | Type system                                             |
| 6   | [§6.1](#61-typeslayoutts)                                              | `types/layout.ts` — block union                         |
| 6   | [§6.2](#62-typeselementsts)                                            | `types/elements.ts` — element union                     |
| 6   | [§6.3](#63-typesobjectsts)                                             | `types/objects.ts` — composition objects                |
| 6   | [§6.4](#64-typesrich_text_elementts)                                   | `types/rich_text_element.ts`                            |
| 7   | [§7](#chapter-7--state--render-hooks)                                  | State & render hooks                                    |
| 7   | [§7.1](#71-data-prop-users-channels-usergroups)                        | `data` prop                                             |
| 7   | [§7.2](#72-hooks-prop-custom-renderers)                                | `hooks` prop                                            |
| 7   | [§7.3](#73-useglobaldata-hook)                                         | `useGlobalData` internal hook                           |
| 8   | [§8](#chapter-8--rendering-pipeline)                                   | Rendering pipeline                                      |
| 8   | [§8.1](#81-dispatcher-flow)                                            | Dispatcher flow                                         |
| 8   | [§8.2](#82-markdown-parser)                                            | Markdown parser (Yozora + custom Slack tokenizers)      |
| 8   | [§8.3](#83-emoji-parser)                                               | Emoji parser                                            |
| 8   | [§8.4](#84-composition-objects)                                        | Composition objects (text, confirm_dialog)              |
| 9   | [§9](#chapter-9--styling)                                              | Styling                                                 |
| 9   | [§9.1](#91-tailwind-scope)                                             | Tailwind scope                                          |
| 9   | [§9.2](#92-dark-mode)                                                  | Dark mode                                               |
| 9   | [§9.3](#93-css-build-pipeline)                                         | CSS build pipeline                                      |
| 10  | [§10](#chapter-10--build--distribution)                                | Build & distribution                                    |
| 10  | [§10.1](#101-tsup-config)                                              | tsup config                                             |
| 10  | [§10.2](#102-tsconfig)                                                 | tsconfig                                                |
| 10  | [§10.3](#103-scripts)                                                  | npm scripts                                             |
| 10  | [§10.4](#104-dist-output)                                              | dist/ output                                            |
| 10  | [§10.5](#105-npm-publish-hygiene)                                      | npm publish hygiene                                     |
| 11  | [§11](#chapter-11--release-process)                                    | Release process                                         |
| 12  | [§12](#chapter-12--test-fixtures)                                      | Test fixtures                                           |
| 13  | [§13](#chapter-13--complete-file-tree)                                 | Complete file tree                                      |
| 14  | [§14](#chapter-14--architectural-conventions)                          | Architectural conventions                               |
| 15  | [§15](#chapter-15--playground)                                         | Playground (contributor-only, not in npm package)       |
| 15  | [§15.1](#151-what-it-is)                                               | What it is                                              |
| 15  | [§15.2](#152-folder-layout)                                            | Folder layout                                           |
| 15  | [§15.3](#153-how-hmr-works)                                            | How HMR works                                           |
| 15  | [§15.4](#154-running-it)                                               | Running it                                              |
| 15  | [§15.5](#155-how-it-is-excluded-from-npm)                              | How it is excluded from npm                             |
| 15  | [§15.6](#156-adding-a-new-fixture)                                     | Adding a new fixture                                    |
| 16  | [§16](#chapter-16--change-log-of-this-doc)                             | Change log of this doc                                  |

---

## Chapter 0 — How to use this knowledge base

### 0.1 What this document is

A chapter-indexed field manual covering the entire `slack-blocks-to-jsx` codebase — architecture, public API, every block and element, the type system, the rendering pipeline, build tooling, and release process. It is **not** a tutorial and **not** the source of truth (the code is). It is the fastest way to answer "where does X live?" and "how does X work?" without re-reading source.

Think of it as a reference book, not a textbook. Look up, don't read through.

### 0.2 How to read it effectively

1. **Always start at the TOC.** Never scroll the body looking for a topic — use the index.
2. **Jump by anchor link.** Every TOC entry is clickable and drops you at the exact section.
3. **Read the smallest unit needed.** A section is written to stand on its own; you rarely need the surrounding chapter.
4. **Follow the cross-references.** `see §4.7` means "jump to Chapter 4, Section 7" — do that instead of searching again.
5. **Gap = signal.** If the TOC doesn't answer your question, the doc is stale. Fix it after you learn the answer from the code (see §0.3–§0.4).

Quick routing by task:

| If you're asking…                    | Go to                |
| ------------------------------------ | -------------------- |
| What file is X in?                   | Ch. 13 (file tree)   |
| What does the public API export?     | Ch. 3                |
| How is block/element X implemented?  | Ch. 4 / Ch. 5        |
| What's the type of X?                | Ch. 6                |
| How do mentions / mrkdwn get parsed? | Ch. 8 §8.2           |
| How does styling / dark mode work?   | Ch. 9                |
| How do I ship a change?              | Ch. 10 / Ch. 11      |
| What rule governs X?                 | Ch. 14 (conventions) |

### 0.3 When to update it

Update the knowledge base in the **same PR** as the code change, never in a follow-up. Treat these as mandatory triggers:

- A block or element is added, renamed, removed, or has its props changed → update Ch. 4 / Ch. 5 + Ch. 6.
- A public export is added or removed from `src/index.ts` → update Ch. 3.
- Build tooling changes (`tsup.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`) → update Ch. 9 / Ch. 10.
- Peer deps, runtime deps, Node/React target shifts → update Ch. 2.
- A file moves, is deleted, or a folder is renamed → update Ch. 13.
- The release or publish process changes → update Ch. 11.
- A new architectural rule emerges (or an existing one changes) → update Ch. 14.
- A new test fixture is added under `test-blocks/` → update Ch. 12.

If the KB and code diverge by even one commit, the KB stops being trustable. Don't let that happen.

### 0.4 How to update it

1. Find the affected chapter via the TOC (do **not** grep the whole file — use the index).
2. Edit only the relevant section. Keep style consistent with §0.5.
3. **Add** a new section if needed: give it a number (`§4.8`), add a TOC row, and match the existing anchor format (lowercase, hyphen-separated, strip punctuation).
4. If you break an existing anchor (renamed a heading), search for `§X.Y` cross-references and update them.
5. Log the change in **Ch. 15 — Change log of this doc** with: date, author, one-line summary.
6. Review the diff: TOC row, body section, change log row — all three should appear.

### 0.5 Style rules

- **Tables** for enumerations ("list of X with properties Y and Z").
- **Prose** for concepts and rationale.
- **Code blocks** for type signatures, short examples, prop shapes — never for paragraphs.
- **Backticks** for file paths, identifiers, tool names, package names.
- **Don't duplicate source.** Summarize intent and link to the file path; the code is the truth.
- **Self-contained sections.** Assume the reader lands mid-book; don't say "as we saw above" without a `§` reference.
- **Every new heading gets a TOC row.**

### 0.6 Who maintains this

Whoever makes the code change owns the KB update for that change. When Claude/Cowork is driving, I update the KB in the same turn as the code edit and log it in Ch. 15. If you ever spot KB drift, flag it and I'll reconcile.

---

## Chapter 1 — Overview

### 1.1 Package identity

| Field           | Value                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| Name            | `slack-blocks-to-jsx`                                                                                 |
| Current version | `1.0.3` (see `package.json`)                                                                          |
| License         | MIT                                                                                                   |
| Author          | Manish Panwar (`codeemash@gmail.com`)                                                                 |
| Package manager | pnpm                                                                                                  |
| Node target     | ES2016 via tsup                                                                                       |
| Keywords        | `slack`, `slack-blocks`, `slack-blocks-to-jsx`, `slack-blocks-to-react`, `slack-blocks-to-react-comp` |

### 1.2 What it does

Renders a Slack Block Kit `blocks[]` payload as React/JSX with pixel-close styling to the real Slack UI. Used to preview Slack messages, modals, and interactive surfaces inside any React app. Ships CJS, ESM, type declarations, and a single compiled CSS file.

### 1.3 Repo and publish links

- Repository: `https://github.com/themashcodee/slack-blocks-to-jsx.git`
- npm: `https://www.npmjs.com/package/slack-blocks-to-jsx`

---

## Chapter 2 — Installation & runtime requirements

### 2.1 Install command

```bash
npm install slack-blocks-to-jsx
# or
pnpm add slack-blocks-to-jsx
```

### 2.2 Peer dependencies

```jsonc
{
  "react": "^17 || ^18 || ^19",
  "react-dom": "^17 || ^18 || ^19",
}
```

`.npmrc` enables `auto-install-peers=true`. Since v1.0.1, `react-markdown` and `remark-gfm` are **externalized**, so downstream bundlers (Next.js etc.) must be able to resolve them.

### 2.3 Runtime dependencies

| Package          | Version  | Purpose                                     |
| ---------------- | -------- | ------------------------------------------- |
| `node-emoji`     | `^2.1.3` | Convert `:emoji_name:` → unicode            |
| `react-markdown` | `^9.1.0` | Renders the `markdown` block (standard GFM) |
| `remark-gfm`     | `^4.0.1` | GFM plugin for the above                    |

### 2.4 CSS import requirement

Users must import the compiled stylesheet once in their app entry:

```ts
import "slack-blocks-to-jsx/dist/style.css";
```

All classes are prefixed under `#slack_blocks_to_jsx` (see §9.1) so they do not leak.

---

## Chapter 3 — Public API

### 3.1 Exports from `src/index.ts`

```ts
export * from "./message"; // Message, MessageProps
export * from "./types"; // Block, Element, TextObject, etc.
```

Nothing else is intentionally public.

### 3.2 `Message` component props

File: `src/message.tsx`.

```ts
type MessageProps = {
  blocks: Block[];
  logo: string;
  name: string;
  time?: Date; // defaults to new Date()
  className?: string;
  style?: React.CSSProperties;
  theme?: "light" | "dark";
  showBlockKitDebug?: boolean; // shows a "Open in Block Kit Builder" link
  unstyled?: boolean; // default false; skip shipping classes
  withoutWrapper?: boolean; // skip the outer container + header
  data?: {
    users?: { id: string; name: string }[];
    channels?: { id: string; name: string }[];
    user_groups?: { id: string; name: string }[];
  };
  hooks?: GlobalStore["hooks"]; // see §7.2
};
```

Rendered DOM shape:

```html
<div id="slack_blocks_to_jsx" data-theme="light|dark">
  <header name="{name}" time="{time}" />
  <div class="slack_blocks_to_jsx--blocks">
    {blocks.map(b => <BlockWrapper>{getBlockComponent(b)}</BlockWrapper>)}
  </div>
</div>
```

### 3.3 `Header` component

File: `src/header.tsx`. Renders app name (bold) + `APP` badge + `HH:mm` timestamp.

### 3.4 `BlockWrapper` component

File: `src/block_wrapper.tsx`. Thin wrapper that sets dark-mode text color and `break-words`.

### 3.5 Component dispatcher

File: `src/components/index.tsx`.

```ts
getBlockComponent(block: Block): ReactElement | null
getElementComponent(element: Element): ReactElement | null
```

Switch on `block.type` / `element.type`. Returns `null` for unsupported types, so unknown Slack block additions won't crash — they just render nothing.

---

## Chapter 4 — Blocks reference

All block components live in `src/components/blocks/`. 17 block types are supported.

### 4.1 Layout & structure blocks

| Block     | File          | Key props                                           | Notes                                                                                 |
| --------- | ------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `section` | `section.tsx` | `text`, `fields`, `accessory`, `expand`, `block_id` | Workhorse block; accessory can stack vertically (see `utils/is_accessory_stacked.ts`) |
| `divider` | `divider.tsx` | `block_id`                                          | Horizontal rule                                                                       |
| `header`  | `header.tsx`  | `text` (plain_text, ≤150), `block_id`, `level?` (1-4) | Big bold title. `level` 1-4 maps to H1-H4 (size-distinguished); omit for legacy single-size rendering. |

### 4.2 Media blocks

| Block   | File        | Key props                                                                                                       |
| ------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `image` | `image.tsx` | `image_url` or `slack_file`, `alt_text`, `title`, `block_id`; collapsible title                                 |
| `video` | `video.tsx` | `video_url`, `thumbnail_url`, `title`, `alt_text`, `title_url`, `block_id`; collapsible; YouTube/Vimeo friendly |
| `file`  | `file.tsx`  | `external_id`, `source="remote"`, `block_id`                                                                    |

### 4.3 Interactive blocks

| Block             | File                  | Key props                                                                             |
| ----------------- | --------------------- | ------------------------------------------------------------------------------------- |
| `actions`         | `actions.tsx`         | `elements[]` (≤25) — routes to `getElementComponent` for every supported element type |
| `input`           | `input.tsx`           | `label`, `element` (any input element), `optional`, `hint`, `dispatch_action_config`  |
| `context_actions` | `context_actions.tsx` | `elements[]` (feedback/icon buttons for AI-response affordances)                      |

### 4.4 Content blocks

| Block      | File                 | Notes                                                                                                           |
| ---------- | -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `context`  | `context.tsx`        | Up to 10 mixed text + image elements                                                                            |
| `table`    | `table.tsx`          | `cells: Cell[][]`, optional `size`; cell alignment; bordered                                                    |
| `markdown` | `markdown_block.tsx` | Renders **standard** GFM via `react-markdown` + `remark-gfm`; tables, task lists, code blocks, syntax highlight |

### 4.5 AI/workflow blocks

| Block       | File            | Key props                                                                                                    |
| ----------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| `plan`      | `plan.tsx`      | `title: string`, `tasks: TaskCardBlock[]` — sequential progress UI                                           |
| `task_card` | `task_card.tsx` | `task_id`, `title`, `status: pending \| in_progress \| complete \| error`, `details?`, `output?`, `sources?` |

### 4.6 Status & rich-container blocks (added v1.1.0 — Slack 2026-04-16)

| Block      | File           | Key props                                                                                                                                                           | Notes                                                                                                                                                                                                                              |
| ---------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alert`    | `alert.tsx`    | `text: TextObject`, `level?: "default" \| "info" \| "warning" \| "error" \| "success"`, `block_id?`                                                                 | Single-line status banner. Each level gets its own icon and tinted border/background that adapts to light/dark theme. `role="status"` for screen readers. Unknown level falls back to `default`.                                   |
| `card`     | `card.tsx`     | `title?`, `subtitle?`, `body?`, `hero_image?: CardImage`, `icon?: CardImage`, `actions?: ButtonElement[]` (≤5), `block_id?`; supports `inCarousel` prop when nested | Rich container. Actions reuse the existing `ButtonElement` renderer (so `primary`/`danger` styles and `confirm` dialogs work for free). Hero image renders in a 16:9 frame above the title; icon renders inline next to the title. |
| `carousel` | `carousel.tsx` | `elements: CardBlock[]` (1–10), `block_id?`                                                                                                                         | Horizontally-scrollable gallery using CSS scroll-snap. Slides cap at 10; extra elements are dropped silently. Each slide passes `inCarousel` to the `Card` component for a fixed-width variant.                                    |

### 4.7 Rich text block

Folder: `src/components/blocks/rich_text/`. The most involved block by far.

Dispatcher: `rich_text.tsx` switches on each entry of `elements: RichTextBlockElement[]` and delegates to:

- `rich_text_section.tsx` — text elements (text, link, emoji, user, usergroup, channel, broadcast, color, preformatted)
- `rich_text_list_wrapper.tsx` — ordered/unordered lists, nesting
- `rich_text_section_color.tsx` — colored background text
- `rich_text_section_emoji.tsx` — emoji + skin tone
- `rich_text_section_link.tsx`
- `rich_text_section_user.tsx`, `..._usergroup.tsx`, `..._channel.tsx`, `..._broadcast.tsx`

Each text sub-element supports a `style: { code?, bold?, italic?, strike? }` map. Broadcasts are `@channel`, `@here`, `@everyone`.

---

## Chapter 5 — Elements reference

All element components live in `src/components/elements/`. The dispatcher is `getElementComponent`.

### 5.1 Button family

| Element           | File                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `button`          | `button_element.tsx` — `text`, `action_id`, `url`, `value`, `style: primary\|danger`, `confirm`, `accessibility_label` |
| `workflow_button` | `workflow_button_element.tsx` — triggers a Slack workflow; supports `primary`/`danger` styles                          |

### 5.2 Single-select menus

| Element                | File                               | Notes                                                                        |
| ---------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| `static_select`        | `static_select_element.tsx`        | `options[]` or `option_groups[]`, `initial_option`, `placeholder`, `confirm` |
| `external_select`      | `external_select_element.tsx`      | `min_query_length`                                                           |
| `users_select`         | `users_select_element.tsx`         | `initial_user`                                                               |
| `conversations_select` | `conversations_select_element.tsx` | `filter`, `default_to_current_conversation`                                  |
| `channels_select`      | `channels_select_element.tsx`      | `response_url_enabled`                                                       |

### 5.3 Multi-select menus

| Element                      | File                                     |
| ---------------------------- | ---------------------------------------- |
| `multi_static_select`        | `multi_static_select_element.tsx`        |
| `multi_external_select`      | `multi_external_select_element.tsx`      |
| `multi_users_select`         | `multi_users_select_element.tsx`         |
| `multi_conversations_select` | `multi_conversations_select_element.tsx` |
| `multi_channels_select`      | `multi_channels_select_element.tsx`      |

All support `max_selected_items` and `confirm`.

### 5.4 Choice elements

| Element         | File                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| `radio_buttons` | `radio_buttons_element.tsx` — `options[]`, `initial_option`, `confirm` |
| `checkboxes`    | `checkboxes_element.tsx` — `options[]`, `initial_options[]`, `confirm` |

### 5.5 Text & input elements

| Element            | File                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `plain_text_input` | `plain_text_input.tsx` — `multiline`, `min_length`, `max_length`, `dispatch_action_config` |
| `email_text_input` | `email_input_element.tsx`                                                                  |
| `url_text_input`   | `url_input_element.tsx`                                                                    |
| `number_input`     | `number_input_element.tsx` — `is_decimal_allowed`, `min_value`, `max_value`                |

### 5.6 Date & time pickers

| Element          | File                          | Value format                 |
| ---------------- | ----------------------------- | ---------------------------- |
| `datepicker`     | `date_picker_element.tsx`     | `YYYY-MM-DD`                 |
| `timepicker`     | `time_picker_element.tsx`     | `HH:mm`, optional `timezone` |
| `datetimepicker` | `datetime_picker_element.tsx` | Unix timestamp               |

These are the elements that trigger vertical stacking when used as section accessories (see `utils/is_accessory_stacked.ts`).

### 5.7 File upload & rich text input

| Element           | File                                                           |
| ----------------- | -------------------------------------------------------------- |
| `file_input`      | `file_input_element.tsx` — `filetypes[]`, `max_files`          |
| `rich_text_input` | `rich_text_input_element.tsx` — `initial_value`, `placeholder` |

### 5.8 Display elements

| Element            | File                           | Purpose                                         |
| ------------------ | ------------------------------ | ----------------------------------------------- |
| `image`            | `image_element.tsx`            | Display-only image; `image_url` or `slack_file` |
| `overflow`         | `overflow_menu_element.tsx`    | 3-dot menu, up to 5 options                     |
| `feedback_buttons` | `feedback_buttons_element.tsx` | thumbs up / down                                |
| `icon_button`      | `icon_button_element.tsx`      | small icon action (e.g. trash)                  |
| `url`              | `url_source_element.tsx`       | Clickable URL reference for task cards          |

---

## Chapter 6 — Type system

Types live in `src/types/` and are re-exported from `index.ts`.

### 6.1 `types/layout.ts`

Defines the `Block` union: `ActionsBlock | AlertBlock | CardBlock | CarouselBlock | ContextBlock | ContextActionsBlock | DividerBlock | FileBlock | HeaderBlock | ImageBlock | InputBlock | MarkdownBlock | PlanBlock | SectionBlock | TableBlock | TaskCardBlock | VideoBlock | RichTextBlock`. Each interface documents props with JSDoc pointing to Slack's official API docs.

Added in v1.1.0 to cover Slack's 2026-04-16 block launch:

- `AlertLevel = "default" | "info" | "warning" | "error" | "success"`
- `AlertBlock = { type: "alert"; text: TextObject; level?: AlertLevel; block_id? }`
- `CardImage = { image_url?: string; slack_file?: SlackFileObject; alt_text: string }` (shared helper for hero + icon)
- `CardBlock = { type: "card"; title?; subtitle?; body?; hero_image?: CardImage; icon?: CardImage; actions?: ButtonElement[]; block_id? }`
- `CarouselBlock = { type: "carousel"; elements: CardBlock[]; block_id? }`

### 6.2 `types/elements.ts`

Defines the `Element` union for all 28 interactive/display elements. Every element carries optional `action_id` and `confirm` (except display-only ones).

### 6.3 `types/objects.ts`

Composition objects:

- `TextObject<T = "plain_text" | "mrkdwn">` — `{ type, text, emoji?, verbatim? }`
- `OptionObject` — `{ text, value, description?, url? }`
- `OptionGroupObject` — `{ label, options[] }`
- `ConfirmDialogObject` — `{ title, text, confirm, deny, style? }`
- `DispatchActionConfigObject` — `{ trigger_actions_on?: ("on_enter_pressed" | "on_character_entered")[] }`
- `FilterObject` — for conversation/channel selects
- `SlackFileObject` — `{ url?: string; id?: string }`
- `TriggerObject`, `WorkflowObject` — workflow_button payloads
- `Style` — `"primary" | "danger" | "confirm"`

### 6.4 `types/rich_text_element.ts`

`RichTextBlockElement` union: `text`, `link`, `emoji`, `user`, `usergroup`, `channel`, `broadcast`, `color`, `preformatted`, `rich_text_list`, `rich_text_quote`, `rich_text_section`. Shared `Style = { code?, bold?, italic?, strike? }`.

---

## Chapter 7 — State & render hooks

State is kept in a React context defined in `src/store/useGlobalContext.tsx`.

### 7.1 `data` prop (users, channels, usergroups)

Passed through to `GlobalProvider`. Used by the mention tokenizers so `<@U123>` can render as `@manish` instead of the raw id.

```ts
data?: {
  users?:       { id: string; name: string }[]
  channels?:    { id: string; name: string }[]
  user_groups?: { id: string; name: string }[]
}
```

### 7.2 `hooks` prop (custom renderers)

Full shape:

```ts
type Hooks = {
  user?: (d: { id: string; name: string }) => ReactNode;
  channel?: (d: { id: string; name: string }) => ReactNode;
  usergroup?: (d: { id: string; name: string }) => ReactNode;
  atChannel?: (style?) => ReactNode;
  atEveryone?: (style?) => ReactNode;
  atHere?: (style?) => ReactNode;
  emoji?: (d, parse: () => ReactNode) => ReactNode;
  date?: (d) => ReactNode;
  link?: (input) => ReactNode; // the whole <a> replacement
};
```

Useful for wiring mentions to internal routing or using Next.js `<Link>` for URLs.

### 7.3 `useGlobalData` hook

Internal hook used by every component that needs access to `data` or `hooks`. Don't re-export; keep private.

---

## Chapter 8 — Rendering pipeline

### 8.1 Dispatcher flow

```
Message → GlobalProvider → for each block:
  BlockWrapper → getBlockComponent(block) → one of the blocks/*.tsx files
  Blocks that contain elements call getElementComponent(element)
  Text objects go through text_object.tsx (§8.4)
```

### 8.2 Markdown parser

Folder: `src/utils/markdown_parser/`. Built on `@yozora/parser` with six custom Slack-specific tokenizers so Slack mrkdwn renders correctly.

| Syntax         | Conversion                   |
| -------------- | ---------------------------- |
| `*text*`       | → `**text**` (bold)          |
| `_text_`       | italic                       |
| `~text~`       | → `~~text~~` (strikethrough) |
| `` `code` ``   | inline code                  |
| `<url\|label>` | → `[label](url)`             |

Custom tokenizers (each has its own folder with `match.ts`, `parse.ts`, `tokenizer.ts`, `types.ts`):

- `slack_user_mention` — `<@U123>` / `<@U123|name>`
- `slack_channel_mention` — `<#C123>` / `<#C123|name>`
- `slack_user_group_mention` — `<!subteam^G123>` / `<!subteam^G123|@name>`
- `slack_broadcast` — `<!channel>`, `<!here>`, `<!everyone>`
- `slack_date` — `<!date^ts^format|fallback>`
- `slack_emoji` — `:emoji_name:` including skin-tone variants

Output is `ReactNode` via the `elements/` and `sub_elements/` folders (Blockquote, Code, Paragraph + Delete, Emphasis, InlineCode, Link, Strong, Text, HTML, SlackUserMention, etc.).

### 8.3 Emoji parser

Folder: `src/utils/emojis/`. `parser.ts` + `list.ts`. Handles `:emoji:` resolution and skin tone modifiers (1–6). Uses `node-emoji` at runtime.

### 8.4 Composition objects

Folder: `src/components/composition_objects/`.

- `text_object.tsx` — renders `TextObject`. For `mrkdwn` runs through the markdown parser above and applies `hooks.link` to any `<a>`.
- `confirm_dialog.tsx` — modal overlay for `ConfirmDialogObject`; click-outside cancels; supports `primary` (green) / `danger` (red) styles; full dark mode.

---

## Chapter 9 — Styling

### 9.1 Tailwind scope

`tailwind.config.js` sets `important: "#slack_blocks_to_jsx"` so every utility is compiled as `#slack_blocks_to_jsx .class { … !important }`. This guarantees styles win against arbitrary host-app CSS without polluting it.

Theme extensions include Slack-accurate grays, blacks, blues, greens, reds, broadcast colors — all with dark-mode variants. Font sizes: `small: 13px`, `base: 15px`, `header: 18px`. Tailwind scans `./src/**/*.{js,ts,jsx,tsx,mdx}`.

### 9.2 Dark mode

`darkMode: ["selector", '[data-theme="dark"]']`. Toggled at runtime via the `theme` prop on `Message` which writes `data-theme="dark"` on the outer wrapper.

### 9.3 CSS build pipeline

`postcss.config.js` pipeline (in order):

1. `postcss-nesting`
2. `tailwindcss`
3. `autoprefixer`
4. `cssnano`

Input: `src/style.css`. Output: `dist/style.css` (~40 KB).

---

## Chapter 10 — Build & distribution

### 10.1 tsup config

`tsup.config.ts` compiles `src/index.ts` to CJS + ESM, generates `.d.ts`, minifies, and marks `react-markdown`, `remark-gfm`, `node-emoji` as external.

### 10.2 tsconfig

- `target: ES2016`, `module: CommonJS`, `jsx: react-jsx`
- `strict: true`, `noUncheckedIndexedAccess: true`, `skipLibCheck: true`
- `noEmit: true` (tsup emits)

### 10.3 Scripts

| Script                      | What it does                               |
| --------------------------- | ------------------------------------------ |
| `build`                     | tsup build + `build:css`                   |
| `build:css`                 | PostCSS `src/style.css` → `dist/style.css` |
| `dev`                       | tsup watch                                 |
| `dev:css`                   | PostCSS watch                              |
| `lint`                      | `tsc --noEmit`                             |
| `release`                   | `pnpm run build && changeset publish`      |
| `release-alpha-without-git` | Publish `--tag alpha --no-git-checks`      |

### 10.4 dist/ output

| File                         | Size    | Purpose                  |
| ---------------------------- | ------- | ------------------------ |
| `index.js`                   | ~556 KB | CJS bundle (minified)    |
| `index.mjs`                  | ~552 KB | ESM bundle (minified)    |
| `index.d.ts` / `index.d.mts` | ~82 KB  | TS declarations          |
| `style.css`                  | ~40 KB  | Compiled Tailwind bundle |

### 10.5 npm publish hygiene

`.npmignore` excludes: `.changeset`, `.github`, `node_modules`, `src`, `.env`, `.prettierrc`, `CHANGELOG.md`, `pnpm-lock.yaml`, `tailwind.config.js`, `tsconfig.json`, `.DS_Store`, `postcss.config.js`.

`.npmrc`: `auto-install-peers=true`.

`package.json` `exports`: `main` (CJS), `module` (ESM), `types`.

---

## Chapter 11 — Release process

From `PUBLISH_GUIDE.md`, in short:

1. Commit source changes.
2. `pnpm changeset` — pick patch / minor / major; write summary.
3. `git push origin main` — triggers GitHub Actions (`.github/workflows/`).
4. CI runs lint + build.
5. Changesets bot opens a "Version Packages" PR (bumps version, updates `CHANGELOG.md`).
6. Merge that PR → publish workflow runs `pnpm run release` → `pnpm run build && changeset publish`.

`RELEASE_NOTES.md` tells the story of v1.0.1 — the "full Block Kit parity" release — after 80+ iterative releases. Major breaking changes from that version:

- `react-markdown` + `remark-gfm` externalized (host apps must transpile them in Next.js).
- Actions block now routes **all** element types; previously silently dropped unsupported ones.
- Input block accepts all input element types; previously only `plain_text_input` and `checkboxes`.

New in 1.0.1: Context Actions, Markdown, Plan, Task Card blocks; 22 new interactive elements; confirm dialogs everywhere; dark mode via `data-theme`; GFM markdown; Slack-hosted files for images; `expand` on section.

Current version at time of writing: **1.0.3**.

---

## Chapter 12 — Test fixtures

Folder: `test-blocks/`. Used as manual/visual test inputs. Each file is a complete `blocks[]` payload.

| File                                      | Covers                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| `00-all-blocks-part1.json` / `part2.json` | Kitchen-sink of every block type                                                           |
| `01-rich-text-nested.json`                | Nested rich text formatting                                                                |
| `02-actions-confirm-dialogs.json`         | Actions + confirm modals                                                                   |
| `03-all-input-types.json`                 | All input elements                                                                         |
| `04-option-groups-multi-selects.json`     | Option groups + multi-selects                                                              |
| `05-markdown-block.json`                  | GFM markdown (tables, code, task lists)                                                    |
| `06-plan-task-cards.json`                 | Plan + task card statuses                                                                  |
| `07-context-actions-feedback.json`        | Feedback buttons                                                                           |
| `08-table-image-video.json`               | Table + image + video                                                                      |
| `09-pr-review-workflow.json`              | Workflow buttons                                                                           |
| `10-kitchen-sink.json`                    | Large combined payload                                                                     |
| `11-alert-card-carousel.json`             | All 5 alert levels, card (hero + icon + actions), standalone card, 3-card pricing carousel |
| `slack-safe-part1.json`                   | Compatibility fixture                                                                      |

---

## Chapter 13 — Complete file tree

```
slack blocks to jsx library/
├── .changeset/
├── .github/
├── dist/
│   ├── index.js  index.mjs  index.d.ts  index.d.mts  style.css
├── src/
│   ├── index.ts                          # Public exports
│   ├── message.tsx                       # <Message> (entry)
│   ├── header.tsx                        # App header subcomponent
│   ├── block_wrapper.tsx                 # Per-block wrapper
│   ├── style.css                         # Tailwind source
│   ├── components/
│   │   ├── index.tsx                     # getBlockComponent / getElementComponent
│   │   ├── blocks/
│   │   │   ├── section.tsx  divider.tsx  image.tsx  context.tsx
│   │   │   ├── header.tsx   actions.tsx  input.tsx   video.tsx
│   │   │   ├── file.tsx     table.tsx    markdown_block.tsx
│   │   │   ├── plan.tsx     task_card.tsx  context_actions.tsx
│   │   │   ├── alert.tsx    card.tsx     carousel.tsx     (new in v1.1.0)
│   │   │   └── rich_text/
│   │   │       ├── rich_text.tsx
│   │   │       ├── rich_text_section.tsx
│   │   │       ├── rich_text_list_wrapper.tsx
│   │   │       ├── rich_text_section_color.tsx
│   │   │       ├── rich_text_section_emoji.tsx
│   │   │       ├── rich_text_section_link.tsx
│   │   │       ├── rich_text_section_user.tsx
│   │   │       ├── rich_text_section_usergroup.tsx
│   │   │       ├── rich_text_section_channel.tsx
│   │   │       └── rich_text_section_broadcast.tsx
│   │   ├── elements/                     # 28 *_element.tsx files (see Ch. 5)
│   │   └── composition_objects/
│   │       ├── text_object.tsx
│   │       └── confirm_dialog.tsx
│   ├── store/
│   │   └── useGlobalContext.tsx          # GlobalProvider + useGlobalData
│   ├── types/
│   │   ├── layout.ts  elements.ts  objects.ts  rich_text_element.ts
│   └── utils/
│       ├── date.ts
│       ├── is_accessory_stacked.ts
│       ├── merge_classes.ts
│       ├── numbers.ts
│       ├── sanitize_for_slack.ts
│       ├── emojis/{parser.ts, list.ts}
│       └── markdown_parser/
│           ├── parser.tsx   types.ts
│           ├── elements/{blockquote.tsx, code.tsx, paragraph.tsx}
│           ├── sub_elements/
│           │   ├── delete.tsx  emphasis.tsx  html.tsx  inline_code.tsx
│           │   ├── link.tsx  slack_broadcast.tsx  slack_channel_mention.tsx
│           │   ├── slack_date.tsx  slack_emoji.tsx
│           │   ├── slack_user_group_mention.tsx  slack_user_mention.tsx
│           │   ├── strong.tsx  text.tsx
│           └── tokenizers/
│               ├── slack_user_mention/
│               ├── slack_channel_mention/
│               ├── slack_user_group_mention/
│               ├── slack_broadcast/
│               ├── slack_date/
│               └── slack_emoji/
├── test-blocks/                          # JSON fixtures (see Ch. 12, gitignored)
├── playground/                           # Contributor preview app (see Ch. 15, not in npm)
│   ├── package.json  vite.config.ts  tsconfig.json  tsconfig.node.json
│   ├── tailwind.config.cjs  postcss.config.js  index.html  README.md
│   └── src/
│       ├── main.tsx  App.tsx  fixtures.ts  index.css
├── package.json  tsconfig.json  tsup.config.ts
├── tailwind.config.js  postcss.config.js  .prettierrc
├── readme.md  PUBLISH_GUIDE.md  RELEASE_NOTES.md
├── .npmignore  .npmrc  .env  .gitignore
└── pnpm-lock.yaml
```

---

## Chapter 14 — Architectural conventions

Rules worth knowing before making changes:

1. **File naming:** snake_case for all files in `src/` (`section.tsx`, `button_element.tsx`).
2. **Dispatcher pattern:** never `switch` on `block.type` inside a block component. Always let `components/index.tsx` route. Returning `null` for unsupported types is intentional — it means forward-compat without crashes.
3. **Tailwind scope:** every visible component must render inside the `#slack_blocks_to_jsx` wrapper — otherwise `important` selectors don't match.
4. **Dark mode:** use Tailwind `dark:` variants. Don't read `theme` prop directly in components; rely on the `data-theme` attribute and CSS.
5. **Mentions:** never render raw `<@U123>` in components. Use the markdown parser so tokenizers and `hooks` fire.
6. **Hooks over forking:** anything that needs host-app integration (routing, avatars, emoji catalog) should be exposed via the `hooks` prop, not hardcoded.
7. **Externalization:** `react-markdown`, `remark-gfm`, `node-emoji` must stay external in tsup config — bundling them again will break Next.js ESM interop.
8. **Accessibility:** preserve the `accessibility_label` prop on buttons; use semantic tags (button, a, input) — this mirrors Slack's own a11y posture.
9. **Type-first:** every block/element addition requires a matching interface in `src/types/` before the component lands.
10. **Changesets:** any user-facing change needs a changeset before merge.

---

## Chapter 15 — Playground

### 15.1 What it is

A tiny Vite + React app that lives in `playground/` at the repo root. It imports the library from source (`../src/index.ts`) via a Vite alias, so any edit under `src/` — components, types, styles — hot-reloads instantly in the preview pane without running `tsup` or `postcss` by hand.

The playground is **for contributors**. It is committed to git (so anyone who clones the repo can run it) but it is **excluded from the published npm tarball** (see §15.5).

### 15.2 Folder layout

```
playground/
├── package.json          # isolated deps (react 18, vite 5, tailwind 3)
├── vite.config.ts        # aliases "slack-blocks-to-jsx" → ../src/index.ts
├── tsconfig.json         # paths → ../src/index.ts (editor go-to-def works)
├── tsconfig.node.json    # vite.config's own tsconfig
├── tailwind.config.cjs   # re-exports ../tailwind.config.js, extends content
├── postcss.config.js     # mirrors library pipeline minus cssnano
├── index.html
├── .gitignore            # node_modules, dist, .vite
├── README.md
└── src/
    ├── main.tsx          # React 18 createRoot entry
    ├── App.tsx           # sidebar + JSON editor + preview + theme toggle
    ├── index.css         # @imports ../../src/style.css + plain-CSS chrome
    └── fixtures.ts       # inline sample block payloads
```

### 15.3 How HMR works

The Vite alias `"slack-blocks-to-jsx" → ../src/index.ts` means the playground never touches `dist/`. Editing `src/components/blocks/alert.tsx` triggers Vite's React Fast Refresh; editing `src/style.css` or `tailwind.config.js` triggers a CSS reload because `src/index.css` uses `@import "../../src/style.css"` and the playground's PostCSS pipeline runs the same Tailwind + nesting + autoprefixer chain the library ships with.

Fixtures are kept inline in `playground/src/fixtures.ts` instead of reading from `../test-blocks/` because `test-blocks/` is gitignored and therefore absent from fresh clones.

### 15.4 Running it

From the library root:

```bash
pnpm playground:install    # one-time, installs the playground's deps
pnpm playground            # starts Vite dev server on http://localhost:5173
```

There is also `pnpm playground:build` for a production build of the playground (useful if you ever want to deploy it as a demo page).

### 15.5 How it is excluded from npm

Three guards keep the playground out of the published package:

1. `.npmignore` lists `playground/`, so `npm publish` skips the folder entirely.
2. The playground has its own `package.json` with its own `node_modules`, so its deps never leak into the library's dep graph.
3. The library's build (`tsup`) only reads `src/`; it never resolves anything under `playground/`.

Verify with `npm pack --dry-run` after any change — the tarball file list should never contain a `playground/` entry.

### 15.6 Adding a new fixture

Open `playground/src/fixtures.ts` and append a new entry to the `FIXTURES` array:

```ts
{
  id: "my-new-block",
  label: "My new block",
  blocks: [
    { type: "my_new_block", /* … */ },
  ],
}
```

The sidebar picks it up automatically on next HMR. Keep fixtures small (≤ 10 blocks) — the goal is "open the playground and immediately see how this block renders", not full regression coverage.

---

## Chapter 16 — Change log of this doc

| Date       | Author        | Note                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-17 | Claude + Mash | Initial knowledge base created from full source walkthrough at v1.0.3.                                                                                                                                                                                                                                                                                                                                                                         |
| 2026-04-17 | Claude + Mash | Added Ch. 0 — How to use this knowledge base (usage, reading strategy, update triggers, update procedure, style rules, ownership).                                                                                                                                                                                                                                                                                                             |
| 2026-04-17 | Claude + Mash | v1.1.0 release prep: added three new blocks (`alert`, `card`, `carousel`) matching Slack's 2026-04-16 Block Kit launch. Ch. 4 block count 14 → 17 (new §4.6 "Status & rich-container blocks"). Ch. 6.1 type list updated with `AlertBlock`, `CardBlock`, `CarouselBlock`, `CardImage`, `AlertLevel`. Ch. 12 gained `11-alert-card-carousel.json` fixture. Ch. 13 file tree updated. Changeset: `.changeset/add-alert-card-carousel-blocks.md`. |
| 2026-04-17 | Claude + Mash | Added Ch. 15 — Playground. New `playground/` folder (Vite + React 18) that source-aliases `slack-blocks-to-jsx` to `../src/index.ts` for instant HMR. Committed to git, excluded from npm via `.npmignore`. Ch. 15 renumbered from change log → playground; change log moved to Ch. 16. Root `package.json` gained `playground`, `playground:install`, `playground:build` scripts. Ch. 13 file tree extended.                                  |
