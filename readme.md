# Slack Blocks to JSX

### How to use

1. Install the Library
2. Import the CSS file in your entry point file `import "slack-blocks-to-jsx/dist/style.css"`
3. Import the component and use it `import { Message } from "slack-blocks-to-jsx"`
4. (optional) import the Block type to define the blocks for better type safety :)

   `import type { Block } from "slack-blocks-to-jsx"`

   `const blocks: Block[] = [...your slack blocks]`
