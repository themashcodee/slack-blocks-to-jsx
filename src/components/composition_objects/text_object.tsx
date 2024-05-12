import { useGlobalData } from "../../store";
import type { TextObject as TextObjectType } from "../../types";
import { parseEmojis, slack_text_to_jsx } from "../../utils";

type TextObjectProps = {
  data: TextObjectType;
  className?: string;
};

export const TextObject = (props: TextObjectProps) => {
  const { type, text, emoji, verbatim = false } = props.data;
  const { className = "" } = props;
  const { channels, users } = useGlobalData();

  // TODO: HANDLE VERBATIM

  let emoji_parsed =
    type == "mrkdwn" ? parseEmojis(text) : emoji === false ? text : parseEmojis(text);

  // BASIC MARKDOWN PARSING
  emoji_parsed = emoji_parsed.replace(/&gt;/g, "> ").replace(/&lt;/g, "<");

  if (type === "plain_text")
    return (
      <div className={className}>
        {slack_text_to_jsx(emoji_parsed, { markdown: false, users, channels })}
      </div>
    );

  return (
    <div className={className}>
      {slack_text_to_jsx(emoji_parsed, { markdown: true, users, channels })}
    </div>
  );
};
