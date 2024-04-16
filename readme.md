# Slack Blocks to JSX

Playground - https://slack-block-to-jsx-playground.vercel.app/

### How to use

1. Install the Library
2. Import the CSS file in your entry point file `import "slack-blocks-to-jsx/dist/style.css"`
3. Import the component and use it `import { Message } from "slack-blocks-to-jsx"`
4. (optional) import the Block type to define the blocks for better type safety :)

   `import type { Block } from "slack-blocks-to-jsx"`

   `const blocks: Block[] = [...your slack blocks]`

   `<Message time={new Date()} name="Your Company" logo="https://commons.wikimedia.org/wiki/File:Google_%22G%22_logo.svg" blocks={blocks} />`

Note: This library is under development, if you need any functionality and it is not working/available yet in the library please raise an issue [here](https://github.com/themashcodee/slack-blocks-to-jsx/issues). I will try to fix it asap :).
