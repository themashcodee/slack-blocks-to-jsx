import { useEffect, useRef, useState } from "react";
import type { NumberInputElement as NumberInputElementType } from "../../types";
import { TextObject } from "../composition_objects";

type NumberInputElementProps = {
  data: NumberInputElementType;
};

export const NumberInputElement = (props: NumberInputElementProps) => {
  const {
    action_id,
    is_decimal_allowed,
    initial_value,
    min_value,
    max_value,
    focus_on_load,
    placeholder,
  } = props.data;
  const [value, setValue] = useState(initial_value || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus_on_load && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus_on_load]);

  return (
    <div
      id={action_id}
      className="relative text-small w-full slack_blocks_to_jsx__number_input_element"
    >
      {!value && placeholder && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-black-primary.3 dark:text-dark-text-secondary">
          <TextObject data={placeholder} />
        </div>
      )}

      {!value && !placeholder && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-black-primary.3 dark:text-dark-text-secondary">
          <TextObject
            data={{
              type: "plain_text",
              text: "Enter a number",
            }}
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        step={is_decimal_allowed ? "any" : "1"}
        min={min_value}
        max={max_value}
        className="w-full py-1 px-2 h-7 min-h-[28px] rounded border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary text-black-primary focus:outline-none"
        aria-label="Enter a number"
      />
    </div>
  );
};
