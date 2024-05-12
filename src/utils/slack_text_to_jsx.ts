import { ReactNode } from "react";
import parse from "html-react-parser";
// import { slack_text_parser } from "./slack_text_parser";
import { toHTML } from "slack-markdown";

const slack_text_parser = toHTML;

type Options = {
  markdown: boolean;
  users: {
    id: string;
    name: string;
  }[];
  channels: {
    id: string;
    name: string;
  }[];
};

export const slack_text_to_jsx = (text: string, parse_options: Options): ReactNode => {
  const { markdown, users, channels } = parse_options;

  if (!text) return null;

  const html_string = slack_text_parser(text, {
    slackCallbacks: {
      user(data) {
        const user = users.find((u) => u.id === data.id || u.name === data.name);
        const label = user?.name || data.id || data.name;

        return `<span class="slack_user" data-user-id="${user?.id || data.id}">@${label}</span>`;
      },
      channel(data) {
        const channel = channels.find((c) => c.id === data.id || c.name === data.name);
        const label = channel?.name || data.id || data.name;

        return `<span class="slack_channel" data-channel-id="${
          channel?.id || data.id
        }">#${label}</span>`;
      },
    },
  });

  return parse(html_string, { trim: false });
};
