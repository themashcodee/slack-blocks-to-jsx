import { PlanBlock } from "../../types";
import { TaskCard } from "./task_card";

type PlanProps = {
  data: PlanBlock;
};

export const Plan = (props: PlanProps) => {
  const { title, tasks, block_id } = props.data;

  return (
    <div
      id={block_id}
      className="mt-2 mb-1 text-black-primary dark:text-dark-text-primary slack_blocks_to_jsx__plan"
    >
      <h3 className="text-header font-semibold mb-2 slack_blocks_to_jsx__plan_title">{title}</h3>

      {tasks && tasks.length > 0 && (
        <div className="flex flex-col gap-1 slack_blocks_to_jsx__plan_tasks">
          {tasks.map((task, i) => (
            <TaskCard key={task.task_id || i} data={task} />
          ))}
        </div>
      )}
    </div>
  );
};
