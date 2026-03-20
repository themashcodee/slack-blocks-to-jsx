import { useEffect, useRef, useState } from "react";
import type { RichTextInputElement as RichTextInputElementType } from "../../types";
import { TextObject } from "../composition_objects";

type RichTextInputElementProps = {
  data: RichTextInputElementType;
};

export const RichTextInputElement = (props: RichTextInputElementProps) => {
  const { action_id, focus_on_load, placeholder } = props.data;
  const [value, setValue] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focus_on_load && editorRef.current) {
      editorRef.current.focus();
    }
  }, [focus_on_load]);

  return (
    <div
      id={action_id}
      className="relative text-small w-full slack_blocks_to_jsx__rich_text_input_element"
    >
      {!value && placeholder && (
        <div className="absolute left-2 top-2 pointer-events-none text-black-primary.3 dark:text-dark-text-secondary">
          <TextObject data={placeholder} />
        </div>
      )}

      {!value && !placeholder && (
        <div className="absolute left-2 top-2 pointer-events-none text-black-primary.3 dark:text-dark-text-secondary">
          <TextObject
            data={{
              type: "plain_text",
              text: "Write something...",
            }}
          />
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setValue((e.target as HTMLDivElement).textContent || "")}
        className="w-full focus:outline-none rounded border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary text-black-primary p-2"
        style={{
          maxHeight: "200px",
          minHeight: "80px",
          overflowY: "auto",
        }}
        role="textbox"
        aria-label="Rich text editor"
      />
    </div>
  );
};
