import { RichTextSectionEmoji as RichTextSectionEmojiType } from "../../../types";
import { useGlobalData } from "../../../store";
import { parseEmojis } from "../../../utils";

type Props = RichTextSectionEmojiType;

export const RichTextSectionEmoji = (props: Props) => {
  const { name } = props;
  const { hooks } = useGlobalData();

  return <span>{hooks.emoji ? hooks.emoji(name) : parseEmojis(`:${name}:`)}</span>;
};
