import YozoraParser from "@yozora/parser";
import { Element } from "./types";
import { Blockquote, Paragraph, Code } from "./elements";
import { GlobalStore } from "../../store";

const parser = new YozoraParser().unmountTokenizer("@yozora/tokenizer-list");

type Options = {
  markdown: boolean;
  users: GlobalStore["users"];
  channels: GlobalStore["channels"];
  hooks: GlobalStore["hooks"];
};

// #region HELPER CODE
// TODO: HANDLE DATE PARSING
// TODO: HANDLE CHANNEL, USER, USER GROUP, @HERE, @EVERYONE, @CHANNEL PARSING
// text_string = slack_text_parser(text_string, {
//   escapeHTML: false,
//   slackCallbacks: {
//     user(data) {
//       const user = users.find((u) => u.id === data.id || u.name === data.name);
//       // if (hooks.user) return hooks.user(user || data);
//       const label = user?.name || data.id || data.name;
//       return `<span class="slack_user" data-user-id="${user?.id || data.id}">@${label}</span>`;
//     },
//     channel(data) {
//       const channel = channels.find((c) => c.id === data.id || c.name === data.name);
//       // if (hooks.channel) return hooks.channel(channel || data);
//       const label = channel?.name || data.id || data.name;
//       return `<span class="slack_channel" data-channel-id="${
//         channel?.id || data.id
//       }">#${label}</span>`;
//     },
//     atChannel(data) {
//       const channel = channels.find((c) => c.name === data.name);
//       // if (hooks.atChannel) return hooks.atChannel(channel || data);
//       const label = channel?.name || data.name;
//       return `<span class="slack_channel" data-channel-id="${channel?.id}">#${label}</span>`;
//     },
//     atEveryone() {
//       return `<span class="slack_broadcast">@everyone</span>`;
//     },
//     atHere() {
//       return `<span class="slack_broadcast">@everyone</span>`;
//     },
//     // ...(hooks.date && { date: hooks.date }),
//     // ...(hooks.usergroup && { usergroup: hooks.usergroup }),
//   },
// });
// #endregion

export const markdown_parser = (markdown: string, options: Options): JSX.Element | null => {
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

  const elements = parsed_data.children as unknown as Element[];

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
