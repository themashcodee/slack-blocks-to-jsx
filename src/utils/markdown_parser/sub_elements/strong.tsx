import { StrongSubElement } from "../types";
import { Text } from "./text";

type Props = {
  element: StrongSubElement;
};

export const Strong = (props: Props) => {
  const { element } = props;

  return (
    <strong>
      {element.children.map((child, i) => {
        return <Text element={child} key={i} />;
      })}
    </strong>
  );
};
