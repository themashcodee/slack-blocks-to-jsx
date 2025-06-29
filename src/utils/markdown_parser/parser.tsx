import YozoraParser from "@yozora/parser";
import { ReactNode } from "react";
import { GlobalStore } from "../../store";
import { Blockquote, Code, Paragraph } from "./elements";
import {
  SlackBroadcastTokenizer,
  SlackChannelMentionTokenizer,
  SlackDateTokenizer,
  SlackEmojiTokenizer,
  SlackUserGroupMentionTokenizer,
  SlackUserMentionTokenizer,
} from "./tokenizers";
import { MarkdownElement } from "./types";

const parser = new YozoraParser()
  .unmountTokenizer("@yozora/tokenizer-list")
  .useTokenizer(new SlackUserMentionTokenizer())
  .useTokenizer(new SlackChannelMentionTokenizer())
  .useTokenizer(new SlackUserGroupMentionTokenizer())
  .useTokenizer(new SlackBroadcastTokenizer())
  .useTokenizer(new SlackDateTokenizer())
  .useTokenizer(new SlackEmojiTokenizer());

type Options = {
  markdown: boolean;
  users: GlobalStore["users"];
  channels: GlobalStore["channels"];
  hooks: GlobalStore["hooks"];
};

// Helper function to check if a string is a valid URL
function isValidURL(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

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
  text_string = text_string.replace(/<(?!(?:!date))([^|>]+)\|([^>]+)>/g, (match, link, label) => {
    if (isValidURL(link)) return `[${label}](${link})`;
    return match;
  });
  // CHANGE LINK FORMATTING FROM <link> to [link](link), EXCLUDING LINKS STARTING WITH !date
  text_string = text_string.replace(/<(?!(?:!date))([^|>]+)>/g, (match, link) => {
    if (isValidURL(link)) return `[${link}](${link})`;
    return match;
  });
  // REPLACE _\n with _[space]\n
  text_string = text_string.replace(/_\n/g, "_ \n");

  // ADD A SPACE BEFORE LINE BREAK AND AFTER THE :, SO IT DOES NOT MESS UP EMOJIS PARSING
  text_string = text_string.replace(/:\n/g, ": \n");

  // REPLACE CONSECUTIVE LINE BREAKS WITH CUSTOM SPACE
  text_string = text_string.replace(/\n\n+/g, (match) => "LBKS".repeat(match.length - 1));

  // Insert a blank line after blockquote lines if the next line is not a blockquote
  // This ensures only the line starting with '>' is treated as the blockquote.
  text_string = text_string.replace(/^>.*$(?!\n>)/gm, "$&\n");

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
