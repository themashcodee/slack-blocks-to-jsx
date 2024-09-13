import { useGlobalData } from "../../../store";
import { SlackChannelMentionSubElement } from "../types";

type Props = {
  element: SlackChannelMentionSubElement;
};

export const SlackChannelMention = (props: Props) => {
  const { element } = props;
  const { hooks, channels } = useGlobalData();

  const channel_id = element.value;
  const channel = channels.find((u) => u.id === channel_id || u.name === channel_id);
  const label = channel?.name || channel_id.split("|")[1] || channel_id;

  if (hooks.channel) {
    return (
      <>
        {hooks.channel(
          channel || {
            id: channel_id.split("|")[0] || channel_id,
            name: label,
          },
        )}
      </>
    );
  }

  return (
    <span className="slack_channel" data-channel-id={channel?.id || channel_id}>
      #{label}
    </span>
  );
};
