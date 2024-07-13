import { RichTextSectionUser as RichTextSectionUserType } from "../../../types";
import { useGlobalData } from "../../../store";
import { merge_classes } from "../../../utils";

type Props = RichTextSectionUserType;

export const RichTextSectionUser = (props: Props) => {
  const { user_id, style } = props;
  const { users, hooks } = useGlobalData();

  const user = users.find((u) => u.id === user_id || u.name === user_id);
  const label = user?.name || user_id;

  if (hooks.user) return <>{hooks.user(user || { id: user_id, name: label })}</>;

  return (
    <span
      data-user-id={user?.id || user_id}
      className={merge_classes([
        "slack_user",
        "slack_blocks_to_jsx__rich_text_section_element_user",
        style?.italic ? "italic" : "",
        style?.strike ? "line-through" : "",
        style?.bold ? "font-medium" : "",
      ])}
    >
      @{label}
    </span>
  );
};
