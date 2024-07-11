import { StrongSubElement } from "../types";
import { Delete } from "./delete";
import { Emphasis } from "./emphasis";
import { SlackBroadcast } from "./slack_broadcast";
import { SlackChannelMention } from "./slack_channel_mention";
import { SlackDate } from "./slack_date";
import { SlackEmoji } from "./slack_emoji";
import { SlackUserGroupMention } from "./slack_user_group_mention";
import { SlackUserMention } from "./slack_user_mention";
import { Text } from "./text";

type Props = {
  element: StrongSubElement;
};

export const Strong = (props: Props) => {
  const { element } = props;

  return (
    <strong>
      {element.children.map((child, i) => {
        if (child.type === "delete") return <Delete key={i} element={child} />;
        if (child.type === "slack_user_mention")
          return <SlackUserMention key={i} element={child} />;
        if (child.type === "slack_channel_mention")
          return <SlackChannelMention key={i} element={child} />;
        if (child.type === "slack_user_group_mention")
          return <SlackUserGroupMention key={i} element={child} />;
        if (child.type === "slack_broadcast") return <SlackBroadcast key={i} element={child} />;
        if (child.type === "slack_date") return <SlackDate key={i} element={child} />;
        if (child.type === "emphasis") return <Emphasis key={i} element={child} />;
        if (child.type === "slack_emoji") return <SlackEmoji key={i} element={child} />;

        return <Text element={child} key={i} />;
      })}
    </strong>
  );
};
