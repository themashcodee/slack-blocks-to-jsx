import { ActionsBlock } from "../../types";
import { getElementComponent } from "..";

type ActionsProps = {
  data: ActionsBlock;
};

export const Actions = (props: ActionsProps) => {
  const { elements, block_id } = props.data;

  return (
    <div
      id={block_id}
      className="mb-2 text-primary flex w-full text-black-primary dark:text-dark-text-primary items-center slack_blocks_to_jsx__actions"
    >
      <div className="flex flex-wrap">
        {elements.map((element, i) => (
          <div key={i} className="mt-2 mr-2">
            {getElementComponent(element)}
          </div>
        ))}
      </div>
    </div>
  );
};
