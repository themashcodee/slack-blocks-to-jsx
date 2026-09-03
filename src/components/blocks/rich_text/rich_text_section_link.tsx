import { RichTextSectionLink as RichTextSectionLinkType } from "../../../types";
import { useGlobalData } from "../../../store";
import { merge_classes } from "../../../utils";

type Props = RichTextSectionLinkType;

export const RichTextSectionLink = (props: Props) => {
  const { url, style, text } = props;
  const { hooks, urlTransform } = useGlobalData();
  const href = urlTransform(url, "link");

  // link elements may not have text prop when it is just a URL
  const linkText = text || url;

  if (hooks.link && href !== undefined) {
    return (
      <>
        {hooks.link({
          href,
          target: "_blank",
          rel: "noreferrer noopener",
          className: merge_classes([
            "slack_blocks_to_jsx__rich_text_section_element_link",
            "text-blue-primary dark:text-dark-link hover:underline underline-offset-4",
            style?.italic ? "italic" : "",
            style?.strike ? "line-through" : "",
            style?.underline ? "underline" : "",
            style?.code ? "slack_inline_code" : "",
            style?.bold ? "font-semibold" : "",
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
      href={href}
      className={merge_classes([
        "slack_blocks_to_jsx__rich_text_section_element_link",
        "text-blue-primary dark:text-dark-link hover:underline underline-offset-4",
        style?.italic ? "italic" : "",
        style?.strike ? "line-through" : "",
        style?.underline ? "underline" : "",
        style?.code ? "slack_inline_code" : "",
        style?.bold ? "font-semibold" : "",
      ])}
    >
      {linkText}
    </a>
  );
};
