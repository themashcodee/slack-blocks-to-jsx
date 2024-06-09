import { RichTextSectionElement as RichTextSectionElementType } from "../../../original_types";
import { parseEmojis } from "../../../utils";
import { RichTextSectionBroadcast } from "./rich_text_section_broadcast";
import { RichTextSectionChannel } from "./rich_text_section_channel";
import { RichTextSectionUser } from "./rich_text_section_user";

type RichTextSectionElementProps = {
  element: RichTextSectionElementType;
};

export const RichTextSectionElement = (props: RichTextSectionElementProps) => {
  const { element } = props;

  if (element.type === "text") {
    const { text, style } = element;

    return (
      <span
        className={`
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

  if (element.type === "user") {
    const { user_id, style } = element;
    return <RichTextSectionUser user_id={user_id} style={style} />;
  }

  if (element.type === "channel") {
    const { channel_id, style } = element;
    return <RichTextSectionChannel channel_id={channel_id} style={style} />;
  }

  if (element.type === "link") {
    const { url, style, text } = element;

    return (
      <a
        target="_blank"
        rel="noreferrer noopener"
        href={url}
        className={`
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

  if (element.type === "broadcast") {
    const { style, range } = element;
    return <RichTextSectionBroadcast range={range} style={style} />;
  }

  if (element.type === "emoji") {
    const { style, name, skin_tone, unicode } = element;

    return (
      <span
        className={`
          ${style?.italic ? "italic" : ""}
          ${style?.strike ? "line-through" : ""}
          ${style?.bold ? "font-medium" : ""}
        `}
      >
        {parseEmojis(`:${name}:`, skin_tone, unicode)}
      </span>
    );
  }

  if (element.type === "usergroup") {
    const { usergroup_id, style } = element;

    return (
      <span
        className={`
          ${style?.italic ? "italic" : ""}
          ${style?.strike ? "line-through" : ""}
          ${style?.bold ? "font-medium" : ""}
        `}
      >
        THIS IS NOT SUPPORTED YET [mail me codeemash@gmail.com to request for support]
      </span>
    );
  }

  return null;
};
