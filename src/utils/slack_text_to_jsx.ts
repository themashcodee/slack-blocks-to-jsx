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
  const { users, channels, hooks } = parse_options;

  if (!text) return null;

  const html_string = slack_text_parser(text, {
    slackCallbacks: {
      user(data) {
        const user = users.find((u) => u.id === data.id || u.name === data.name);

        if (hooks.user) return hooks.user(user || data);

        const label = user?.name || data.id || data.name;
        return `<span class="slack_user" data-user-id="${user?.id || data.id}">@${label}</span>`;
      },
      channel(data) {
        const channel = channels.find((c) => c.id === data.id || c.name === data.name);

        if (hooks.channel) return hooks.channel(channel || data);

        const label = channel?.name || data.id || data.name;
        return `<span class="slack_channel" data-channel-id="${
          channel?.id || data.id
        }">#${label}</span>`;
      },
      atChannel(data) {
        const channel = channels.find((c) => c.name === data.name);

        if (hooks.atChannel) return hooks.atChannel(channel || data);

        const label = channel?.name || data.name;
        return `<span class="slack_channel" data-channel-id="${channel?.id}">#${label}</span>`;
      },
      ...(hooks.atEveryone && { atEveryone: hooks.atEveryone }),
      ...(hooks.atHere && { atHere: hooks.atHere }),
      ...(hooks.date && { date: hooks.date }),
      ...(hooks.usergroup && { usergroup: hooks.usergroup }),
    },
  });

  return parse(html_string, { trim: false });
};
