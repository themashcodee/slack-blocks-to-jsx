import { ReactNode } from "react";
import parse from "html-react-parser";
import { slack_text_parser } from "./slack_text_parser";

type Options = {
  markdown: boolean;
};

export const slack_text_to_jsx = (text: string, parse_options: Options): ReactNode => {
  if (!text) return null;
  const html_string = slack_text_parser(text, { markdown: parse_options.markdown });
  return parse(html_string, { trim: false });
};
