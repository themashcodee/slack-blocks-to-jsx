import YozoraParser from "@yozora/parser";
import { MarkdownElement } from "./types";
import { Blockquote, Paragraph, Code } from "./elements";
import { GlobalStore } from "../../store";
import {
  SlackUserMentionTokenizer,
  SlackChannelMentionTokenizer,
  SlackUserGroupMentionTokenizer,
  SlackBroadcastTokenizer,
  SlackDateTokenizer,
} from "./tokenizers";
import { ReactNode } from "react";

const parser = new YozoraParser()
  .unmountTokenizer("@yozora/tokenizer-list")
  .useTokenizer(new SlackUserMentionTokenizer())
  .useTokenizer(new SlackChannelMentionTokenizer())
  .useTokenizer(new SlackUserGroupMentionTokenizer())
  .useTokenizer(new SlackBroadcastTokenizer())
  .useTokenizer(new SlackDateTokenizer());

type Options = {
  markdown: boolean;
  users: GlobalStore["users"];
  channels: GlobalStore["channels"];
  hooks: GlobalStore["hooks"];
};

// #region HELPER CODE
// TODO: HANDLE DATE PARSING ...(hooks.date && { date: hooks.date }),
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
  // CHANGE LINK FORMATTING FROM <link|label> to [label](link), EXCLUDING LINKS STARTING WITH !date
  text_string = text_string.replace(/<(?!(?:!date))([^|>]+)\|([^>]+)>/g, "[$2]($1)");
  // REPLACE \n\n WITH '[[DOUBLE_LINE_BREAK]]' to prevent @yozora/parser to eat it
  text_string = text_string.replace(/\n\n/g, "[[DOUBLE_LINE_BREAK]]");
  // REPLACE <!here> with @here
  text_string = text_string.replace(/<!here>/g, "@here");
  // REPLACE <!everyone> with @everyone
  text_string = text_string.replace(/<!everyone>/g, "@everyone");
  // REPLACE <!channel> with @channel
  text_string = text_string.replace(/<!channel>/g, "@channel");

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
