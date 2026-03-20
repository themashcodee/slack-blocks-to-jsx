import { useState } from "react";
import type { ButtonElement as ButtonElementType } from "../../types";
import { merge_classes } from "../../utils";
import { TextObject } from "../composition_objects";
import { ConfirmDialog } from "../composition_objects/confirm_dialog";

type TextObjectProps = {
  data: ButtonElementType;
};

export const ButtonElement = (props: TextObjectProps) => {
  const { text, action_id, url, style, accessibility_label, confirm } = props.data;
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (confirm) {
      setShowConfirm(true);
    } else if (url) {
      window.open(url, "_blank");
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        type="button"
        id={action_id}
        aria-label={accessibility_label}
        className={merge_classes([
          "px-2 pt-0 pb-[1px] text-small h-[28px] min-w-[56px] border rounded whitespace-nowrap font-semibold",
          "slack_blocks_to_jsx__button_element",
          style === "primary"
            ? "bg-green-primary text-white-primary"
            : style === "danger"
              ? "bg-red-primary text-white-primary"
              : "border-black-primary.3 text-black-primary dark:border-dark-border dark:text-dark-text-primary",
        ])}
        onClick={handleClick}
      >
        <TextObject data={text} />
      </button>

      {showConfirm && confirm && (
        <ConfirmDialog data={confirm} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </>
  );
};
