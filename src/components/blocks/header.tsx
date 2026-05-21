import { HeaderBlock } from "../../types";
import { TextObject } from "../composition_objects";

type HeaderProps = {
  data: HeaderBlock;
};

// Per https://docs.slack.dev/reference/block-kit/blocks/header-block,
// `header.level` is an optional integer 1-4 corresponding to H1-H4. The
// default (when `level` is omitted) preserves the pre-2026-03-06 single-
// size rendering, which matched <h3> at 18px in this library.
const SIZE_CLASS_BY_LEVEL: Record<NonNullable<HeaderBlock["level"]>, string> = {
  1: "text-[28px] leading-[1.2]",
  2: "text-[22px] leading-[1.27]",
  3: "text-header",
  4: "text-base",
};

export const Header = (props: HeaderProps) => {
  const { text, block_id, level } = props.data;
  const sizeClass = level ? SIZE_CLASS_BY_LEVEL[level] : "text-header";
  const HeadingTag = (level ? `h${level}` : "h3") as
    | "h1"
    | "h2"
    | "h3"
    | "h4";

  return (
    <div id={block_id} className="mt-1 slack_blocks_to_jsx__header">
      <HeadingTag
        className={`${sizeClass} font-semibold text-black-primary dark:text-dark-text-primary slack_blocks_to_jsx__header_heading`}
        data-header-level={level ?? 3}
      >
        <TextObject data={text} />
      </HeadingTag>
    </div>
  );
};
