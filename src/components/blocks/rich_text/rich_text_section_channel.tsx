import { RichTextSectionElementStyle } from "../../../original_types";
import { useGlobalData } from "../../../store";

type Props = {
  channel_id: string;
  style?: RichTextSectionElementStyle;
};

export const RichTextSectionChannel = (props: Props) => {
  const { channel_id, style } = props;
  const { channels, hooks } = useGlobalData();

  const channel = channels.find((u) => u.id === channel_id);
  const label = channel?.name || channel_id;

  return (
    <span
      data-channel-id={channel_id}
      className={`
        slack_channel
        ${style?.italic ? "italic" : ""}
        ${style?.strike ? "line-through" : ""}
        ${style?.bold ? "font-medium" : ""}
      `}
    >
      #{label}
    </span>
  );
};
