import { RichTextSectionEmoji as RichTextSectionEmojiType } from "../../../types";
import { useGlobalData } from "../../../store";
import { parseEmojis } from "../../../utils";

type Props = RichTextSectionEmojiType;

export const RichTextSectionEmoji = (props: Props) => {
  const { name } = props;
  const { hooks } = useGlobalData();

  if (hooks.emoji) {
    const custom_emoji = hooks.emoji(name);
    if (custom_emoji !== "fallback") {
      return (
        <span className="slack_blocks_to_jsx__rich_text_section_element_emoji">{custom_emoji}</span>
      );
    }
  }

  return (
    <span className="slack_blocks_to_jsx__rich_text_section_element_emoji">
      {parseEmojis(`:${name}:`)}
    </span>
  );
};
