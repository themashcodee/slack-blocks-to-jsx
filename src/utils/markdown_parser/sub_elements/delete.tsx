import { DeleteSubElement } from "../types";
import { Text } from "./text";

type Props = {
  element: DeleteSubElement;
};

export const Delete = (props: Props) => {
  const { element } = props;

  return (
    <s>
      {element.children.map((child, i) => {
        return <Text key={i} element={child} />;
      })}
    </s>
  );
};
