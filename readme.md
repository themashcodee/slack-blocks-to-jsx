# Slack Blocks to JSX Documentation

## Overview

The `slack-blocks-to-jsx` package allows you to render Slack blocks in React with styles that closely mimic how they are displayed in Slack. This library converts Slack's block kit components into JSX components, maintaining the visual fidelity and interactive elements.

**🚨 Quickly test out the library on online playground**: https://slack-block-to-jsx-playground.vercel.app/

🔗 **New!** Check out our detailed blog post: [Rendering Slack Blocks in React: A Complete Guide](https://themashcodee.hashnode.dev/how-to-effortlessly-render-slack-blocks-in-react-with-slack-blocks-to-jsx)

## Installation

To use this package in your project, install it via npm:

```bash
npm install slack-blocks-to-jsx
```

Or using yarn:

```bash
yarn add slack-blocks-to-jsx
```

## Usage

### Importing Styles

Import the necessary CSS file in your entry point to ensure the styles are applied:

```javascript
import "slack-blocks-to-jsx/dist/style.css";
```

### Using Components

Import the `Message` component from the package and use it to render your Slack blocks:

```javascript
import { Message } from "slack-blocks-to-jsx";

const blocks = [...]; // your Slack blocks data

<Message time={new Date()} name="Your Company" logo="logo_url" blocks={blocks} />
```

### Types

For better type safety, you can import the `Block` type:

```javascript
import type { Block } from "slack-blocks-to-jsx";

const blocks: Block[] = [...]; // your Slack blocks data
```

## Components

### `Message`

This is the main component that renders the entire Slack message. It supports various props to customize the appearance and behavior:

- `blocks`: Array of Slack block objects.
- `logo`: URL of the logo to display.
- `name`: Name of the sender.
- `time?`: Timestamp for the message.
- `className?`, `style?`: Standard React styling props.
- `unstyled?`: If true, disables all included styles. Default to false.
- `withoutWrapper?`: If true, renders only the Slack blocks without any wrapper. Default to false.
- `hooks?`: custom handlers for user, channel, broadcast, usergroup, emoji etc.
  - user?: (input: { id: string; name: string }) = ReactNode
  - channel?: (input: { id: string; name: string }) = ReactNode
  - usergroup?: (input: { id: string; name: string }) = ReactNode
  - atChannel?: () = ReactNode
  - atEveryone?: () = ReactNode
  - atHere?: () = ReactNode
  - emoji?: (data: { name: string; unicode?: string; skin_tone?: number; }, => ReactNode, fallback: (data: { name: string; unicode?: string; skin_tone?: number; }) => string )
  - date?: (data: { timestamp: string; format: string; link: string | null; fallback: string; }) => ReactNode;
- `data?`: optionally pass an array or users, channels and user groups to automatically be replaced with the user, channel and user group mentions.
- `showBlockKitDebug?`: Show a link to open the message in the Slack Block Kit Builder, for debugging purposes. Defaults to false.

### Block Components

Each Slack block type has a corresponding component:

- `Section` (✅ supported)
- `Divider` (✅ supported)
- `Image` (✅ supported)
- `Context` (✅ supported)
- `Actions` (🟨 partially supported)
- `File` (❌ not supported yet)
- `Header` (✅ supported)
- `Input` (🟨 partially supported)
- `RichText` (✅ supported)
- `Video` (✅ supported)

If you want a support of a particular block or element which is not supported yet so please raise a github issue or mail me at codeemash@gmail.com. I will try to push it asap.

## Customization

You can handle custom rendering and interactions using the `hooks` prop in the `Message` component. This allows you to define custom behavior for user mentions, channels, and other interactive elements. You can also override default styling. Here are the classes structure to understand to override any block styling.

`.slack_blocks_to_jsx`: Main Wrapper  
`.slack_blocks_to_jsx--header`: Header (name and time)  
`.slack_blocks_to_jsx--blocks`: blocks array mapping wrapper  
`.slack_blocks_to_jsx--block_wrapper`: wrapper around every block
`.slack_blocks_to_jsx__divider`: Divider Block  
`.slack_blocks_to_jsx__section`: Section Block  
`.slack_blocks_to_jsx__image`: Image Block  
`.slack_blocks_to_jsx__context`: Context Block  
`.slack_blocks_to_jsx__actions`: Actions Block  
`.slack_blocks_to_jsx__input`: Input Block  
`.slack_blocks_to_jsx__rich_text`: Rich Text Block  
`.slack_blocks_to_jsx__rich_text_list_element`: Rich Text Block List Element  
`.slack_blocks_to_jsx__rich_text_preformatted_element`: Rich Text Block Preformatted Element  
`.slack_blocks_to_jsx__rich_text_quote_element`: Rich Text Block Element Quote Element  
`.slack_blocks_to_jsx__rich_text_section_element`: Rich Text Block Section Element

...as so on (all the other classes will be similar too, for example `.slack_blocks_to_jsx__rich_text_section_element_user` for Rich Text Block Section Element User)

If you want any other customization so please raise a github issue or mail me at codeemash@gmail.com. I will try to push it asap if it aligns with the library development vision.

## Development and Contribution

The project is open-source, and contributions are welcome. If you encounter any issues or want to suggest improvements, please file an issue on the GitHub repository:

[GitHub Repository Issues](https://github.com/themashcodee/slack-blocks-to-jsx/issues)

## License

The project is licensed under the MIT license, allowing free use, modification, and distribution.

## Support

Love my open source work or anything else I do? Treat me to a coffee! 😊

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/themashcodee)
