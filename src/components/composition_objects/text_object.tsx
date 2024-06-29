import { useGlobalData } from "../../store";
import type { TextObject as TextObjectType } from "../../types";
import { markdown_parser, parseEmojis } from "../../utils";

type TextObjectProps = {
  data: TextObjectType;
  className?: string;
};

export const TextObject = (props: TextObjectProps) => {
  const { type, text, emoji, verbatim = false } = props.data;
  const { className = "" } = props;
  const { channels, users, hooks } = useGlobalData();

  // TODO: HANDLE VERBATIM

  let emoji_parsed =
    type == "mrkdwn"
      ? hooks.emoji
        ? hooks.emoji(text)
        : parseEmojis(text)
      : emoji === false
      ? text
      : hooks.emoji
      ? hooks.emoji(text)
      : parseEmojis(text);

  // BASIC MARKDOWN PARSING
  emoji_parsed = emoji_parsed.replace(/&gt;/g, "> ").replace(/&lt;/g, "<");

  if (type === "plain_text")
    return (
      <div className={className}>
        {markdown_parser(emoji_parsed, { markdown: false, users, channels, hooks })}
      </div>
    );

  return (
    <div className={className}>
      {markdown_parser(emoji_parsed, { markdown: true, users, channels, hooks })}
    </div>
  );
};
