import { useEffect, useRef, useState } from "react";
import type { TimePickerElement as TimePickerElementType } from "../../types";
import { TextObject } from "../composition_objects";

type TimePickerElementProps = {
  data: TimePickerElementType;
};

export const TimePickerElement = (props: TimePickerElementProps) => {
  const { action_id, initial_time, focus_on_load, placeholder } = props.data;
  const [value, setValue] = useState(initial_time || "");
  const inputRef = useRef<HTMLInputElement>(null);

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
      {!value && placeholder && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-black-primary.3 dark:text-dark-text-secondary">
          <TextObject data={placeholder} />
        </div>
      )}

      <input
        ref={inputRef}
        type="time"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full py-1 px-2 h-7 min-h-[28px] rounded border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary text-black-primary focus:outline-none"
        aria-label="Select a time"
      />
    </div>
  );
};
