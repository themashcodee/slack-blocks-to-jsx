import type { ButtonElement as ButtonElementType } from "../../types";
import { merge_classes } from "../../utils";
import { TextObject } from "../composition_objects";

type TextObjectProps = {
  data: ButtonElementType;
};

export const ButtonElement = (props: TextObjectProps) => {
  const { text, action_id, url, style, accessibility_label } = props.data;

  // TODO: ADD CONFIRM DIALOG

  return (
    <button
      type="button"
      id={action_id}
      aria-label={accessibility_label}
      className={merge_classes([
        "px-2 pt-0 pb-[1px] text-small h-[28px] min-w-[56px] border rounded whitespace-nowrap font-semibold",
        "slack_blocks_to_jsx__button_element",
        style === "primary"
          ? "bg-green-primary text-green-primary"
          : style === "danger"
          ? "bg-red-primary text-red-primary"
          : "border-black-primary.3 text-black-primary",
      ])}
      onClick={() => {
        if (url) {
          window.open(url, "_blank");
        }
      }}
    >
      <TextObject data={text} />
    </button>
  );
};
