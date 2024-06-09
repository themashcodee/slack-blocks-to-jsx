import { ReactNode } from "react";
import parse from "html-react-parser";
import { toHTML as slack_text_parser } from "slack-markdown";
import { GlobalStore } from "../store";

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

  // REPLACE LINE BREAKS
  text_string = text_string.replace(/(\n)+/g, (match) => {
    return match.replace(/\n/g, (newline, index) => {
      return index === 0
        ? "<span class='slack_blocks_to_jsx__line_break'></span>"
        : "<span class='slack_blocks_to_jsx__line_break_not_first'></span>";
    });
  });

  text_string = slack_text_parser(text_string, {
    escapeHTML: false,
    slackCallbacks: {
      user(data) {
        const user = users.find((u) => u.id === data.id || u.name === data.name);
        // if (hooks.user) return hooks.user(user || data);
        const label = user?.name || data.id || data.name;
        return `<span class="slack_user" data-user-id="${user?.id || data.id}">@${label}</span>`;
      },
      channel(data) {
        const channel = channels.find((c) => c.id === data.id || c.name === data.name);
        // if (hooks.channel) return hooks.channel(channel || data);
        const label = channel?.name || data.id || data.name;
        return `<span class="slack_channel" data-channel-id="${
          channel?.id || data.id
        }">#${label}</span>`;
      },
      atChannel(data) {
        const channel = channels.find((c) => c.name === data.name);
        // if (hooks.atChannel) return hooks.atChannel(channel || data);
        const label = channel?.name || data.name;
        return `<span class="slack_channel" data-channel-id="${channel?.id}">#${label}</span>`;
      },
      atEveryone() {
        return `<span class="slack_broadcast">@everyone</span>`;
      },
      atHere() {
        return `<span class="slack_broadcast">@everyone</span>`;
      },
      // ...(hooks.date && { date: hooks.date }),
      // ...(hooks.usergroup && { usergroup: hooks.usergroup }),
    },
  });

  return parse(text_string, { trim: false });
};
