# Slack Blocks to JSX

A React library that renders Slack Block Kit components as JSX with pixel-perfect styling.

**[🎮 Live Playground](https://slack-block-to-jsx-playground.vercel.app/)** | **[📖 Blog Post](https://themashcodee.hashnode.dev/how-to-effortlessly-render-slack-blocks-in-react-with-slack-blocks-to-jsx)** | **[📦 NPM](https://www.npmjs.com/package/slack-blocks-to-jsx)**

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Supported Blocks](#supported-blocks)
- [Supported Elements](#supported-elements)
- [Rich Text Support](#rich-text-support)
- [Hooks API](#hooks-api)
- [Data Props](#automatic-mention-replacement)
- [TypeScript](#typescript-support)
- [Theming & Customization](#theming--customization)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Features

- **Pixel-perfect rendering** - Matches Slack's native appearance
- **Rich text support** - Bold, italic, strikethrough, code, links, and more
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
  return (
    <Message
      blocks={blocks}
      name="My App"
      logo="/logo.png"
      time={new Date()}
    />
  );
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

| Block Type | Status | Notes |
|------------|--------|-------|
| Section | ✅ Full | Text, fields, and accessories |
| Divider | ✅ Full | Horizontal divider |
| Image | ✅ Full | Collapsible with alt text |
| Context | ✅ Full | Images and text elements |
| Header | ✅ Full | Large bold text |
| Rich Text | ✅ Full | Lists, quotes, preformatted, sections |
| Video | ✅ Full | Collapsible video embed |
| Table | ✅ Full | Rows, columns, alignment |
| Actions | 🟨 Partial | Buttons ✅, Static Select ✅, others pending |
| Input | 🟨 Partial | Plain text ✅, Checkboxes ✅, others pending |
| File | ❌ None | Remote files not implemented |

> Need support for a specific block or element? [Open an issue](https://github.com/themashcodee/slack-blocks-to-jsx/issues) or email codeemash@gmail.com.

## Supported Elements

| Element | Status | Notes |
|---------|--------|-------|
| Button | ✅ Full | Primary, danger, default styles |
| Image | ✅ Full | Simple image display |
| Static Select | ✅ Full | Searchable dropdown |
| Users Select | ✅ Full | User picker with search |
| Plain Text Input | ✅ Full | Single/multiline with validation |
| Checkboxes | ✅ Full | Multi-select with descriptions |
| Datepicker | ❌ | Not yet implemented |
| Timepicker | ❌ | Not yet implemented |
| Multi-select variants | ❌ | Not yet implemented |
| Radio Buttons | ❌ | Not yet implemented |
| Overflow Menu | ❌ | Not yet implemented |

## Rich Text Support

The library fully supports Slack's rich text block with all formatting options.

### Text Styles

| Style | Slack Syntax | Result |
|-------|--------------|--------|
| Bold | `*text*` | **text** |
| Italic | `_text_` | *text* |
| Strikethrough | `~text~` | ~~text~~ |
| Inline code | `` `code` `` | `code` |

### Block Elements

- **Lists** - Ordered (numeric, alpha, roman) and unordered with up to 8 levels of indentation
- **Quotes** - Blockquote styling with left border
- **Preformatted** - Code blocks with monospace font

### Mentions & Special Syntax

| Type | Syntax | Description |
|------|--------|-------------|
| User mention | `<@U123456>` | Mentions a user |
| Channel mention | `<#C123456>` | Links to a channel |
| Usergroup mention | `<!subteam^S123456>` | Mentions a user group |
| Broadcast @here | `<!here>` | Notifies active users |
| Broadcast @channel | `<!channel>` | Notifies all channel members |
| Broadcast @everyone | `<!everyone>` | Notifies everyone |
| Link | `<https://example.com\|Link Text>` | Hyperlink with custom text |
| Date | `<!date^1234567890^{date_short}\|fallback>` | Formatted date |

## Hooks API

Hooks allow you to customize how specific elements are rendered.

### Available Hooks

| Hook | Parameters | Description |
|------|------------|-------------|
| `user` | `{ id, name, style }` | Custom user mention rendering |
| `channel` | `{ id, name, style }` | Custom channel mention rendering |
| `usergroup` | `{ id, name, handle, style }` | Custom usergroup mention rendering |
| `atHere` | `style` | Custom @here broadcast rendering |
| `atChannel` | `style` | Custom @channel broadcast rendering |
| `atEveryone` | `style` | Custom @everyone broadcast rendering |
| `emoji` | `data, defaultParser` | Custom emoji rendering |
| `date` | `{ timestamp, format, link, fallback }` | Custom date rendering |
| `link` | `{ url, text, style }` | Custom link rendering |

### Examples

#### User Mention Hook

```tsx
<Message
  blocks={blocks}
  hooks={{
    user: ({ id, name, style }) => (
      <span
        className="user-mention"
        style={{ fontWeight: style?.bold ? "bold" : "normal" }}
      >
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
    channel: ({ id, name }) => (
      <a href={`/channels/${id}`}>#{name || id}</a>
    ),
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
    link: ({ url, text, style }) => (
      <a href={url} target="_blank" rel="noopener noreferrer" className="custom-link">
        {text || url}
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
    user_groups: [
      { id: "S123456", name: "Engineering Team", handle: "engineering" },
    ],
  }}
/>
```

When a mention like `<@U123456>` appears in blocks, it will automatically display "John Doe" instead of the raw ID.

## Message Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blocks` | `Block[]` | required | Array of Slack block objects |
| `name` | `string` | required | Name of the sender/app |
| `logo` | `string` | required | URL of the logo to display |
| `time` | `Date` | - | Timestamp for the message |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles |
| `unstyled` | `boolean` | `false` | Disable all included styles |
| `withoutWrapper` | `boolean` | `false` | Render blocks without wrapper |
| `hooks` | `Hooks` | - | Custom rendering hooks |
| `data` | `Data` | - | Users, channels, usergroups data |
| `showBlockKitDebug` | `boolean` | `false` | Show Block Kit Builder link |

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

  // Element types
  ButtonElement,
  ImageElement,
  StaticSelectElement,
  UsersSelectElement,
  PlainTextInputElement,
  CheckboxesElement,

  // Rich text types
  RichTextSection,
  RichTextList,
  RichTextQuote,
  RichTextPreformatted,

  // Composition objects
  TextObject,
  ConfirmDialogObject,
  OptionObject,
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

| Class | Description |
|-------|-------------|
| `.slack_blocks_to_jsx__divider` | Divider block |
| `.slack_blocks_to_jsx__section` | Section block |
| `.slack_blocks_to_jsx__image` | Image block |
| `.slack_blocks_to_jsx__context` | Context block |
| `.slack_blocks_to_jsx__actions` | Actions block |
| `.slack_blocks_to_jsx__input` | Input block |
| `.slack_blocks_to_jsx__header` | Header block |
| `.slack_blocks_to_jsx__rich_text` | Rich text block |
| `.slack_blocks_to_jsx__video` | Video block |
| `.slack_blocks_to_jsx__table` | Table block |

### Rich Text Element Classes

| Class | Description |
|-------|-------------|
| `.slack_blocks_to_jsx__rich_text_section_element` | Section element |
| `.slack_blocks_to_jsx__rich_text_list_element` | List element |
| `.slack_blocks_to_jsx__rich_text_quote_element` | Quote element |
| `.slack_blocks_to_jsx__rich_text_preformatted_element` | Preformatted element |
| `.slack_blocks_to_jsx__rich_text_section_element_user` | User mention |
| `.slack_blocks_to_jsx__rich_text_section_element_channel` | Channel mention |
| `.slack_blocks_to_jsx__rich_text_section_element_emoji` | Emoji |

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
        user: ({ name }) => (
          <strong className="text-blue-600">@{name}</strong>
        ),
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

This adds a link to open your blocks in Slack's Block Kit Builder.

### Why isn't my mention showing the user's name?

Make sure you're either:
1. Passing user data via the `data` prop, or
2. Handling it via the `user` hook

### Does this work with Next.js / SSR?

Yes! The library is compatible with server-side rendering.

### Can I use this with Tailwind CSS?

Yes, the library uses Tailwind internally. You can extend or override styles using Tailwind classes or the provided CSS class names.

### What React versions are supported?

React 17, 18, and 19 are all supported.

### How do I handle interactive elements like buttons?

Buttons render visually but don't have built-in click handlers. Use the component's structure to add your own event handling or wrap the Message component.

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
