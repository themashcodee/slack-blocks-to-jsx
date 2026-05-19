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

  // Order matters: decode `&gt;` and `&lt;` before `&amp;` so a literal escaped `&gt;`
  // (which arrives as `&amp;gt;`) doesn't get double-decoded.
  // The `&gt;` → `"> "` trailing space is intentional — it keeps blockquote line detection
  // (`^>` in parser.tsx) working when Slack escapes the `>` of a quote line.
  const parsed = text.replace(/&gt;/g, "> ").replace(/&lt;/g, "<").replace(/&amp;/g, "&");

  if (type === "plain_text")
    return (
      <div className={className + " dark:text-dark-text-primary"}>
        {markdown_parser(parsed, { markdown: false, verbatim, users, channels, hooks })}
      </div>
    );

  return (
    <div className={className + " dark:text-dark-text-primary"}>
      {markdown_parser(parsed, { markdown: true, verbatim, users, channels, hooks })}
    </div>
  );
};
