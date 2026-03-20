import { useEffect, useRef, useState } from "react";
import type { CheckboxesElement as CheckboxesElementType } from "../../types";
import { TextObject } from "../composition_objects";
import { ConfirmDialog } from "../composition_objects/confirm_dialog";

type TextObjectProps = {
  data: CheckboxesElementType;
};

export const CheckboxesElement = (props: TextObjectProps) => {
  const { action_id, options, focus_on_load, initial_options, confirm } = props.data;
  const [selected, setSelected] = useState(
    initial_options ? initial_options.map((option) => option.value) : [],
  );
  const input_ref = useRef<HTMLInputElement>(null);
  const [pendingChange, setPendingChange] = useState<{
    value: string;
    checked: boolean;
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const first_value = options[0]?.value;
    if (focus_on_load && input_ref.current && first_value && !selected.includes(first_value)) {
      input_ref.current.focus();
    }
  }, [focus_on_load]);

  const applyChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelected([...selected, value]);
    } else {
      setSelected(selected.filter((v) => v !== value));
    }
  };

  const handleChange = (value: string, checked: boolean) => {
    if (confirm) {
      setPendingChange({ value, checked });
      setShowConfirm(true);
    } else {
      applyChange(value, checked);
    }
  };

  const handleConfirm = () => {
    if (pendingChange) {
      applyChange(pendingChange.value, pendingChange.checked);
    }
    setShowConfirm(false);
    setPendingChange(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingChange(null);
  };

  return (
    <>
      <div id={action_id} className="my-1 flex w-full slack_blocks_to_jsx__checkboxes_element">
        <fieldset className="flex flex-col gap-2">
          {options.map((option, i) => {
            const { text, value, description } = option;

            return (
              <label
                key={i}
                className="flex cursor-pointer items-baseline gap-3 select-none"
                htmlFor={`checkboxes-${action_id}-value-${value}-${i}`}
              >
                <div>
                  <input
                    type="checkbox"
                    ref={i === 0 ? input_ref : undefined}
                    id={`checkboxes-${action_id}-value-${value}-${i}`}
                    checked={selected.includes(value)}
                    onChange={(e) => {
                      handleChange(value, e.target.checked);
                    }}
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

      {showConfirm && confirm && (
        <ConfirmDialog data={confirm} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </>
  );
};
