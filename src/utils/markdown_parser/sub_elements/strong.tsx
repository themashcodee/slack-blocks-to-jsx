import { StrongSubElement } from "../types";
import { Delete } from "./delete";
import { SlackChannelMention } from "./slack_channel_mention";
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

        return <Text element={child} key={i} />;
      })}
    </strong>
  );
};
