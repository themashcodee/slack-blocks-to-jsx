import { BlockQuoteElement } from "../types";
import { Paragraph } from "./paragraph";

type Props = {
  element: BlockQuoteElement;
};

export const Blockquote = (props: Props) => {
  const { element } = props;

  return (
    <>
      {element.children.map((para, i) => {
        return <Paragraph key={i} element={para} />;
      })}
    </>
  );
};
