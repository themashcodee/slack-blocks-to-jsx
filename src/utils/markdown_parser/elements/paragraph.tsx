import { Delete, Emphasis, InlineCode, Link, Strong, Text } from "../sub_elements";
import { ParagraphElement } from "../types";

type Props = {
  element: ParagraphElement;
};

export const Paragraph = (props: Props) => {
  const { element } = props;

  return (
    <>
      {element.children.map((subelement, i) => {
        if (subelement.type === "text") return <Text key={i} element={subelement} />;
        if (subelement.type === "emphasis") return <Emphasis key={i} element={subelement} />;
        if (subelement.type === "inlineCode") return <InlineCode key={i} element={subelement} />;
        if (subelement.type === "delete") return <Delete key={i} element={subelement} />;
        if (subelement.type === "strong") return <Strong key={i} element={subelement} />;
        if (subelement.type === "link") return <Link key={i} element={subelement} />;

        return null;
      })}
    </>
  );
};
