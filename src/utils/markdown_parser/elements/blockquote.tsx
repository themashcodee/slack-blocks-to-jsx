import { BlockQuoteElement } from "../types";
import { Paragraph } from "./paragraph";

type Props = {
  element: BlockQuoteElement;
};

export const Blockquote = (props: Props) => {
  const { element } = props;

  return (
    <div className="flex gap-2">
      <div className="w-1 rounded bg-gray-primary self-stretch"></div>

      <div>
        {element.children.map((para, i) => {
          return <Paragraph key={i} element={para} />;
        })}
      </div>
    </div>
  );
};
