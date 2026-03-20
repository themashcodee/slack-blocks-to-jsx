import { useEffect, useRef, useState } from "react";
import type { RadioButtonsElement as RadioButtonsElementType } from "../../types";
import { TextObject } from "../composition_objects";

type RadioButtonsElementProps = {
  data: RadioButtonsElementType;
};

export const RadioButtonsElement = (props: RadioButtonsElementProps) => {
  const { action_id, options, initial_option, focus_on_load } = props.data;
  const [selected, setSelected] = useState(initial_option?.value || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus_on_load && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus_on_load]);

  return (
    <div id={action_id} className="my-1 flex w-full slack_blocks_to_jsx__radio_buttons_element">
      <fieldset className="flex flex-col gap-2">
        {options.map((option, i) => {
          const { text, value, description } = option;

          return (
            <label
              key={i}
              className="flex cursor-pointer items-baseline gap-3 select-none"
              htmlFor={`radio-${action_id}-value-${value}-${i}`}
            >
              <div>
                <input
                  type="radio"
                  ref={i === 0 ? inputRef : undefined}
                  id={`radio-${action_id}-value-${value}-${i}`}
                  name={action_id}
                  checked={selected === value}
                  onChange={() => setSelected(value)}
                />
              </div>

              <div>
                <TextObject data={text} />
                {description && (
                  <TextObject
                    className="text-black-secondary dark:text-dark-text-secondary"
                    data={description}
                  />
                )}
              </div>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
};
