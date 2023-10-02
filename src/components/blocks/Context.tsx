import { ContextBlock } from "../../types";
import { ImageElement, TextObject } from "../elements";

type ContextProps = {
  data: ContextBlock;
};

export const Context = (props: ContextProps) => {
  const { elements, block_id } = props.data;

  return (
    <div
      id={block_id}
      className="my-1 text-primary flex w-full text-black-primary flex-wrap items-center"
    >
      {elements.map((element, i) => {
        if (element.type !== "image") {
          return (
            <span
              className="text-black-secondary text-small h-[25.25px] pr-3 flex items-center"
              key={i}
            >
              <TextObject data={element} />
            </span>
          );
        }

        return (
          <span key={i}>
            <ImageElement data={element} />
          </span>
        );
      })}
    </div>
  );
};
