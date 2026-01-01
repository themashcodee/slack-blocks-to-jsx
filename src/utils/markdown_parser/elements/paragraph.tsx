import {
  Delete,
  Emphasis,
  HTML,
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
  isFirst?: boolean;
};

// Count leading LBKS markers in the first text element and return cleaned children
function processLeadingLineBreaks(children: ParagraphElement["children"]): {
  extraLineBreaks: number;
  processedChildren: ParagraphElement["children"];
} {
  if (children.length === 0) return { extraLineBreaks: 0, processedChildren: children };

  const firstChild = children[0];
  if (firstChild?.type !== "text") return { extraLineBreaks: 0, processedChildren: children };

  // Count how many LBKS markers are at the start
  const match = firstChild.value.match(/^(LBKS)+/);
  if (!match) return { extraLineBreaks: 0, processedChildren: children };

  const lbksCount = match[0].length / 4; // Each LBKS is 4 characters
  const remainingText = firstChild.value.slice(match[0].length);

  // Create new children array with the cleaned first element
  const processedChildren = [...children];
  if (remainingText) {
    processedChildren[0] = { ...firstChild, value: remainingText };
  } else {
    // If the first element is now empty, remove it
    processedChildren.shift();
  }

  return { extraLineBreaks: lbksCount, processedChildren };
}

export const Paragraph = (props: Props) => {
  const { element, isFirst = false } = props;

  const { extraLineBreaks, processedChildren } = processLeadingLineBreaks(element.children);

  return (
    <>
      {/* Render extra blank lines for additional newlines beyond \n\n */}
      {Array.from({ length: extraLineBreaks }).map((_, i) => (
        <span key={`lb-${i}`} className="block h-[1.2em]" />
      ))}
      <p className={isFirst ? undefined : "mt-[0.3em]"}>
        {processedChildren.map((subelement, i) => {
          if (subelement.type === "text") return <Text key={i} element={subelement} />;
          if (subelement.type === "html") return <HTML key={i} element={subelement} />;
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
    </>
  );
};
