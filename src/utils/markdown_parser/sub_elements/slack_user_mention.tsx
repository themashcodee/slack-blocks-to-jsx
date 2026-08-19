import { useGlobalData } from "../../../store";
import { SlackUserMentionSubElement } from "../types";

type Props = {
  element: SlackUserMentionSubElement;
};

export const SlackUserMention = (props: Props) => {
  const { element } = props;
  const { hooks, users } = useGlobalData();

  const raw = element.value;
  const id_part = raw.split("|")[0] ?? raw;
  const fallback_label = raw.split("|")[1];
  const user = users.find((u) => u.id === id_part || u.name === id_part);
  const label = user?.name || fallback_label || id_part;

  if (hooks.user) {
    return (
      <>
        {hooks.user(
          user
            ? { ...user, style: undefined }
            : { id: id_part, name: label, style: undefined },
        )}
      </>
    );
  }

  return (
    <span className="slack_user" data-user-id={user?.id || id_part}>
      @{label}
    </span>
  );
};
