import { RichTextSectionBroadcast as RichTextSectionBroadcastType } from "../../../types";
import { useGlobalData } from "../../../store";

type Props = RichTextSectionBroadcastType;

export const RichTextSectionBroadcast = (props: Props) => {
  const { range, style } = props;
  const { hooks } = useGlobalData();

  return (
    <div
      className={`
        inline-block
        slack_broadcast
        slack_blocks_to_jsx__rich_text_section_element_broadcast
        ${style?.italic ? "italic" : ""}
        ${style?.strike ? "line-through" : ""}
        ${style?.bold ? "font-medium" : ""}
      `}
    >
      {range === "channel" && (hooks.atChannel ? hooks.atChannel() : `@${range}`)}
      {range === "everyone" && (hooks.atEveryone ? hooks.atEveryone() : `@${range}`)}
      {range === "here" && (hooks.atHere ? hooks.atHere() : `@${range}`)}
    </div>
  );
};
