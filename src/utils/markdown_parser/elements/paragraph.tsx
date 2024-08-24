import {
  Delete,
  Emphasis,
  InlineCode,
  Link,
  SlackBroadcast,
  SlackChannelMention,
  SlackDate,
  SlackEmoji,
  SlackUserGroupMention,
  SlackUserMention,
  Strong,
  Text,
} from "../sub_elements";
import { ParagraphElement } from "../types";

type Props = {
  element: ParagraphElement;
};

export const Paragraph = (props: Props) => {
  const { element } = props;

  return (
    <p>
      {element.children.map((subelement, i) => {
        if (subelement.type === "text") return <Text key={i} element={subelement} />;
        if (subelement.type === "emphasis") return <Emphasis key={i} element={subelement} />;
        if (subelement.type === "inlineCode") return <InlineCode key={i} element={subelement} />;
        if (subelement.type === "delete") return <Delete key={i} element={subelement} />;
        if (subelement.type === "strong") return <Strong key={i} element={subelement} />;
        if (subelement.type === "link") return <Link key={i} element={subelement} />;
        if (subelement.type === "slack_user_mention")
          return <SlackUserMention key={i} element={subelement} />;
        if (subelement.type === "slack_channel_mention")
          return <SlackChannelMention key={i} element={subelement} />;
        if (subelement.type === "slack_user_group_mention")
          return <SlackUserGroupMention key={i} element={subelement} />;
        if (subelement.type === "slack_broadcast")
          return <SlackBroadcast key={i} element={subelement} />;
        if (subelement.type === "slack_date") return <SlackDate key={i} element={subelement} />;
        if (subelement.type === "slack_emoji") return <SlackEmoji key={i} element={subelement} />;

        return null;
      })}
    </p>
  );
};
