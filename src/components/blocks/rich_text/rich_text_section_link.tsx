import { RichTextSectionLink as RichTextSectionLinkType } from "../../../types";
import { useGlobalData } from "../../../store";
import { merge_classes } from "../../../utils";

type Props = RichTextSectionLinkType;

export const RichTextSectionLink = (props: Props) => {
  const { url, style, text } = props;
  const { hooks } = useGlobalData();

  // link elements may not have text prop when it is just a URL
  const linkText = text || url;

  if (hooks.link) {
    return (
      <>
        {hooks.link({
          href: url,
          target: "_blank",
          rel: "noreferrer noopener",
          className: merge_classes([
            "slack_blocks_to_jsx__rich_text_section_element_link",
            "text-blue-primary hover:underline underline-offset-4",
            style?.italic ? "italic" : "",
            style?.strike ? "line-through" : "",
            style?.code ? "slack_inline_code" : "",
            style?.bold ? "font-medium" : "",
          ]),
          children: linkText,
        })}
      </>
    );
  }

  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      href={url}
      className={merge_classes([
        "slack_blocks_to_jsx__rich_text_section_element_link",
        "text-blue-primary hover:underline underline-offset-4",
        style?.italic ? "italic" : "",
        style?.strike ? "line-through" : "",
        style?.code ? "slack_inline_code" : "",
        style?.bold ? "font-medium" : "",
      ])}
    >
      {linkText}
    </a>
  );
};
