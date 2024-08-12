import { useGlobalData } from "../../../store";
import { RichTextSectionEmoji as RichTextSectionEmojiType } from "../../../types";
import { parseEmojis } from "../../../utils";

type Props = RichTextSectionEmojiType;

type Emoji = Omit<RichTextSectionEmojiType, "type">;

/**
 * Convert a Unicode string to an emoji character
 * e.g. "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fe" => 🫱🏻‍🫲🏾
 * @param unicodeString - string of Unicode code points separated by hyphens
 * @returns the emoji character represented by the Unicode string
 */
function convertUnicodeStrToEmoji(unicodeString: string) {
  // convert the Unicode string to an array of code points (integers between 0 and 0x10FFFF, inclusive)
  const codePoints = unicodeString.split("-").map((point) => parseInt(point, 16));

  // convert the code points to an emoji character
  const emoji = String.fromCodePoint(...codePoints);
  return emoji;
}

/**
 * Parse an emoji object into a string representation of the emoji
 * @param params - the emoji object
 * @param params.name - the name of the emoji
 * @param params.skin_tone - the skin tone of the emoji, if applicable
 * @param params.unicode - the Unicode code points of the emoji, if available
 * @returns the string representation of the emoji
 */
function parseEmoji({ name, skin_tone, unicode }: Emoji): string {
  // if the unicode is available, use it to render the emoji directly
  if (unicode) {
    const emojiFromUnicode = convertUnicodeStrToEmoji(unicode);
    if (emojiFromUnicode) {
      return emojiFromUnicode;
    }
  }

  // fallback to emoji libs
  // using the skin-tone variant, if present
  const fullyQualifiedEmojiName = skin_tone ? `${name}::skin-tone-${skin_tone}` : name;
  return parseEmojis(`:${fullyQualifiedEmojiName}:`);
}

export const RichTextSectionEmoji = (props: Props) => {
  const emojiElement = props;
  const { hooks } = useGlobalData();

  if (hooks.emoji) {
    return (
      <span className="slack_blocks_to_jsx__rich_text_section_element_emoji">
        {hooks.emoji(emojiElement, (emojiElement) => parseEmoji(emojiElement))}
      </span>
    );
  }

  return (
    <span className="slack_blocks_to_jsx__rich_text_section_element_emoji">
      {parseEmoji(emojiElement)}
    </span>
  );
};
