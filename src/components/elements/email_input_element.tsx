import { useEffect, useRef, useState } from "react";
import type { EmailInputElement as EmailInputElementType } from "../../types";
import { TextObject } from "../composition_objects";

type EmailInputElementProps = {
  data: EmailInputElementType;
};

export const EmailInputElement = (props: EmailInputElementProps) => {
  const { action_id, initial_value, focus_on_load, placeholder } = props.data;
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
      className="relative text-small w-full slack_blocks_to_jsx__email_input_element"
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
              text: "Enter an email address",
            }}
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full py-1 px-2 h-7 min-h-[28px] rounded border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary text-black-primary focus:outline-none"
        aria-label="Enter an email address"
      />
    </div>
  );
};
