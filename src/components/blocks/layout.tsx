import { LayoutBlock, LayoutItem } from "../../types";
import { getBlockComponent } from "../index";
import { merge_classes } from "../../utils";

type LayoutProps = {
  data: LayoutBlock;
};

type ItemWidth = NonNullable<LayoutItem["width"]>;

// Slack weights a row's items 1:2:3. Each width also has a minimum, and items wrap to the next
// line in source order when a row can't fit them above their minimums.
const WIDTH_WEIGHTS: Record<ItemWidth, number> = { narrow: 1, standard: 2, wide: 3 };
const WIDTH_MINIMUMS: Record<ItemWidth, number> = { narrow: 96, standard: 144, wide: 192 };

const ALIGNMENT_CLASSES: Record<NonNullable<LayoutItem["horizontal_alignment"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

const LayoutCell = (props: { item: LayoutItem }) => {
  const { block, width, horizontal_alignment } = props.item;
  const resolvedWidth: ItemWidth = width && width in WIDTH_WEIGHTS ? width : "standard";
  const alignment = horizontal_alignment ? ALIGNMENT_CLASSES[horizontal_alignment] : undefined;

  const element = block ? getBlockComponent(block) : null;

  return (
    <div
      // flex-basis 0 makes the grow weights the exact ratio; on small screens every item takes
      // its own line, as Slack always stacks layout rows on mobile.
      className={merge_classes([
        "flex flex-col basis-0 max-sm:basis-full slack_blocks_to_jsx__layout_item",
        alignment || "",
      ])}
      style={{
        flexGrow: WIDTH_WEIGHTS[resolvedWidth],
        flexShrink: 1,
        minWidth: WIDTH_MINIMUMS[resolvedWidth],
      }}
    >
      {element && (
        <div
          className={merge_classes([
            "max-w-full slack_blocks_to_jsx__layout_item_content",
            alignment ? "w-fit" : "w-full",
          ])}
        >
          {element}
        </div>
      )}
    </div>
  );
};

export const Layout = (props: LayoutProps) => {
  const { label, is_label_visible = false, rows, grid_lines = "none", block_id } = props.data;

  if (!rows || rows.length === 0) return null;

  const bordered = grid_lines === "rows" || grid_lines === "outer";

  return (
    <div id={block_id} className="my-1 slack_blocks_to_jsx__layout">
      {is_label_visible && label && (
        <div className="mt-2 font-bold text-black-primary dark:text-dark-text-primary slack_blocks_to_jsx__layout_label">
          {label}
        </div>
      )}

      <div
        className={merge_classes([
          "flex flex-col slack_blocks_to_jsx__layout_grid",
          bordered
            ? "mt-2 rounded-lg border border-black-primary/[0.13] dark:border-dark-border"
            : "",
        ])}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            className={merge_classes([
              "flex flex-wrap gap-x-3 slack_blocks_to_jsx__layout_row",
              bordered ? "px-3 pb-2" : "",
              grid_lines === "rows" && i > 0
                ? "border-t border-black-primary/[0.13] dark:border-dark-border"
                : "",
            ])}
          >
            {(row.items ?? []).map((item, j) => (
              <LayoutCell key={item.block?.block_id || j} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
