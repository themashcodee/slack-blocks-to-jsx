import { LinkSubElement } from "../types";
import { Delete } from "./delete";
import { Emphasis } from "./emphasis";
import { Strong } from "./strong";
import { Text } from "./text";

type Props = {
  element: LinkSubElement;
};

export const Link = (props: Props) => {
  const { element } = props;

  return (
    <a href={element.url} className="slack_link">
      {element.children.map((child, i) => {
        if (child.type === "delete") return <Delete key={i} element={child} />;
        if (child.type === "emphasis") return <Emphasis key={i} element={child} />;
        if (child.type === "strong") return <Strong key={i} element={child} />;
        return <Text key={i} element={child} />;
      })}
    </a>
  );
};
