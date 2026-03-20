import { useEffect, useMemo, useState } from "react";
import type { StaticSelectElement as StaticSelectElementType } from "../../types";
import { TextObject } from "../composition_objects/text_object";
import { ConfirmDialog } from "../composition_objects/confirm_dialog";

type TextObjectProps = {
  data: StaticSelectElementType;
};

export const StaticSelectElement = (props: TextObjectProps) => {
  const { action_id, options, confirm, focus_on_load, initial_option, option_groups, placeholder } =
    props.data;
  const [visible, setVisible] = useState(focus_on_load ?? false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(
    initial_option && "value" in initial_option ? initial_option.value : "",
  );
  const [pendingValue, setPendingValue] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

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

  const allOptions = useMemo(() => {
    if (option_groups && option_groups.length > 0) {
      return option_groups.flatMap((group) => group.options);
    }
    return options;
  }, [options, option_groups]);

  const filteredOptions = allOptions.filter((option) => {
    return option.text.text.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelectOption = (value: string) => {
    if (confirm) {
      setPendingValue(value);
      setShowConfirm(true);
    } else {
      setVisible(false);
      setSelected(value);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setVisible(false);
    setSelected(pendingValue);
    setPendingValue("");
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingValue("");
  };

  return (
    <>
      <div
        id={action_id}
        className="py-1 px-2 h-7 min-h-[28px] relative flex items-center justify-between rounded text-small w-[190px] border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary"
        tabIndex={0}
      >
        {visible && (
          <div
            className="absolute top-[24px] -left-3 bg-white-secondary dark:bg-dark-bg-secondary border border-gray-primary dark:border-dark-border rounded-[6px] shadow-custom_shadow-1 w-[322px] max-w-[322px] max-h-[240px] overflow-auto py-3 z-20"
            id="static_select_popup"
          >
            <div className="flex flex-col">
              {option_groups && option_groups.length > 0
                ? option_groups.map((group, gi) => (
                    <div key={gi}>
                      <div className="px-6 py-1 text-xs font-semibold text-black-secondary dark:text-dark-text-secondary uppercase">
                        <TextObject data={group.label} />
                      </div>
                      {group.options
                        .filter((option) =>
                          option.text.text.toLowerCase().includes(search.toLowerCase()),
                        )
                        .map((option, i) => (
                          <div
                            key={`${gi}-${i}`}
                            className="h-7 px-6 flex items-center select-none cursor-pointer hover:bg-blue-primary hover:text-white-primary dark:hover:bg-dark-link"
                            tabIndex={0}
                            onClick={() => handleSelectOption(option.value)}
                          >
                            <TextObject data={option.text} />
                          </div>
                        ))}
                    </div>
                  ))
                : filteredOptions.map((option, i) => (
                    <div
                      key={i}
                      className="h-7 px-6 flex items-center select-none cursor-pointer hover:bg-blue-primary hover:text-white-primary dark:hover:bg-dark-link"
                      tabIndex={0}
                      onClick={() => handleSelectOption(option.value)}
                    >
                      <TextObject data={option.text} />
                    </div>
                  ))}
            </div>
          </div>
        )}

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="w-full py-1 pr-7 focus:outline-none dark:bg-dark-bg-secondary dark:text-dark-text-primary"
          tabIndex={-1}
          aria-label="Select an item"
        />

        {!search && (
          <div className="absolute w-full h-full pointer-events-none flex items-center text-black-primary.3 dark:text-dark-text-secondary">
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

      {showConfirm && confirm && (
        <ConfirmDialog data={confirm} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </>
  );
};
