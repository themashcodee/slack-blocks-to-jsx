import { RichTextSectionElement as RichTextSectionElementType } from "../../../types";
import { RichTextSectionBroadcast } from "./rich_text_section_broadcast";
import { RichTextSectionChannel } from "./rich_text_section_channel";
import { RichTextSectionEmoji } from "./rich_text_section_emoji";
import { RichTextSectionUser } from "./rich_text_section_user";
import { RichTextSectionUserGroup } from "./rich_text_section_user_group";

type RichTextSectionElementProps = {
  element: RichTextSectionElementType;
};

export const RichTextSectionElement = (props: RichTextSectionElementProps) => {
  const { element } = props;

  if (element.type === "user") return <RichTextSectionUser {...element} />;
  if (element.type === "channel") return <RichTextSectionChannel {...element} />;
  if (element.type === "broadcast") return <RichTextSectionBroadcast {...element} />;
  if (element.type === "emoji") return <RichTextSectionEmoji {...element} />;
  if (element.type === "usergroup") return <RichTextSectionUserGroup {...element} />;

  if (element.type === "text") {
    const { text, style } = element;

    return (
      <span
        className={`
              slack_blocks_to_jsx__rich_text_section_element_text
              ${style?.italic ? "italic" : ""}
              ${style?.strike ? "line-through" : ""}
              ${style?.code ? "slack_inline_code" : ""}
              ${style?.bold ? "font-medium" : ""}
            `}
      >
        {text}
      </span>
    );
  }

  if (element.type === "link") {
    const { url, style, text } = element;

    return (
      <a
        target="_blank"
        rel="noreferrer noopener"
        href={url}
        className={`
            slack_blocks_to_jsx__rich_text_section_element_link
          text-blue-primary hover:underline underline-offset-4
            ${style?.italic ? "italic" : ""}
            ${style?.strike ? "line-through" : ""}
            ${style?.code ? "slack_inline_code" : ""}
            ${style?.bold ? "font-medium" : ""}
          `}
      >
        {text}
      </a>
    );
  }

  return null;
};
