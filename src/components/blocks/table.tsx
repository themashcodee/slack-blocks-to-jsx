import { useGlobalData } from "../../store";
import { DataTableRawNumberCell, TableBlock, TableCell } from "../../types";
import { markdown_parser, merge_classes } from "../../utils";
import { RichText } from "./rich_text";

type TableProps = {
  data: TableBlock;
};

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 20 });

export const formatNumber = (cell: DataTableRawNumberCell) =>
  cell.text || numberFormat.format(cell.value);

/** Renders a raw_text, raw_number or rich_text cell; shared by the table and data_table blocks. */
export const TableCellContent = (props: { cell: TableCell }) => {
  const { cell } = props;
  const { channels, users, hooks } = useGlobalData();

  if (cell.type === "rich_text") return <RichText data={cell} />;
  if (cell.type === "raw_number") return <>{formatNumber(cell)}</>;

  return (
    <div>
      {markdown_parser(cell.text.replace(/&gt;/g, "> ").replace(/&lt;/g, "<"), {
        markdown: false,
        verbatim: false,
        users,
        channels,
        hooks,
      })}
    </div>
  );
};

export const Table = (props: TableProps) => {
  const { rows, column_settings, block_id } = props.data;

  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <div
      id={block_id}
      className="mt-2 mb-1 slack_blocks_to_jsx__table inline-block border border-gray-300 dark:border-dark-border rounded"
    >
      <table className="border-none">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={merge_classes([
                "border-b border-gray-200 dark:border-dark-border",
                rowIndex === rows.length - 1 ? "border-b-0" : "",
              ])}
            >
              {row.map((cell, cellIndex) => {
                const columnSetting = column_settings?.[cellIndex];
                const align = columnSetting?.align || "left";
                const isWrapped = columnSetting?.is_wrapped || false;
                const isHeaderRow = rowIndex === 0;

                const cellClasses = merge_classes([
                  "px-3 py-2 border-r border-gray-200 dark:border-dark-border last:border-r-0",
                  align === "center" ? "text-center" : "",
                  align === "right" ? "text-right" : "text-left",
                  isWrapped ? "break-words" : "whitespace-nowrap overflow-hidden text-ellipsis",
                  isHeaderRow ? "font-semibold" : "",
                ]);

                return (
                  <td key={cellIndex} className={cellClasses}>
                    <TableCellContent cell={cell} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
