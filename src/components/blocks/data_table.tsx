import { useMemo, useState } from "react";
import {
  DataTableBlock,
  DataTableCell,
  RichTextBlockElement,
  RichTextSectionElement,
} from "../../types";
import { merge_classes } from "../../utils";
import { ButtonElement } from "../elements/button_element";
import { formatNumber, TableCellContent } from "./table";

type DataTableProps = {
  data: DataTableBlock;
};

type SortState = {
  column: number;
  direction: "ascending" | "descending";
};

type IndexedRow = {
  row: DataTableCell[];
  index: number;
};

const DEFAULT_PAGE_SIZE = 5;
const MAX_PAGE_SIZE = 100;

const collator = new Intl.Collator("en-US");

const resolvePageSize = (pageSize: number | undefined) =>
  typeof pageSize === "number" && Number.isFinite(pageSize)
    ? Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(pageSize)))
    : DEFAULT_PAGE_SIZE;

const resolveRowHeaderIndex = (index: number | undefined, columns: number) =>
  typeof index === "number" && Number.isInteger(index) && index >= 0 && index < columns ? index : 0;

const sectionElementText = (element: RichTextSectionElement): string => {
  switch (element.type) {
    case "text":
      return element.text;
    case "link":
      return element.text || element.url;
    case "emoji":
      return element.name;
    case "user":
      return element.user_id;
    case "channel":
      return element.channel_id;
    case "usergroup":
      return element.usergroup_id;
    case "broadcast":
      return `@${element.range}`;
    case "date":
      return String(element.timestamp);
    case "color":
      return element.value;
    default:
      return "";
  }
};

const richTextToPlainText = (elements: RichTextBlockElement[]) =>
  elements
    .map((block) =>
      block.type === "rich_text_list"
        ? block.elements
            .map((section) => section.elements.map(sectionElementText).join(""))
            .join(" ")
        : block.elements.map(sectionElementText).join(""),
    )
    .join(" ");

/** The plain text of a cell, used for header labels and alphabetical sorting. */
const cellText = (cell: DataTableCell | undefined): string => {
  switch (cell?.type) {
    case "raw_text":
      return cell.text;
    case "raw_number":
      return formatNumber(cell);
    case "action_cell":
      return cell.element.text.text;
    case "rich_text":
      return richTextToPlainText(cell.elements);
    default:
      return "";
  }
};

const cellNumber = (cell: DataTableCell | undefined) =>
  cell?.type === "raw_number" ? cell.value : 0;

const sortRows = (rows: IndexedRow[], sort: SortState, numeric: boolean) => {
  const { column, direction } = sort;
  const factor = direction === "ascending" ? 1 : -1;

  return [...rows].sort((a, b) => {
    const left = a.row[column];
    const right = b.row[column];
    const diff = numeric
      ? cellNumber(left) - cellNumber(right)
      : collator.compare(cellText(left), cellText(right));
    return diff * factor;
  });
};

const DataTableCellContent = (props: { cell: DataTableCell }) => {
  const { cell } = props;

  switch (cell.type) {
    case "raw_text":
    case "raw_number":
    case "rich_text":
      return <TableCellContent cell={cell} />;
    case "action_cell":
      return <ButtonElement data={cell.element} />;
    default:
      return null;
  }
};

// Inline transforms, not rotate-* utilities: a host app's Tailwind v4 `rotate`
// property stacks on our v3 `transform` and doubles the angle.
const CHEVRON_ROTATION = {
  down: undefined,
  up: "rotate(180deg)",
  left: "rotate(90deg)",
  right: "rotate(-90deg)",
} as const;

