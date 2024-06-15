import { RichTextSectionUser as RichTextSectionUserType } from "../../../types";
import { useGlobalData } from "../../../store";

type Props = RichTextSectionUserType;

export const RichTextSectionUser = (props: Props) => {
  const { user_id, style } = props;
  const { users, hooks } = useGlobalData();

  const user = users.find((u) => u.id === user_id);
  const label = user?.name || user_id;

  return (
    <div
      data-user-id={user_id}
      className={`
        inline-block
        slack_user
        slack_blocks_to_jsx__rich_text_section_element_user
        ${style?.italic ? "italic" : ""}
        ${style?.strike ? "line-through" : ""}
        ${style?.bold ? "font-medium" : ""}
      `}
    >
      {hooks.user
        ? hooks.user(
            user || {
              id: user_id,
              name: label,
            },
          )
        : `@${label}`}
    </div>
  );
};
