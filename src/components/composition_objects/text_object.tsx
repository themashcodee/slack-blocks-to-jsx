import { useGlobalData } from "../../store";
import type { TextObject as TextObjectType } from "../../types";
import { markdown_parser } from "../../utils";

type TextObjectProps = {
  data: TextObjectType;
  className?: string;
};

export const TextObject = (props: TextObjectProps) => {
  const { type, text, verbatim = false } = props.data;
  const { className = "" } = props;
  const { channels, users, hooks } = useGlobalData();

  // HTML entity decoding is deferred to the leaf renderers (Text, HTML, InlineCode, Code,
  // Link) so escaped sequences like `&lt;@U123&gt;` (user typed `<@U123>` literally) don't
  // get tokenized as directives. See decode_entities.ts.
  if (type === "plain_text")
    return (
      <div className={className + " dark:text-dark-text-primary"}>
        {markdown_parser(text, { markdown: false, verbatim, users, channels, hooks })}
      </div>
    );

  return (
    <div className={className + " dark:text-dark-text-primary"}>
      {markdown_parser(text, { markdown: true, verbatim, users, channels, hooks })}
    </div>
  );
};
