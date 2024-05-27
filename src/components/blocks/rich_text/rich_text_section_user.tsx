import { RichTextSectionElementStyle } from "../../../original_types";
import { useGlobalData } from "../../../store";

type Props = {
  user_id: string;
  style?: RichTextSectionElementStyle;
};

export const RichTextSectionUser = (props: Props) => {
  const { user_id, style } = props;
  const { users, hooks } = useGlobalData();

  const user = users.find((u) => u.id === user_id);
  const label = user?.name || user_id;

  return (
    <span
      data-user-id={user_id}
      className={`
        slack_user
        ${style?.italic ? "italic" : ""}
        ${style?.strike ? "line-through" : ""}
        ${style?.bold ? "font-medium" : ""}
      `}
    >
      @{label}
    </span>
  );
};
