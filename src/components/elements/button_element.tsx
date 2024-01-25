import type { ButtonElement as ButtonElementType } from "../../types";
import { TextObject } from "../composition_objects";

type TextObjectProps = {
  data: ButtonElementType;
};

export const ButtonElement = (props: TextObjectProps) => {
  const { text, action_id, url, style, accessibility_label } = props.data;

  // TODO: ADD CONFIRM DIALOG

  return (
    <button
      id={action_id}
      aria-label={accessibility_label}
      className={`px-2 pt-0 pb-[1px] text-small h-[28px] min-w-[56px] border rounded whitespace-nowrap font-semibold slack_blocks_to_jsx__button ${
        style === "primary"
          ? "border-green-primary.3 text-green-primary"
          : style === "danger"
          ? "border-red-primary.3 text-red-primary"
          : "border-black-primary.3 text-black-primary"
      }`}
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
