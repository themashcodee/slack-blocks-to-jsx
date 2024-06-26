import { EmphasisSubElement } from "../types";
import { Delete } from "./delete";
import { Text } from "./text";

type Props = {
  element: EmphasisSubElement;
};

export const Emphasis = (props: Props) => {
  const { element } = props;

  return (
    <em>
      {element.children.map((child, i) => {
        if (child.type === "delete") return <Delete key={i} element={child} />;
        return <Text key={i} element={child} />;
      })}
    </em>
  );
};
