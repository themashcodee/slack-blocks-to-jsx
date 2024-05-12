import { ReactNode } from "react";
import parse from "html-react-parser";
// import { slack_text_parser } from "./slack_text_parser";
import { toHTML } from "slack-markdown";

const slack_text_parser = toHTML;

type Options = {
  markdown: boolean;
};

export const slack_text_to_jsx = (text: string, parse_options: Options): ReactNode => {
  if (!text) return null;
  const html_string = slack_text_parser(text, {
    slackCallbacks: {
      user(data) {
        return `<span class="slack_user" data-user-id="${data.id}">@Manish Panwar</span>`;
      },
    },
  });
  return parse(html_string, { trim: false });
};
