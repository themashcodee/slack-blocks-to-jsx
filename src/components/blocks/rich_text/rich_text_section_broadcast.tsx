import { RichTextSectionBroadcast as RichTextSectionBroadcastType } from "../../../types";
import { useGlobalData } from "../../../store";
import { merge_classes } from "../../../utils";

type Props = RichTextSectionBroadcastType;

export const RichTextSectionBroadcast = (props: Props) => {
  const { range, style } = props;
  const { hooks } = useGlobalData();

  if (range === "channel" && hooks.atChannel) return <>{hooks.atChannel(style)}</>;
  if (range === "everyone" && hooks.atEveryone) return <>{hooks.atEveryone(style)}</>;
  if (range === "here" && hooks.atHere) return <>{hooks.atHere(style)}</>;

  return (
    <span
      className={merge_classes([
        "slack_broadcast",
        "slack_blocks_to_jsx__rich_text_section_element_broadcast",
        style?.italic ? "italic" : "",
        style?.strike ? "line-through" : "",
        style?.bold ? "font-medium" : "",
      ])}
    >
      @{range}
    </span>
  );
};
