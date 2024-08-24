import { ContextBlock } from "../../types";
import { TextObject } from "../composition_objects";
import { ImageElement } from "../elements";

type ContextProps = {
  data: ContextBlock;
};

export const Context = (props: ContextProps) => {
  const { elements, block_id } = props.data;

  return (
    <div
      id={block_id}
      className="my-1 text-primary flex w-full text-black-primary flex-wrap items-center overflow-hidden slack_blocks_to_jsx__context"
    >
      {elements.slice(0, 10).map((element, i) => {
        if (element.type !== "image") {
          return (
            <div className="text-black-secondary text-small pr-3 flex items-center" key={i}>
              <TextObject data={element} />
            </div>
          );
        }

        return <ImageElement key={i} inside="context" data={element} />;
      })}
    </div>
  );
};
