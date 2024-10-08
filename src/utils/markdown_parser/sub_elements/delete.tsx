import { DeleteSubElement } from "../types";
import { Emphasis } from "./emphasis";
import { Link } from "./link";
import { SlackDate } from "./slack_date";
import { SlackEmoji } from "./slack_emoji";
import { Strong } from "./strong";
import { Text } from "./text";

type Props = {
  element: DeleteSubElement;
};

export const Delete = (props: Props) => {
  const { element } = props;

  return (
    <s>
      {element.children.map((child, i) => {
        if (child.type === "slack_date") return <SlackDate key={i} element={child} />;
        if (child.type === "strong") return <Strong key={i} element={child} />;
        if (child.type === "emphasis") return <Emphasis key={i} element={child} />;
        if (child.type === "slack_emoji") return <SlackEmoji key={i} element={child} />;
        if (child.type === "link") return <Link key={i} element={child} />;

        return <Text key={i} element={child} />;
      })}
    </s>
  );
};
