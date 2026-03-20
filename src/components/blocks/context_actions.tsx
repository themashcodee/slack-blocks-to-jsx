import { ContextActionsBlock } from "../../types";
import { getElementComponent } from "..";

type ContextActionsProps = {
  data: ContextActionsBlock;
};

export const ContextActions = (props: ContextActionsProps) => {
  const { elements, block_id } = props.data;

  return (
    <div
      id={block_id}
      className="my-1 text-primary flex w-full text-black-primary dark:text-dark-text-primary items-center slack_blocks_to_jsx__context_actions"
    >
      <div className="flex flex-wrap">
        {elements.slice(0, 5).map((element, i) => {
          return (
            <div key={i} className="mt-2 mr-2">
              {getElementComponent(element)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
