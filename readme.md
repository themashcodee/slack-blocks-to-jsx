# Slack Blocks to JSX

A React library that renders Slack Block Kit components as JSX with pixel-perfect styling. Full parity with Slack's Block Kit specification.

**[🎮 Live Playground](https://slack-block-to-jsx-playground.vercel.app/)** | **[📖 Blog Post](https://themashcodee.hashnode.dev/how-to-effortlessly-render-slack-blocks-in-react-with-slack-blocks-to-jsx)** | **[📦 NPM](https://www.npmjs.com/package/slack-blocks-to-jsx)**

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Supported Blocks](#supported-blocks)
- [Supported Elements](#supported-elements)
- [Rich Text Support](#rich-text-support)
- [Dark Mode](#dark-mode)
- [Hooks API](#hooks-api)
- [Data Props](#automatic-mention-replacement)
- [TypeScript](#typescript-support)
- [Theming & Customization](#theming--customization)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Features

- **Full Block Kit parity** - Supports all Slack Block Kit block types, elements, and composition objects
- **Pixel-perfect rendering** - Matches Slack's native appearance
- **Dark mode** - Built-in dark mode via `data-theme="dark"` attribute
- **Rich text support** - Bold, italic, strikethrough, code, links, colors, and more
- **Standard markdown block** - Renders standard markdown (tables, task lists, syntax highlighting) via `react-markdown`
- **Interactive elements** - Buttons, select menus, date/time pickers, radio buttons, checkboxes, overflow menus, and more
- **Confirm dialogs** - Built-in confirmation dialog support on interactive elements
- **Mentions** - User, channel, and usergroup mentions with custom rendering
- **Emoji support** - Full emoji rendering with skin tone variants
- **Date formatting** - Slack date syntax support
- **Custom hooks** - Override rendering for any element type
- **TypeScript first** - Full type exports for type safety
- **Themeable** - CSS class overrides for custom styling
- **React 17, 18, 19** - Compatible with all modern React versions

## Installation

```bash
npm install slack-blocks-to-jsx
```

Or using yarn:

```bash
yarn add slack-blocks-to-jsx
```

Or using pnpm:

```bash
pnpm add slack-blocks-to-jsx
```

### Next.js / SSR Setup

Since `react-markdown` and `remark-gfm` are ESM-only packages, Next.js users need to add this to their `next.config.js` / `next.config.mjs`:

```js
const nextConfig = {
  experimental: {
    esmExternals: "loose",
  },
  transpilePackages: ["slack-blocks-to-jsx", "react-markdown", "remark-gfm"],
};
```

## Quick Start

### 1. Import the styles

```tsx
import "slack-blocks-to-jsx/dist/style.css";
```

### 2. Use the Message component

```tsx
import { Message } from "slack-blocks-to-jsx";

const blocks = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Hello, *world*! :wave:",
    },
  },
];

function App() {
  return <Message blocks={blocks} name="My App" logo="/logo.png" time={new Date()} />;
}
```

### 3. Add type safety (optional)

```tsx
import type { Block } from "slack-blocks-to-jsx";

const blocks: Block[] = [
  // TypeScript will validate your blocks
];
```

## Supported Blocks

| Block Type      | Status  | Notes                                                        |
| --------------- | ------- | ------------------------------------------------------------ |
| Section         | ✅ Full | Text, fields, accessories, `expand` property                 |
| Divider         | ✅ Full | Horizontal divider                                           |
| Image           | ✅ Full | Collapsible with alt text, `slack_file` support              |
| Context         | ✅ Full | Images and text elements                                     |
| Header          | ✅ Full | Large bold text                                              |
| Rich Text       | ✅ Full | Lists, quotes, preformatted, sections, color elements        |
| Video           | ✅ Full | Collapsible video embed                                      |
| Table           | ✅ Full | Rows, columns, alignment                                     |
| Actions         | ✅ Full | All interactive element types supported                      |
| Input           | ✅ Full | All input element types supported                            |
| File            | ✅ Full | Remote file display                                          |
| Context Actions | ✅ Full | Feedback buttons and icon buttons                            |
| Markdown        | ✅ Full | Standard markdown with GFM (tables, task lists, code blocks) |
| Plan            | ✅ Full | Sequential task display with status indicators               |
| Task Card       | ✅ Full | Individual task with title, details, output, sources, status |

## Supported Elements

### Interactive Elements

| Element          | Status  | Notes                                               |
| ---------------- | ------- | --------------------------------------------------- |
| Button           | ✅ Full | Primary, danger, default styles with confirm dialog |
| Workflow Button  | ✅ Full | Triggers a workflow on click                        |
| Overflow Menu    | ✅ Full | Three-dot menu with options and confirm dialog      |
| Radio Buttons    | ✅ Full | Radio button group with initial selection           |
| Checkboxes       | ✅ Full | Multi-select with descriptions and confirm dialog   |
| Feedback Buttons | ✅ Full | Positive/negative sentiment buttons                 |
| Icon Button      | ✅ Full | Icon-based action button                            |

### Select Menus

| Element              | Status  | Notes                                                     |
| -------------------- | ------- | --------------------------------------------------------- |
| Static Select        | ✅ Full | Searchable dropdown with option groups and confirm dialog |
| External Select      | ✅ Full | External data source select                               |
| Users Select         | ✅ Full | User picker with search and confirm dialog                |
| Conversations Select | ✅ Full | Conversation picker                                       |
| Channels Select      | ✅ Full | Channel picker                                            |

### Multi-Select Menus

| Element                    | Status  | Notes                           |
| -------------------------- | ------- | ------------------------------- |
| Multi Static Select        | ✅ Full | Multi-select with option groups |
| Multi External Select      | ✅ Full | Multi-select with external data |
| Multi Users Select         | ✅ Full | Multi-user picker               |
| Multi Conversations Select | ✅ Full | Multi-conversation picker       |
| Multi Channels Select      | ✅ Full | Multi-channel picker            |

### Input Elements

| Element          | Status  | Notes                              |
| ---------------- | ------- | ---------------------------------- |
| Plain Text Input | ✅ Full | Single/multiline with validation   |
| Email Input      | ✅ Full | Email text input                   |
| URL Input        | ✅ Full | URL text input                     |
| Number Input     | ✅ Full | Numeric input with decimal support |
| Date Picker      | ✅ Full | Calendar date picker               |
| Time Picker      | ✅ Full | Time picker (HH:mm)                |
| DateTime Picker  | ✅ Full | Combined date and time picker      |
| File Input       | ✅ Full | File upload element                |
| Rich Text Input  | ✅ Full | Rich text editor                   |

### Display Elements

| Element    | Status  | Notes                                          |
| ---------- | ------- | ---------------------------------------------- |
| Image      | ✅ Full | Simple image display with `slack_file` support |
| URL Source | ✅ Full | Clickable URL reference for task cards         |

## Rich Text Support

The library fully supports Slack's rich text block with all formatting options.

### Text Styles

| Style         | Slack Syntax | Result           |
| ------------- | ------------ | ---------------- |
| Bold          | `*text*`     | **text**         |
| Italic        | `_text_`     | _text_           |
| Strikethrough | `~text~`     | ~~text~~         |
| Inline code   | `` `code` `` | `code`           |
| Highlight     | -            | Highlighted text |

### Block Elements

- **Lists** - Ordered (numeric, alpha, roman) and unordered with up to 8 levels of indentation, with `offset` support for starting at a specific number
- **Quotes** - Blockquote styling with left border
- **Preformatted** - Code blocks with monospace font and optional `language` syntax highlighting
- **Color** - Inline color swatch with hex value display

### Mentions & Special Syntax

| Type                | Syntax                                      | Description                  |
| ------------------- | ------------------------------------------- | ---------------------------- |
| User mention        | `<@U123456>`                                | Mentions a user              |
| Channel mention     | `<#C123456>`                                | Links to a channel           |
| Usergroup mention   | `<!subteam^S123456>`                        | Mentions a user group        |
| Broadcast @here     | `<!here>`                                   | Notifies active users        |
| Broadcast @channel  | `<!channel>`                                | Notifies all channel members |
| Broadcast @everyone | `<!everyone>`                               | Notifies everyone            |
| Link                | `<https://example.com\|Link Text>`          | Hyperlink with custom text   |
| Date                | `<!date^1234567890^{date_short}\|fallback>` | Formatted date               |

## Dark Mode

The library has built-in dark mode support. Use the `theme` prop on the `Message` component:

```tsx
<Message blocks={blocks} name="Bot" logo="/logo.png" theme="dark" />
```

If `theme` is not set, it automatically follows the system preference via `prefers-color-scheme`.

All components automatically adapt their colors, borders, and backgrounds for dark mode.

## Hooks API

Hooks allow you to customize how specific elements are rendered.

### Available Hooks

| Hook         | Parameters                                     | Description                          |
| ------------ | ---------------------------------------------- | ------------------------------------ |
| `user`       | `{ id, name, style }`                          | Custom user mention rendering        |
| `channel`    | `{ id, name, style }`                          | Custom channel mention rendering     |
| `usergroup`  | `{ id, name, style }`                          | Custom usergroup mention rendering   |
| `atHere`     | `style`                                        | Custom @here broadcast rendering     |
| `atChannel`  | `style`                                        | Custom @channel broadcast rendering  |
| `atEveryone` | `style`                                        | Custom @everyone broadcast rendering |
| `emoji`      | `data, defaultParser`                          | Custom emoji rendering               |
| `date`       | `{ timestamp, format, link, fallback }`        | Custom date rendering                |
| `link`       | `{ href, children, className, target?, rel? }` | Custom link/anchor rendering         |

### Examples

#### User Mention Hook

```tsx
<Message
  blocks={blocks}
  hooks={{
    user: ({ id, name, style }) => (
      <span className="user-mention" style={{ fontWeight: style?.bold ? "bold" : "normal" }}>
        @{name || id}
      </span>
    ),
  }}
/>
```

#### Channel Mention Hook

```tsx
<Message
  blocks={blocks}
  hooks={{
    channel: ({ id, name }) => <a href={`/channels/${id}`}>#{name || id}</a>,
  }}
/>
```

#### Emoji Hook

```tsx
<Message
  blocks={blocks}
  hooks={{
    emoji: (data, defaultParser) => {
      // Use custom emoji images or fall back to default
      if (data.name === "custom_emoji") {
        return <img src="/emojis/custom.png" alt={data.name} />;
      }
      return defaultParser(data);
    },
  }}
/>
```

#### Date Hook

```tsx
<Message
  blocks={blocks}
  hooks={{
    date: ({ timestamp, format, link, fallback }) => {
      const date = new Date(parseInt(timestamp) * 1000);
      return <time dateTime={date.toISOString()}>{fallback}</time>;
    },
  }}
/>
```

#### Broadcast Hooks

```tsx
<Message
  blocks={blocks}
  hooks={{
    atHere: (style) => <span className="broadcast">@here</span>,
    atChannel: (style) => <span className="broadcast">@channel</span>,
    atEveryone: (style) => <span className="broadcast">@everyone</span>,
  }}
/>
```

#### Link Hook

```tsx
<Message
  blocks={blocks}
  hooks={{
    link: ({ href, children, className, target, rel }) => (
      <a href={href} target={target} rel={rel} className={className}>
        {children}
      </a>
    ),
  }}
/>
```

## Automatic Mention Replacement

Pass user, channel, and usergroup data to automatically resolve mentions:

```tsx
<Message
  blocks={blocks}
  data={{
    users: [
      { id: "U123456", name: "John Doe", avatar: "https://..." },
      { id: "U789012", name: "Jane Smith", avatar: "https://..." },
    ],
    channels: [
      { id: "C123456", name: "general" },
      { id: "C789012", name: "random" },
    ],
    user_groups: [{ id: "S123456", name: "Engineering Team", handle: "engineering" }],
  }}
/>
```

When a mention like `<@U123456>` appears in blocks, it will automatically display "John Doe" instead of the raw ID.

## Message Component Props

| Prop                | Type                | Default  | Description                                                                    |
| ------------------- | ------------------- | -------- | ------------------------------------------------------------------------------ |
| `blocks`            | `Block[]`           | required | Array of Slack block objects                                                   |
| `name`              | `string`            | required | Name of the sender/app                                                         |
| `logo`              | `string`            | required | URL of the logo to display                                                     |
| `time`              | `Date`              | -        | Timestamp for the message                                                      |
| `theme`             | `"light" \| "dark"` | system   | Theme mode. Falls back to system preference if not set                         |
| `className`         | `string`            | -        | Additional CSS classes                                                         |
| `style`             | `CSSProperties`     | -        | Inline styles                                                                  |
| `unstyled`          | `boolean`           | `false`  | Disable all included styles                                                    |
| `withoutWrapper`    | `boolean`           | `false`  | Render blocks without wrapper                                                  |
| `hooks`             | `Hooks`             | -        | Custom rendering hooks                                                         |
| `data`              | `Data`              | -        | Users, channels, usergroups data                                               |
| `showBlockKitDebug` | `boolean`           | `false`  | Show Block Kit Builder link (custom properties are sanitized from the payload) |

## TypeScript Support

The library exports all types for full type safety:

```tsx
import type {
  // Main types
  Block,

  // Block types
  SectionBlock,
  DividerBlock,
  ImageBlock,
  ContextBlock,
  ActionsBlock,
  HeaderBlock,
  InputBlock,
  RichTextBlock,
  VideoBlock,
  FileBlock,
  ContextActionsBlock,
  MarkdownBlock,
  PlanBlock,
  TaskCardBlock,

  // Element types
  ButtonElement,
  ImageElement,
  StaticSelectElement,
  ExternalSelectElement,
  UsersSelectElement,
  ConversationsSelectElement,
  ChannelsSelectElement,
  MultiStaticSelectElement,
  MultiExternalSelectElement,
  MultiUsersSelectElement,
  MultiConversationsSelectElement,
  MultiChannelsSelectElement,
  PlainTextInputElement,
  EmailInputElement,
  UrlTextInputElement,
  NumberInputElement,
  CheckboxesElement,
  RadioButtonsElement,
  DatePickerElement,
  TimePickerElement,
  DateTimePickerElement,
  OverflowMenuElement,
  FileInputElement,
  RichTextInputElement,
  WorkflowButtonElement,
  FeedbackButtonsElement,
  IconButtonElement,
  UrlSourceElement,

  // Rich text types
  RichTextSection,
  RichTextList,
  RichTextQuote,
  RichTextPreformatted,
  RichTextSectionColor,

  // Composition objects
  TextObject,
  ConfirmDialogObject,
  OptionObject,
  SlackFileObject,
  WorkflowObject,
  TriggerObject,
} from "slack-blocks-to-jsx";
```

## Theming & Customization

### CSS Class Structure

The library uses a consistent BEM-like naming convention:

```
.slack_blocks_to_jsx                         /* Main wrapper */
├── .slack_blocks_to_jsx--header             /* Header section */
├── .slack_blocks_to_jsx--blocks             /* Blocks container */
│   └── .slack_blocks_to_jsx--block_wrapper  /* Each block wrapper */
│       └── .slack_blocks_to_jsx__[block]    /* Block-specific class */
```

### Block Classes

| Class                                   | Description           |
| --------------------------------------- | --------------------- |
| `.slack_blocks_to_jsx__divider`         | Divider block         |
| `.slack_blocks_to_jsx__section`         | Section block         |
| `.slack_blocks_to_jsx__image`           | Image block           |
| `.slack_blocks_to_jsx__context`         | Context block         |
| `.slack_blocks_to_jsx__actions`         | Actions block         |
| `.slack_blocks_to_jsx__input`           | Input block           |
| `.slack_blocks_to_jsx__header`          | Header block          |
| `.slack_blocks_to_jsx__rich_text`       | Rich text block       |
| `.slack_blocks_to_jsx__video`           | Video block           |
| `.slack_blocks_to_jsx__table`           | Table block           |
| `.slack_blocks_to_jsx__context_actions` | Context actions block |
| `.slack_blocks_to_jsx__markdown_block`  | Markdown block        |
| `.slack_blocks_to_jsx__plan`            | Plan block            |
| `.slack_blocks_to_jsx__task_card`       | Task card block       |

### Element Classes

| Class                                                      | Description             |
| ---------------------------------------------------------- | ----------------------- |
| `.slack_blocks_to_jsx__button_element`                     | Button element          |
| `.slack_blocks_to_jsx__workflow_button_element`            | Workflow button element |
| `.slack_blocks_to_jsx__overflow_menu_element`              | Overflow menu           |
| `.slack_blocks_to_jsx__radio_buttons_element`              | Radio button group      |
| `.slack_blocks_to_jsx__checkboxes_element`                 | Checkboxes group        |
| `.slack_blocks_to_jsx__date_picker_element`                | Date picker             |
| `.slack_blocks_to_jsx__time_picker_element`                | Time picker             |
| `.slack_blocks_to_jsx__datetime_picker_element`            | DateTime picker         |
| `.slack_blocks_to_jsx__plain_text_input_element`           | Plain text input        |
| `.slack_blocks_to_jsx__email_input_element`                | Email input             |
| `.slack_blocks_to_jsx__url_input_element`                  | URL input               |
| `.slack_blocks_to_jsx__number_input_element`               | Number input            |
| `.slack_blocks_to_jsx__file_input_element`                 | File input              |
| `.slack_blocks_to_jsx__rich_text_input_element`            | Rich text input         |
| `.slack_blocks_to_jsx__image_element`                      | Image element           |
| `.slack_blocks_to_jsx__users_select_element`               | Users select            |
| `.slack_blocks_to_jsx__channels_select_element`            | Channels select         |
| `.slack_blocks_to_jsx__conversations_select_element`       | Conversations select    |
| `.slack_blocks_to_jsx__external_select_element`            | External select         |
| `.slack_blocks_to_jsx__multi_static_select_element`        | Multi static select     |
| `.slack_blocks_to_jsx__multi_external_select_element`      | Multi external select   |
| `.slack_blocks_to_jsx__multi_users_select_element`         | Multi users select      |
| `.slack_blocks_to_jsx__multi_conversations_select_element` | Multi conversations     |
| `.slack_blocks_to_jsx__multi_channels_select_element`      | Multi channels select   |
| `.slack_blocks_to_jsx__feedback_buttons_element`           | Feedback buttons        |
| `.slack_blocks_to_jsx__icon_button_element`                | Icon button             |
| `.slack_blocks_to_jsx__url_source_element`                 | URL source              |
| `.slack_blocks_to_jsx__confirm_dialog`                     | Confirmation dialog     |

### Rich Text Element Classes

| Class                                                        | Description          |
| ------------------------------------------------------------ | -------------------- |
| `.slack_blocks_to_jsx__rich_text_section_element`            | Section element      |
| `.slack_blocks_to_jsx__rich_text_list_element`               | List element         |
| `.slack_blocks_to_jsx__rich_text_quote_element`              | Quote element        |
| `.slack_blocks_to_jsx__rich_text_preformatted_element`       | Preformatted element |
| `.slack_blocks_to_jsx__rich_text_section_element_text`       | Text element         |
| `.slack_blocks_to_jsx__rich_text_section_element_user`       | User mention         |
| `.slack_blocks_to_jsx__rich_text_section_element_channel`    | Channel mention      |
| `.slack_blocks_to_jsx__rich_text_section_element_user_group` | Usergroup mention    |
| `.slack_blocks_to_jsx__rich_text_section_element_broadcast`  | Broadcast mention    |
| `.slack_blocks_to_jsx__rich_text_section_element_link`       | Link element         |
| `.slack_blocks_to_jsx__rich_text_section_element_emoji`      | Emoji element        |
| `.slack_blocks_to_jsx__rich_text_section_element_date`       | Date element         |
| `.slack_blocks_to_jsx__rich_text_section_element_color`      | Color swatch element |

### Override Examples

```css
/* Custom link color */
.slack_blocks_to_jsx a {
  color: #1264a3;
}

/* Custom code block styling */
.slack_blocks_to_jsx__rich_text_preformatted_element {
  background: #1e1e1e;
  color: #d4d4d4;
}

/* Custom mention styling */
.slack_blocks_to_jsx__rich_text_section_element_user {
  background: #e8f5fa;
  padding: 0 4px;
  border-radius: 3px;
}

/* Custom quote styling */
.slack_blocks_to_jsx__rich_text_quote_element {
  border-left: 4px solid #1264a3;
  padding-left: 12px;
}
```

## Complete Example

```tsx
import { Message, Block } from "slack-blocks-to-jsx";
import "slack-blocks-to-jsx/dist/style.css";

const blocks: Block[] = [
  {
    type: "header",
    text: { type: "plain_text", text: "Welcome to the Team!" },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Hey <@U123>! Welcome to <#C456|general> :tada:",
    },
  },
  {
    type: "divider",
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Getting Started:*\n• Read the onboarding docs\n• Set up your development environment\n• Join the standup tomorrow",
    },
  },
  {
    type: "context",
    elements: [{ type: "mrkdwn", text: "Posted by *HR Bot* :robot_face:" }],
  },
];

function App() {
  return (
    <Message
      blocks={blocks}
      name="HR Bot"
      logo="/bot-logo.png"
      time={new Date()}
      data={{
        users: [{ id: "U123", name: "New Employee" }],
        channels: [{ id: "C456", name: "general" }],
      }}
      hooks={{
        user: ({ name }) => <strong className="text-blue-600">@{name}</strong>,
      }}
    />
  );
}

export default App;
```

## FAQ

### How do I render messages without the header?

Use the `withoutWrapper` prop:

```tsx
<Message blocks={blocks} withoutWrapper />
```

### How do I disable default styles?

Use the `unstyled` prop and provide your own CSS:

```tsx
<Message blocks={blocks} unstyled />
```

### How do I debug my blocks?

Enable the Block Kit Builder link:

```tsx
<Message blocks={blocks} showBlockKitDebug />
```

This adds a link to open your blocks in Slack's Block Kit Builder. Custom properties (like `people` on `users_select`, `iframeProps` on video, etc.) are automatically stripped from the payload so it passes Slack's validation.

### Why isn't my mention showing the user's name?

Make sure you're either:

1. Passing user data via the `data` prop, or
2. Handling it via the `user` hook

### Does this work with Next.js / SSR?

Yes! See the [Next.js / SSR Setup](#nextjs--ssr-setup) section above for the required config.

### Can I use this with Tailwind CSS?

Yes, the library uses Tailwind internally. You can extend or override styles using Tailwind classes or the provided CSS class names.

### What React versions are supported?

React 17, 18, and 19 are all supported.

### How do I handle interactive elements like buttons?

Interactive elements (buttons, selects, checkboxes, etc.) render visually with built-in UI interactions like dropdowns, selection, and confirm dialogs. For custom business logic, use the component's structure to add your own event handling or wrap the Message component.

### How does the Markdown block differ from Rich Text?

The **Rich Text** block uses Slack's `mrkdwn` syntax (parsed internally). The **Markdown** block uses standard markdown (GitHub Flavored Markdown) and is rendered via `react-markdown` — it supports tables, task lists, code blocks with syntax highlighting, and more. The Markdown block is designed for AI/LLM output in Slack.

## Contributing

The project is open-source and contributions are welcome! Here's how you can help:

1. **Report bugs** - [Open an issue](https://github.com/themashcodee/slack-blocks-to-jsx/issues)
2. **Request features** - Describe your use case in an issue
3. **Submit PRs** - Fork the repo and submit a pull request
4. **Improve docs** - Help make the documentation better

For feature requests or custom implementations, you can also reach out at codeemash@gmail.com.

## Support

Love this library? Consider supporting its development:

[![Buy Me a Coffee](https://github.com/user-attachments/assets/1c8e9f68-b33d-4132-b081-f255027580b6)](https://www.buymeacoffee.com/themashcodee)

## License

MIT License - see [LICENSE](./LICENSE) for details.
