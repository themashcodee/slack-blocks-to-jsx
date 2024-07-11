import { useGlobalData } from "../../../store";
import { parseEmojis } from "../../emojis";
import { SlackEmojiSubElement } from "../types";

type Props = {
  element: SlackEmojiSubElement;
};

export const SlackEmoji = (props: Props) => {
  const { element } = props;
  const { hooks } = useGlobalData();

  if (hooks.emoji) {
    const custom_emoji = hooks.emoji(element.value);
    if (custom_emoji !== "fallback") return <>{custom_emoji}</>;
  }

  return <span className="slack_emoji">{parseEmojis(`:${element.value}:`)}</span>;
};
