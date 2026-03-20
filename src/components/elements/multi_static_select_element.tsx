import { useEffect, useState } from "react";
import type { MultiStaticSelectElement as MultiStaticSelectElementType } from "../../types";
import { TextObject } from "../composition_objects";

type MultiStaticSelectElementProps = {
  data: MultiStaticSelectElementType;
};

export const MultiStaticSelectElement = (props: MultiStaticSelectElementProps) => {
  const {
    action_id,
    options,
    option_groups,
    initial_options,
    focus_on_load,
    placeholder,
    max_selected_items,
  } = props.data;
  const [visible, setVisible] = useState(focus_on_load ?? false);
  const [selected, setSelected] = useState<string[]>(
    initial_options ? initial_options.map((opt) => opt.value) : [],
  );
  const [search, setSearch] = useState("");

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

  const allOptions = option_groups ? option_groups.flatMap((group) => group.options) : options;

  const filteredOptions = allOptions.filter((option) =>
    option.text.text.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      if (max_selected_items && selected.length >= max_selected_items) return;
      setSelected([...selected, value]);
    }
  };

  return (
    <div
      id={action_id}
      className="py-1 px-2 h-7 min-h-[28px] relative flex items-center justify-between rounded text-small w-[190px] border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary slack_blocks_to_jsx__multi_static_select_element"
      tabIndex={0}
    >
      {visible && (
        <div
          className="absolute top-[24px] -left-3 bg-white-secondary dark:bg-dark-bg-secondary border border-gray-primary dark:border-dark-border rounded-[6px] shadow-custom_shadow-1 w-[322px] max-w-[322px] max-h-[240px] overflow-auto py-3 z-20"
          id="static_select_popup"
        >
          <div className="flex flex-col">
            {filteredOptions.map((option, i) => (
              <label
                key={i}
                className="h-7 px-6 flex items-center gap-2 select-none cursor-pointer hover:bg-blue-primary hover:text-white-primary dark:hover:bg-dark-link"
                tabIndex={0}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="shrink-0"
                />
                <TextObject data={option.text} />
              </label>
            ))}
          </div>
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        onClick={() => setVisible(true)}
        className="w-full py-1 pr-7 focus:outline-none dark:bg-dark-bg-secondary dark:text-dark-text-primary"
        tabIndex={-1}
        aria-label="Select items"
      />

      {!search && (
        <div className="absolute w-full h-full pointer-events-none flex items-center text-black-primary.3 dark:text-dark-text-secondary">
          {selected.length > 0 ? (
            <span className="text-black-primary dark:text-dark-text-primary">
              {selected.length} selected
            </span>
          ) : (
            <TextObject
              data={
                placeholder ?? {
                  type: "plain_text",
                  text: "Select options",
                }
              }
            />
          )}
        </div>
      )}

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
