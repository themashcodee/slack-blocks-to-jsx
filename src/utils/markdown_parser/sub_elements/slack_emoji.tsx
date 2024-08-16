import { useGlobalData } from "../../../store";
import { parseEmojis } from "../../emojis";
import { SlackEmojiSubElement } from "../types";

type Props = {
  element: SlackEmojiSubElement;
};

export const SlackEmoji = (props: Props) => {
  const { element } = props;
  const { hooks } = useGlobalData();

  if (hooks.emoji)
    return (
      <span className="slack_emoji">
        {hooks.emoji({ name: element.value }, (emojiElement) => parseEmojis(emojiElement))}
      </span>
    );

  return <span className="slack_emoji">{parseEmojis({ name: element.value })}</span>;
};
