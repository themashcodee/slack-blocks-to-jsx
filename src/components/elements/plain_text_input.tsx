import { useEffect, useState } from "react";
import type { PlainTextInputElement as PlainTextInputElementType } from "../../types";
import { TextObject } from "../composition_objects/text_object";

type TextObjectProps = {
  data: PlainTextInputElementType;
};

export const PlaintTextInput = (props: TextObjectProps) => {
  const {
    action_id,
    dispatch_action_config,
    focus_on_load,
    initial_value,
    max_length,
    min_length,
    multiline,
    placeholder,
  } = props.data;
  const [visible, setVisible] = useState(focus_on_load ?? false);
  const [value, setValue] = useState(initial_value || "");

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

  return (
    <div id={action_id} className="relative text-small w-full" tabIndex={0}>
      {!value && placeholder && (
        <div className="absolute left-2 top-2 text-black-primary.3">
          <TextObject data={placeholder} />
        </div>
      )}

      {!value && !placeholder && (
        <div className="absolute left-2 top-2 text-black-primary.3">
          <TextObject
            data={{
              type: "plain_text",
              text: "Write something",
            }}
          />
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full focus:outline-none rounded border border-black-primary.3 p-2"
        minLength={min_length}
        maxLength={max_length}
        style={{
          maxHeight: "200px",
          minHeight: "80px",
          height: "100px",
        }}
        aria-label="Select an item"
      ></textarea>
    </div>
  );
};
