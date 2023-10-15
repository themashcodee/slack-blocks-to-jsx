import { useEffect, useState } from "react";
import type { StaticSelectElement as StaticSelectElementType } from "../../types";
import { TextObject } from "../composition_objects/text_object";

type TextObjectProps = {
  data: StaticSelectElementType;
};

export const StaticSelectElement = (props: TextObjectProps) => {
  const {
    action_id,
    options,
    // TODO: ADD CONFIRM DIALOG
    // confirm
    focus_on_load,
    // TODO: ADD INITIAL OPTION
    // initial_option,
    // TODO: ADD OPTION GROUPS
    // option_groups,
    placeholder,
  } = props.data;
  const [visible, setVisible] = useState(focus_on_load ?? false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log({ target });

      console.log(target.id);

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

  const filteredOptions = options.filter((option) => {
    const results = option.text.text.toLowerCase().includes(search.toLowerCase());
    return results;
  }, []);

  return (
    <div
      id={action_id}
      className="py-1 px-2 h-7 min-h-[28px] relative flex items-center justify-between rounded text-small w-[190px] border border-black-primary.3"
      tabIndex={0}
    >
      {visible && (
        <div
          className="absolute top-[24px] -left-3 bg-white-secondary border border-gray-primary rounded-[6px] shadow-custom_shadow-1 w-[322px] max-w-[322px] max-h-[240px] overflow-auto py-3 z-20"
          id="static_select_popup"
        >
          <div className="flex flex-col">
            {filteredOptions.map((option, i) => {
              return (
                <div
                  key={i}
                  className="h-7 px-6 flex items-center select-none cursor-pointer hover:bg-blue-primary hover:text-white-primary"
                  tabIndex={0}
                  onClick={() => {
                    setVisible(false);
                    setSelected(option.value);
                  }}
                >
                  <TextObject data={option.text} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        className="w-full py-1 pr-7 focus:outline-none"
        tabIndex={-1}
        aria-label="Select an item"
      />

      {!search && (
        <div className="absolute w-full h-full pointer-events-none flex items-center text-black-primary.3">
          <TextObject
            data={
              placeholder ?? {
                type: "plain_text",
                text: "Pick an option",
              }
            }
          />
        </div>
      )}

      <button
        className="absolute right-1 top-1/2 flex justify-center items-center w-5 -translate-y-1/2 text-black-secondary z-10 h-full"
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
