import { useGlobalData } from "../../../store";
import { SlackUserGroupMentionSubElement } from "../types";

type Props = {
  element: SlackUserGroupMentionSubElement;
};

export const SlackUserGroupMention = (props: Props) => {
  const { element } = props;
  const { hooks, user_groups } = useGlobalData();

  const raw = element.value;
  const id_part = raw.split("|")[0] ?? raw;
  const fallback_label = raw.split("|")[1];
  const group = user_groups.find((u) => u.id === id_part || u.name === id_part);
  const label = group?.name || fallback_label || id_part;

  if (hooks.usergroup) {
    return (
      <>
        {hooks.usergroup(
          group
            ? { ...group, style: undefined }
            : { id: id_part, name: label, style: undefined },
        )}
      </>
    );
  }

  return (
    <span data-usergroup-id={group?.id || id_part} className="slack_user_group">
      @{label}
    </span>
  );
};
