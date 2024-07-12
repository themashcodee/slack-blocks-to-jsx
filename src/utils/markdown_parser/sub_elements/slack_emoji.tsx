import { useGlobalData } from "../../../store";
import { parseEmojis } from "../../emojis";
import { SlackEmojiSubElement } from "../types";

type Props = {
  element: SlackEmojiSubElement;
};

export const SlackEmoji = (props: Props) => {
  const { element } = props;
  const { hooks } = useGlobalData();

  if (hooks.emoji) return hooks.emoji(element.value, (name) => parseEmojis(`:${name}:`));

  return <span className="slack_emoji">{parseEmojis(`:${element.value}:`)}</span>;
};
