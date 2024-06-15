import { RichTextSectionUsergroup as RichTextSectionUserGroupType } from "../../../types";
import { useGlobalData } from "../../../store";

type Props = RichTextSectionUserGroupType;

export const RichTextSectionUserGroup = (props: Props) => {
  const { usergroup_id, style } = props;
  const { user_groups, hooks } = useGlobalData();

  const group = user_groups.find((u) => u.id === usergroup_id);
  const label = group?.name || usergroup_id;

  return (
    <div
      data-usergroup-id={usergroup_id}
      className={`
        inline-block
        slack_user_group
        ${style?.italic ? "italic" : ""}
        ${style?.strike ? "line-through" : ""}
        ${style?.bold ? "font-medium" : ""}
      `}
    >
      {hooks.usergroup ? hooks.usergroup(usergroup_id) : `@${label}`}
    </div>
  );
};
