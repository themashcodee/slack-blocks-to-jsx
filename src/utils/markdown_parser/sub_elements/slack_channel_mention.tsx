import { useGlobalData } from "../../../store";
import { SlackChannelMentionSubElement } from "../types";

type Props = {
  element: SlackChannelMentionSubElement;
};

export const SlackChannelMention = (props: Props) => {
  const { element } = props;
  const { hooks, channels } = useGlobalData();

  const raw = element.value;
  const id_part = raw.split("|")[0] ?? raw;
  const fallback_label = raw.split("|")[1];
  const channel = channels.find((u) => u.id === id_part || u.name === id_part);
  const label = channel?.name || fallback_label || id_part;

  if (hooks.channel) {
    return (
      <>
        {hooks.channel(
          channel
            ? { ...channel, style: undefined }
            : { id: id_part, name: label, style: undefined },
        )}
      </>
    );
  }

  return (
    <span className="slack_channel" data-channel-id={channel?.id || id_part}>
      #{label}
    </span>
  );
};
