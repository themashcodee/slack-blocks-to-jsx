import { useGlobalData } from "../../../store";
import { RichTextSectionEmoji as RichTextSectionEmojiType } from "../../../types";
import { parseEmojis } from "../../../utils";

type Props = RichTextSectionEmojiType;

export const RichTextSectionEmoji = (props: Props) => {
  const emojiElement = props;
  const { hooks } = useGlobalData();

  if (hooks.emoji) {
    return (
      <span className="slack_blocks_to_jsx__rich_text_section_element_emoji">
        {hooks.emoji(emojiElement, (emojiElement) => parseEmojis(emojiElement))}
      </span>
    );
  }

  return (
    <span className="slack_blocks_to_jsx__rich_text_section_element_emoji">
      {parseEmojis(emojiElement)}
    </span>
  );
};
