import { DeleteSubElement } from "../types";
import { Emphasis } from "./emphasis";
import { SlackDate } from "./slack_date";
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

        return <Text key={i} element={child} />;
      })}
    </s>
  );
};
