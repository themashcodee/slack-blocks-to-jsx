import type { TextObject as TextObjectType } from "../../types";
import { parseEmojis, slack_text_to_jsx } from "../../utils";

type TextObjectProps = {
  data: TextObjectType;
};

export const TextObject = (props: TextObjectProps) => {
  const { type, text, emoji, verbatim = false } = props.data;

  const emoji_parsed =
    type == "mrkdwn" ? parseEmojis(text) : emoji === false ? text : parseEmojis(text);

  if (type === "plain_text")
    return <div>{slack_text_to_jsx(emoji_parsed, { markdown: false })}</div>;

  return <div>{slack_text_to_jsx(emoji_parsed, { markdown: true })}</div>;
};
