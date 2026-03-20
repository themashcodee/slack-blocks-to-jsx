import type { WorkflowButtonElement as WorkflowButtonElementType } from "../../types";
import { merge_classes } from "../../utils";
import { TextObject } from "../composition_objects";

type WorkflowButtonElementProps = {
  data: WorkflowButtonElementType;
};

export const WorkflowButtonElement = (props: WorkflowButtonElementProps) => {
  const { text, action_id, style, accessibility_label } = props.data;

  return (
    <button
      type="button"
      id={action_id}
      aria-label={accessibility_label}
      className={merge_classes([
        "px-2 pt-0 pb-[1px] text-small h-[28px] min-w-[56px] border rounded whitespace-nowrap font-semibold",
        "slack_blocks_to_jsx__workflow_button_element",
        style === "primary"
          ? "bg-green-primary text-white-primary"
          : style === "danger"
            ? "bg-red-primary text-white-primary"
            : "border-black-primary.3 text-black-primary dark:border-dark-border dark:text-dark-text-primary",
      ])}
    >
      <TextObject data={text} />
    </button>
  );
};
