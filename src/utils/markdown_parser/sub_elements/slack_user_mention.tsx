import { useGlobalData } from "../../../store";
import { SlackUserMentionSubElement } from "../types";

type Props = {
  element: SlackUserMentionSubElement;
};

export const SlackUserMention = (props: Props) => {
  const { element } = props;
  const { hooks, users } = useGlobalData();

  const user_id = element.value;
  const user = users.find((u) => u.id === user_id || u.name === user_id);
  if (hooks.user) return <>{hooks.user(user || { id: user_id, name: user_id })}</>;
  const label = user?.name || user_id;

  return (
    <span className="slack_user" data-user-id={user?.id || user_id}>
      @{label}
    </span>
  );
};
