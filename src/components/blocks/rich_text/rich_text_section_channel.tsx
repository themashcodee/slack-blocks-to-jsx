import { RichTextSectionChannel as RichTextSectionChannelType } from "../../../types";
import { useGlobalData } from "../../../store";
import { merge_classes } from "../../../utils";

type Props = RichTextSectionChannelType;

export const RichTextSectionChannel = (props: Props) => {
  const { channel_id, style } = props;
  const { channels, hooks } = useGlobalData();

  const channel = channels.find((u) => u.id === channel_id || u.name === channel_id);
  const label = channel?.name || channel_id;

  if (hooks.channel) {
    return (
      <>{hooks.channel(channel ? { ...channel, style } : { id: channel_id, name: label, style })}</>
    );
  }

  return (
    <span
      data-channel-id={channel?.id || channel_id}
      className={merge_classes([
        "slack_channel",
        "slack_blocks_to_jsx__rich_text_section_element_channel",
        style?.italic ? "italic" : "",
        style?.strike ? "line-through" : "",
        style?.bold ? "font-medium" : "",
      ])}
    >
      #{label}
    </span>
  );
};
