import { useState } from "react";
import type {
  ContainerBlock,
  RichTextBlock,
  RichTextSectionElement as RichTextSectionElementType,
} from "../../types";
import { useGlobalData } from "../../store";
import { TextObject } from "../composition_objects";
import { getBlockComponent } from "../index";
import { merge_classes } from "../../utils";
import { RichTextSectionElement } from "./rich_text/rich_text_section";

type ContainerProps = {
  data: ContainerBlock;
};

const WIDTH_CLASSES: Record<NonNullable<ContainerBlock["width"]>, string> = {
  narrow: "max-w-[320px]",
  standard: "max-w-[440px]",
  wide: "max-w-[520px]",
  full: "w-full",
};

/**
 * A rich text title's inline elements on one line, its sections, quotes and list items
 * separated by a space.
 */
const titleElements = (title: RichTextBlock): RichTextSectionElementType[] => {
  const runs = title.elements.flatMap((element) =>
    element.type === "rich_text_list"
      ? element.elements.map((item) => item.elements)
      : [element.elements],
  );
  return runs.flatMap((run, i) =>
    i === 0 ? run : [{ type: "text", text: " " } as RichTextSectionElementType, ...run],
  );
};

/** The readable text of a rich text title, for the group's accessible label. */
const titleLabel = (elements: RichTextSectionElementType[]): string =>
  elements
    .map((element) => {
      if (element.type === "text") return element.text;
      if (element.type === "link") return element.text || element.url;
      return "";
    })
    .join("")
    .trim();

export const Container = (props: ContainerProps) => {
  const {
    title,
    rich_text_title,
    subtitle,
    icon,
    child_blocks,
    width = "standard",
    is_collapsible = false,
    default_collapsed = false,
    block_id,
  } = props.data;

  const [expanded, setExpanded] = useState(!(is_collapsible && default_collapsed));
  const collapsed = is_collapsible && !expanded;
  const { urlTransform } = useGlobalData();
  const iconUrl = urlTransform(icon?.image_url, "image");
  const richTitle = rich_text_title?.elements?.length ? titleElements(rich_text_title) : null;

  const header = (
    <>
      {iconUrl && (
        <span className="shrink-0 slack_blocks_to_jsx__container_icon">
          <img src={iconUrl} alt={icon?.alt_text || ""} className="w-5 h-5 rounded object-cover" />
        </span>
      )}

      <span className="flex flex-col min-w-0 flex-1 slack_blocks_to_jsx__container_title_group">
        {richTitle ? (
          <span className="font-bold text-black-primary dark:text-dark-text-primary truncate slack_blocks_to_jsx__container_title">
            {richTitle.map((element, i) => (
              <RichTextSectionElement key={`${element.type}__${i}`} element={element} />
            ))}
          </span>
        ) : (
          title && (
            <span className="font-bold text-black-primary dark:text-dark-text-primary truncate slack_blocks_to_jsx__container_title">
              {/* Slack shows a plain title as typed, without turning :emoji: codes into emoji. */}
              <TextObject data={{ ...title, verbatim: true }} />
            </span>
          )
        )}
        {subtitle && (
          <span className="text-small text-black-secondary dark:text-dark-text-secondary truncate slack_blocks_to_jsx__container_subtitle">
            <TextObject data={subtitle} />
          </span>
        )}
      </span>

      {is_collapsible && (
        <span
          aria-hidden="true"
          className="shrink-0 transition-transform slack_blocks_to_jsx__container_caret"
          style={{ transform: collapsed ? "rotate(-90deg)" : undefined }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-4 h-4">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M5.72 7.47a.75.75 0 0 1 1.06 0L10 10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 8.53a.75.75 0 0 1 0-1.06"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </>
  );

  return (
    <div
      id={block_id}
      role="group"
      aria-label={richTitle ? titleLabel(richTitle) || undefined : title?.text}
      className={merge_classes([
        "my-2 rounded-lg border border-black-primary/[0.13] dark:border-dark-border bg-white-primary dark:bg-dark-bg-secondary overflow-hidden slack_blocks_to_jsx__container",
        WIDTH_CLASSES[width],
      ])}
    >
      {is_collapsible ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full flex items-center gap-2 p-3 text-left slack_blocks_to_jsx__container_header"
        >
          {header}
        </button>
      ) : (
        <div className="flex items-center gap-2 p-3 slack_blocks_to_jsx__container_header">
          {header}
        </div>
      )}

      {!collapsed && (
        <div className="px-3 pb-3 slack_blocks_to_jsx--blocks slack_blocks_to_jsx__container_content">
          {child_blocks.map((child, i) => {
            const element = getBlockComponent(child);
            if (!element) return null;
            return <div key={child.block_id || i}>{element}</div>;
          })}
        </div>
      )}
    </div>
  );
};
