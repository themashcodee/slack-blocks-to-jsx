import { DeleteSubElement } from "../types";
import { SlackDate } from "./slack_date";
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

        return <Text key={i} element={child} />;
      })}
    </s>
  );
};
