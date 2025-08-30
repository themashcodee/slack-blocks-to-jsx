import { useGlobalData } from "../../store";
import { TableBlock } from "../../types";
import { markdown_parser, merge_classes } from "../../utils";
import { RichText } from "./rich_text";

type TableProps = {
  data: TableBlock;
};

export const Table = (props: TableProps) => {
  const { rows, column_settings, block_id } = props.data;
  const { channels, users, hooks } = useGlobalData();

  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <div
      id={block_id}
      className="mt-2 mb-1 slack_blocks_to_jsx__table inline-block border border-gray-300 rounded"
    >
      <table className="border-none">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={merge_classes([
                "border-b border-gray-200",
                rowIndex === rows.length - 1 ? "border-b-0" : "",
              ])}
            >
              {row.map((cell, cellIndex) => {
                const columnSetting = column_settings?.[cellIndex];
                const align = columnSetting?.align || "left";
                const isWrapped = columnSetting?.is_wrapped || false;
                const isHeaderRow = rowIndex === 0;

                const cellClasses = merge_classes([
                  "px-3 py-2 border-r border-gray-200 last:border-r-0",
                  align === "center" ? "text-center" : "",
                  align === "right" ? "text-right" : "text-left",
                  isWrapped ? "break-words" : "whitespace-nowrap overflow-hidden text-ellipsis",
                  isHeaderRow ? "font-semibold" : "",
                ]);

                return (
                  <td key={cellIndex} className={cellClasses}>
                    {cell.type === "raw_text" ? (
                      <div>
                        {markdown_parser(cell.text.replace(/&gt;/g, "> ").replace(/&lt;/g, "<"), {
                          markdown: false,
                          users,
                          channels,
                          hooks,
                        })}
                      </div>
                    ) : (
                      <RichText data={cell} />
                    )}
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