const Chevron = (props: { direction: keyof typeof CHEVRON_ROTATION; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden="true"
    className={merge_classes(["w-4 h-4 shrink-0", props.className || ""])}
    style={{ transform: CHEVRON_ROTATION[props.direction] }}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.72 7.47a.75.75 0 0 1 1.06 0L10 10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 8.53a.75.75 0 0 1 0-1.06"
      clipRule="evenodd"
    />
  </svg>
);

const PAGE_BUTTON_CLASSES =
  "p-1 rounded text-black-secondary dark:text-dark-text-secondary hover:bg-black-primary/[0.06] dark:hover:bg-white-primary/[0.08] disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent slack_blocks_to_jsx__data_table_page_button";

export const DataTable = (props: DataTableProps) => {
  const { rows, caption, page_size, row_header_column_index, block_id } = props.data;

  const [sort, setSort] = useState<SortState | null>(null);
  const [page, setPage] = useState(0);

  const { header, body, numericColumns } = useMemo(() => {
    const header = rows?.[0] ?? [];
    const body: IndexedRow[] = (rows ?? []).slice(1).map((row, index) => ({ row, index }));
    const numericColumns = header.map(
      (_, column) => body.length > 0 && body.every(({ row }) => row[column]?.type === "raw_number"),
    );
    return { header, body, numericColumns };
  }, [rows]);

  const sortedBody = useMemo(
    () => (sort ? sortRows(body, sort, numericColumns[sort.column] ?? false) : body),
    [body, numericColumns, sort],
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  const pageSize = resolvePageSize(page_size);
  const rowHeaderIndex = resolveRowHeaderIndex(row_header_column_index, header.length);
  const totalPages = Math.max(1, Math.ceil(sortedBody.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageStart = currentPage * pageSize;
  const pageRows = sortedBody.slice(pageStart, pageStart + pageSize);
  const pageEnd = pageStart + pageRows.length;

  const onSort = (column: number) => {
    setSort((prev) => ({
      column,
      direction:
        prev?.column === column && prev.direction === "ascending" ? "descending" : "ascending",
    }));
    setPage(0);
  };

  const cellClasses = (column: number) =>
    merge_classes([
      "px-3 py-2 border-r border-gray-200 dark:border-dark-border last:border-r-0 whitespace-nowrap",
      numericColumns[column] ? "text-right tabular-nums" : "text-left",
    ]);

  return (
    <div
      id={block_id}
      // minmax(0,auto) keeps a wide table from stretching the message; it scrolls instead.
      className="mt-2 mb-1 inline-grid grid-cols-[minmax(0,auto)] max-w-full border border-gray-300 dark:border-dark-border rounded slack_blocks_to_jsx__data_table"
    >
      <div className="overflow-x-auto">
        <table className="border-none">
          <caption className="px-3 pt-2 pb-1 text-left text-small font-semibold text-black-secondary dark:text-dark-text-secondary slack_blocks_to_jsx__data_table_caption">
            {caption}
          </caption>
          <thead>
            <tr className="border-b border-gray-200 dark:border-dark-border">
              {header.map((cell, column) => {
                const direction = sort?.column === column ? sort.direction : undefined;

                return (
                  <th
                    key={column}
                    scope="col"
                    aria-sort={direction}
                    className={merge_classes([cellClasses(column), "font-semibold"])}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(column)}
                      className="group inline-flex items-center gap-1 font-semibold slack_blocks_to_jsx__data_table_sort_button"
                    >
                      {cellText(cell)}
                      <Chevron
                        direction={direction === "ascending" ? "up" : "down"}
                        className={
                          direction
                            ? ""
                            : "opacity-0 group-hover:opacity-50 group-focus:opacity-50"
                        }
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map(({ row, index }, rowIndex) => (
              <tr
                key={index}
                className={merge_classes([
                  "border-b border-gray-200 dark:border-dark-border",
                  rowIndex === pageRows.length - 1 ? "border-b-0" : "",
                ])}
              >
                {row.map((cell, column) =>
                  column === rowHeaderIndex ? (
                    <th
                      key={column}
                      scope="row"
                      className={merge_classes([cellClasses(column), "font-normal"])}
                    >
                      <DataTableCellContent cell={cell} />
                    </th>
                  ) : (
                    <td key={column} className={cellClasses(column)}>
                      <DataTableCellContent cell={cell} />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-1 px-3 py-1.5 border-t border-gray-200 dark:border-dark-border text-small text-black-secondary dark:text-dark-text-secondary slack_blocks_to_jsx__data_table_pagination">
          <span aria-live="polite" className="mr-1 tabular-nums">
            {`${pageStart + 1}–${pageEnd} of ${sortedBody.length}`}
          </span>
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
            className={PAGE_BUTTON_CLASSES}
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage(currentPage + 1)}
            className={PAGE_BUTTON_CLASSES}
          >
            <Chevron direction="right" />
          </button>
        </div>
      )}
    </div>
  );
};
