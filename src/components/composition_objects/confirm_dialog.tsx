import type { ConfirmDialogObject } from "../../types";
import { TextObject } from "./text_object";
import { merge_classes } from "../../utils";

type ConfirmDialogProps = {
  data: ConfirmDialogObject;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { data, onConfirm, onCancel } = props;
  const { title, text, confirm, deny, style } = data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center slack_blocks_to_jsx__confirm_dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" />

      <div className="relative z-10 w-full max-w-[400px] bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg border border-gray-primary dark:border-dark-border">
        <div className="px-5 pt-4 pb-3 border-b border-gray-primary dark:border-dark-border">
          <div className="font-semibold text-black-primary dark:text-dark-text-primary">
            <TextObject data={title} />
          </div>
        </div>

        <div className="px-5 py-4 text-small text-black-primary dark:text-dark-text-primary">
          <TextObject data={text} />
        </div>

        <div className="flex justify-end gap-2 px-5 pb-4">
          <button
            type="button"
            className="px-3 py-1.5 text-small font-semibold rounded border border-black-primary.3 dark:border-dark-border text-black-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
            onClick={onCancel}
          >
            <TextObject data={deny} />
          </button>

          <button
            type="button"
            className={merge_classes([
              "px-3 py-1.5 text-small font-semibold rounded",
              style === "danger"
                ? "bg-red-primary text-white-primary"
                : "bg-green-primary text-white-primary",
            ])}
            onClick={onConfirm}
          >
            <TextObject data={confirm} />
          </button>
        </div>
      </div>
    </div>
  );
};
