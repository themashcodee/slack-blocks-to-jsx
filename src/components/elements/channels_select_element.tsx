import { useEffect, useState } from "react";
import type { ChannelsSelectElement as ChannelsSelectElementType } from "../../types";
import { TextObject } from "../composition_objects";

type ChannelsSelectElementProps = {
  data: ChannelsSelectElementType;
};

export const ChannelsSelectElement = (props: ChannelsSelectElementProps) => {
  const { action_id, focus_on_load, placeholder } = props.data;
  const [visible, setVisible] = useState(focus_on_load || false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.id !== "static_select_popup" &&
        target.id !== "static_select_dropdown_button" &&
        target.parentElement?.id !== "static_select_popup" &&
        target.parentElement?.id !== "static_select_dropdown_button"
      )
        setVisible(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      id={action_id}
      className="py-1 px-2 h-7 min-h-[28px] relative flex items-center justify-between rounded text-small w-[190px] border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary slack_blocks_to_jsx__channels_select_element"
      tabIndex={0}
    >
      <div className="w-full flex items-center text-black-primary.3 dark:text-dark-text-secondary">
        <TextObject
          data={
            placeholder ?? {
              type: "plain_text",
              text: "Select a channel",
            }
          }
        />
      </div>

      <button
        type="button"
        className="absolute right-1 top-1/2 flex justify-center items-center w-5 -translate-y-1/2 text-black-secondary dark:text-dark-text-secondary z-10 h-full"
        id="static_select_dropdown_button"
        onClick={() => {
          setVisible((prev) => !prev);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3"
          stroke="currentColor"
          className="w-3 h-3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </div>
  );
};
