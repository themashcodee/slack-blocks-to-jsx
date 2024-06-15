import { RichTextSectionEmoji as RichTextSectionEmojiType } from "../../../types";
import { useGlobalData } from "../../../store";
import { parseEmojis } from "../../../utils";

type Props = RichTextSectionEmojiType;

export const RichTextSectionEmoji = (props: Props) => {
  const { name } = props;
  const { hooks } = useGlobalData();

  return (
    <span className="slack_blocks_to_jsx__rich_text_section_element_emoji">
      {hooks.emoji ? hooks.emoji(name) : parseEmojis(`:${name}:`)}
    </span>
  );
};
