import { useGlobalData } from "../../../store";
import { SlackUserGroupMentionSubElement } from "../types";

type Props = {
  element: SlackUserGroupMentionSubElement;
};

export const SlackUserGroupMention = (props: Props) => {
  const { element } = props;
  const { hooks, user_groups } = useGlobalData();

  const group_id = element.value;
  const group = user_groups.find((u) => u.id === group_id || u.name === group_id);
  const label = group?.name || group_id;

  if (hooks.usergroup) return <>{hooks.usergroup(group || { id: group_id, name: label })}</>;

  return (
    <span data-usergroup-id={group?.id || group_id} className="slack_user_group">
      @{label}
    </span>
  );
};
