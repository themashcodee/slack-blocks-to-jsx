import { RichTextSectionElement as RichTextSectionElementType } from "../../../types";
import { merge_classes } from "../../../utils";
import { SlackDate } from "../../../utils/markdown_parser/sub_elements";
import { RichTextSectionBroadcast } from "./rich_text_section_broadcast";
import { RichTextSectionChannel } from "./rich_text_section_channel";
import { RichTextSectionEmoji } from "./rich_text_section_emoji";
import { RichTextSectionLink } from "./rich_text_section_link";
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
  if (element.type === "link") return <RichTextSectionLink {...element} />;

  if (element.type === "text") {
    const { text, style } = element;

    return (
      <span
        className={merge_classes([
          "slack_blocks_to_jsx__rich_text_section_element_text",
          style?.italic ? "italic" : "",
          style?.strike ? "line-through" : "",
          style?.underline ? "underline" : "",
          style?.code ? "slack_inline_code" : "",
          style?.bold ? "font-bold" : "",
        ])}
      >
        {text}
      </span>
    );
  }

  if (element.type === "date") {
    const { timestamp, format, style } = element;

    return (
      <span
        className={merge_classes([
          "slack_blocks_to_jsx__rich_text_section_element_date",
          style?.italic ? "italic" : "",
          style?.strike ? "line-through" : "",
          style?.underline ? "underline" : "",
          style?.code ? "slack_inline_code" : "",
          style?.bold ? "font-bold" : "",
        ])}
      >
        <SlackDate
          element={{
            type: "slack_date",
            value: {
              fallbackText: "",
              optionalLink: "",
              timestamp: timestamp.toString(),
              tokenString: format,
            },
          }}
        />
      </span>
    );
  }

  return null;
};
