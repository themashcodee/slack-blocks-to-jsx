import { RichTextSectionUsergroup as RichTextSectionUserGroupType } from "../../../types";
import { useGlobalData } from "../../../store";
import { merge_classes } from "../../../utils";

type Props = RichTextSectionUserGroupType;

export const RichTextSectionUserGroup = (props: Props) => {
  const { usergroup_id, style } = props;
  const { user_groups, hooks } = useGlobalData();

  const group = user_groups.find((u) => u.id === usergroup_id || u.name === usergroup_id);
  const label = group?.name || usergroup_id;

  if (hooks.usergroup) return <>{hooks.usergroup(group || { id: usergroup_id, name: label })}</>;

  return (
    <span
      data-usergroup-id={group?.id || usergroup_id}
      className={merge_classes([
        "slack_user_group",
        "slack_blocks_to_jsx__rich_text_section_element_user_group",
        style?.italic ? "italic" : "",
        style?.strike ? "line-through" : "",
        style?.bold ? "font-medium" : "",
      ])}
    >
      @{label}
    </span>
  );
};
