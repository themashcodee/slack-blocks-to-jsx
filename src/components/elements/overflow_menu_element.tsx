import { useEffect, useState } from "react";
import type { OverflowMenuElement as OverflowMenuElementType } from "../../types";
import { TextObject } from "../composition_objects";

type OverflowMenuElementProps = {
  data: OverflowMenuElementType;
};

export const OverflowMenuElement = (props: OverflowMenuElementProps) => {
  const { action_id, options } = props.data;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.id !== `overflow_menu_popup_${action_id}` &&
        target.id !== `overflow_menu_button_${action_id}` &&
        target.parentElement?.id !== `overflow_menu_popup_${action_id}` &&
        target.parentElement?.id !== `overflow_menu_button_${action_id}`
      )
        setVisible(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [action_id]);

  return (
    <div id={action_id} className="relative inline-flex slack_blocks_to_jsx__overflow_menu_element">
      <button
        type="button"
        id={`overflow_menu_button_${action_id}`}
        className="flex items-center justify-center w-7 h-7 rounded border border-black-primary.3 dark:border-dark-border text-black-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
        onClick={() => setVisible((prev) => !prev)}
        aria-label="More options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="w-4 h-4"
        >
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {visible && (
        <div
          id={`overflow_menu_popup_${action_id}`}
          className="absolute top-[30px] right-0 bg-white-secondary dark:bg-dark-bg-secondary border border-gray-primary dark:border-dark-border rounded-[6px] shadow-custom_shadow-1 w-[200px] max-h-[240px] overflow-auto py-1 z-20"
        >
          <div className="flex flex-col">
            {options.slice(0, 5).map((option, i) => (
              <div
                key={i}
                className="h-7 px-4 flex items-center select-none cursor-pointer text-small hover:bg-blue-primary hover:text-white-primary dark:hover:bg-dark-link text-black-primary dark:text-dark-text-primary"
                tabIndex={0}
                onClick={() => {
                  setVisible(false);
                  if (option.url) {
                    window.open(option.url, "_blank");
                  }
                }}
              >
                <TextObject data={option.text} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
