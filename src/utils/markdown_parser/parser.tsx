import YozoraParser from "@yozora/parser";
import { MarkdownElement } from "./types";
import { Blockquote, Paragraph, Code } from "./elements";
import { GlobalStore } from "../../store";
import {
  SlackUserMentionTokenizer,
  SlackChannelMentionTokenizer,
  SlackUserGroupMentionTokenizer,
} from "./tokenizers";
import { ReactNode } from "react";

const parser = new YozoraParser()
  .unmountTokenizer("@yozora/tokenizer-list")
  .useTokenizer(new SlackUserMentionTokenizer())
  .useTokenizer(new SlackChannelMentionTokenizer())
  .useTokenizer(new SlackUserGroupMentionTokenizer());

type Options = {
  markdown: boolean;
  users: GlobalStore["users"];
  channels: GlobalStore["channels"];
  hooks: GlobalStore["hooks"];
};

// #region HELPER CODE
// TODO: HANDLE DATE PARSING
// TODO: HANDLE @HERE, @EVERYONE, @CHANNEL PARSING (class - slack_broadcast)
//     // ...(hooks.date && { date: hooks.date }),
// #endregion

export const markdown_parser = (markdown: string, options: Options): ReactNode => {
  if (!markdown) return null;

  let text_string = markdown;

  // TRANSFORM ``` TO MAKE IT A CODE BLOCK INSTEAD OF INLINE CODE BLOCK
  text_string = text_string.replace(/```/g, `\n\`\`\`\n`);
  // REPLACE SINGLE asterisk WITH DOUBLE asterisk
  text_string = text_string.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, "**$1**");
  // REPLACE SINGLE tilde WITH DOUBLE tilde
  text_string = text_string.replace(/(?<!~)~(?!~)([^~]+)~(?!~)/g, "~~$1~~");
  // CHANGE LINK FORMATING FROM <link|label> to [label](link)
  text_string = text_string.replace(/<([^|>]+)\|([^>]+)>/g, "[$2]($1)");
  // REPLACE \n\n WITH '[[DOUBLE_LINE_BREAK]]' to prevent @yozora/parser to eat it
  text_string = text_string.replace(/\n\n/g, "[[DOUBLE_LINE_BREAK]]");

  const parsed_data = parser.parse(text_string);

  const elements = parsed_data.children as unknown as MarkdownElement[];

  return (
    <div>
      {elements.map((element, i) => {
        if (element.type === "paragraph") return <Paragraph key={i} element={element} />;
        if (element.type === "blockquote") return <Blockquote key={i} element={element} />;
        if (element.type === "code") return <Code key={i} element={element} />;

        return null;
      })}
    </div>
  );
};
