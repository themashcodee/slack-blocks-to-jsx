import { ReactNode } from "react";
import { GlobalStore } from "../store";
import { markdown_parser } from "./markdown_parser/parser";

type Options = {
  markdown: boolean;
  users: GlobalStore["users"];
  channels: GlobalStore["channels"];
  hooks: GlobalStore["hooks"];
};

export const slack_text_to_jsx = (text: string, parse_options: Options): ReactNode => {
  const { users, channels } = parse_options;

  if (!text) return null;
  let text_string = text;

  // REPLACE \N WITH LINE BREAK CHARACTER
  text_string = text_string.replace(/```/g, `\n\`\`\`\n`);
  // REPLACE SINGLE ASTERICS WITH DOUBLE ASTERICS
  text_string = text_string.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, "**$1**");
  // REPLACE SINGLE TILDE WITH DOUBLE TILDE
  text_string = text_string.replace(/(?<!~)~(?!~)([^~]+)~(?!~)/g, "~~$1~~");
  // CHANGE LINK FORMATING FROM <link|label> to [label](link)
  text_string = text_string.replace(/<([^|>]+)\|([^>]+)>/g, "[$2]($1)");
  // REPLACE \N\n WITH '[[DOUBLE_LINE_BREAK]]'
  text_string = text_string.replace(/\n\n/g, "[[DOUBLE_LINE_BREAK]]");

  return markdown_parser(text_string);

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
};
