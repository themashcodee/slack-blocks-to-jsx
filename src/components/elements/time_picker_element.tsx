import { useEffect, useRef, useState } from "react";
import type { TimePickerElement as TimePickerElementType } from "../../types";
import { TextObject } from "../composition_objects";

type TimePickerElementProps = {
  data: TimePickerElementType;
};

export const TimePickerElement = (props: TimePickerElementProps) => {
  const { action_id, initial_time, focus_on_load, placeholder } = props.data;
  const [value, setValue] = useState(initial_time || "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const showPlaceholder = !value && !!placeholder && !focused;

  useEffect(() => {
    if (focus_on_load && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus_on_load]);

  return (
    <div
      id={action_id}
      className="relative text-small w-[190px] slack_blocks_to_jsx__time_picker_element"
    >
      {showPlaceholder && placeholder && (
        <div className="absolute left-2 inset-y-0 flex items-center pointer-events-none text-black-primary.3 dark:text-dark-text-secondary">
          <TextObject data={placeholder} />
        </div>
      )}

      <input
        ref={inputRef}
        type="time"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full py-1 px-2 h-7 min-h-[28px] rounded border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary focus:outline-none ${showPlaceholder ? "text-transparent" : "text-black-primary dark:text-dark-text-primary"}`}
        aria-label="Select a time"
      />
    </div>
  );
};
