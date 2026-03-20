import type { IconButtonElement as IconButtonElementType } from "../../types";

type IconButtonElementProps = {
  data: IconButtonElementType;
};

export const IconButtonElement = (props: IconButtonElementProps) => {
  const { action_id, icon, text, accessibility_label } = props.data;

  return (
    <button
      type="button"
      id={action_id}
      aria-label={accessibility_label || text.text}
      title={text.text}
      className="flex items-center justify-center w-7 h-7 rounded border border-black-primary.3 dark:border-dark-border text-black-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-secondary slack_blocks_to_jsx__icon_button_element"
    >
      {icon === "trash" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      )}

      {icon !== "trash" && <span className="text-xs font-medium">{icon}</span>}
    </button>
  );
};
