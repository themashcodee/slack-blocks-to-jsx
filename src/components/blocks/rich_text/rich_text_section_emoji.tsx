import { RichTextSectionEmoji as RichTextSectionEmojiType } from "../../../original_types";
import { useGlobalData } from "../../../store";
import { parseEmojis } from "../../../utils";

type Props = RichTextSectionEmojiType;

export const RichTextSectionEmoji = (props: Props) => {
  const { name, skin_tone, unicode, style } = props;
  const { hooks } = useGlobalData();

  return (
    <span
      className={`
      ${style?.italic ? "italic" : ""}
      ${style?.strike ? "line-through" : ""}
      ${style?.bold ? "font-medium" : ""}
    `}
    >
      {hooks.emoji ? hooks.emoji(name) : parseEmojis(`:${name}:`, skin_tone, unicode)}
    </span>
  );
};
