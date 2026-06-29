import { useState } from "react";
import { ContainerBlock } from "../../types";
import { TextObject } from "../composition_objects";
import { getBlockComponent } from "../index";
import { merge_classes } from "../../utils";

type ContainerProps = {
  data: ContainerBlock;
};

const WIDTH_CLASSES: Record<NonNullable<ContainerBlock["width"]>, string> = {
  narrow: "max-w-[320px]",
  standard: "max-w-[440px]",
  wide: "max-w-[520px]",
  full: "w-full",
};

export const Container = (props: ContainerProps) => {
  const {
    title,
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

  const header = (
    <>
      {icon?.image_url && (
        <span className="shrink-0 slack_blocks_to_jsx__container_icon">
          <img
            src={icon.image_url}
            alt={icon.alt_text || ""}
            className="w-5 h-5 rounded object-cover"
          />
        </span>
      )}

      <span className="flex flex-col min-w-0 flex-1 slack_blocks_to_jsx__container_title_group">
        {title && (
          <span className="font-bold text-black-primary dark:text-dark-text-primary truncate slack_blocks_to_jsx__container_title">
            <TextObject data={title} />
          </span>
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
          className={merge_classes([
            "shrink-0 transition-transform slack_blocks_to_jsx__container_caret",
            collapsed ? "-rotate-90" : "",
          ])}
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
      aria-label={title?.text}
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
