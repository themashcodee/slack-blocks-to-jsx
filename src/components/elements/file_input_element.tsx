import type { FileInputElement as FileInputElementType } from "../../types";

type FileInputElementProps = {
  data: FileInputElementType;
};

export const FileInputElement = (props: FileInputElementProps) => {
  const { action_id, filetypes, max_files } = props.data;

  return (
    <div
      id={action_id}
      className="flex flex-col gap-2 text-small w-full slack_blocks_to_jsx__file_input_element"
    >
      <div className="flex items-center justify-center w-full h-[80px] rounded border-2 border-dashed border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary">
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            className="px-3 py-1 rounded border border-black-primary.3 dark:border-dark-border text-black-primary dark:text-dark-text-primary text-small font-medium hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
          >
            Choose file
          </button>

          {max_files && (
            <span className="text-[10px] text-black-secondary dark:text-dark-text-secondary">
              Max {max_files} file{max_files > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {filetypes && filetypes.length > 0 && (
        <div className="text-[11px] text-black-secondary dark:text-dark-text-secondary">
          Accepted: {filetypes.join(", ")}
        </div>
      )}
    </div>
  );
};
