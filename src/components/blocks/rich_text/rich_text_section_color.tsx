import { RichTextSectionColor as RichTextSectionColorType } from "../../../types";
import { merge_classes } from "../../../utils";

type Props = RichTextSectionColorType;

export const RichTextSectionColor = (props: Props) => {
  const { value, style } = props;

  return (
    <span
      className={merge_classes([
        "slack_blocks_to_jsx__rich_text_section_element_color inline-flex items-center gap-1",
        style?.italic ? "italic" : "",
        style?.strike ? "line-through" : "",
        style?.underline ? "underline" : "",
        style?.bold ? "font-semibold" : "",
      ])}
    >
      <span
        className="inline-block w-3 h-3 rounded-sm border border-black-primary/[0.13] dark:border-dark-border"
        style={{ backgroundColor: value }}
      />
      <span>{value}</span>
    </span>
  );
};
