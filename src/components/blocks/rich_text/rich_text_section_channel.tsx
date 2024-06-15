import { RichTextSectionChannel as RichTextSectionChannelType } from "../../../original_types";
import { useGlobalData } from "../../../store";

type Props = RichTextSectionChannelType;

export const RichTextSectionChannel = (props: Props) => {
  const { channel_id, style } = props;
  const { channels, hooks } = useGlobalData();

  const channel = channels.find((u) => u.id === channel_id);
  const label = channel?.name || channel_id;

  return (
    <div
      data-channel-id={channel_id}
      className={`
        inline-block
        slack_channel
        ${style?.italic ? "italic" : ""}
        ${style?.strike ? "line-through" : ""}
        ${style?.bold ? "font-medium" : ""}
      `}
    >
      {hooks.user
        ? hooks.user(
            channel || {
              id: channel_id,
              name: label,
            },
          )
        : `#${label}`}
    </div>
  );
};
