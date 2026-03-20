import { TaskCardBlock } from "../../types";
import { RichText } from "./rich_text";

type TaskCardProps = {
  data: TaskCardBlock;
};

const StatusIndicator = ({ status }: { status: TaskCardBlock["status"] }) => {
  if (status === "complete") {
    return (
      <span className="flex items-center justify-center w-5 h-5 shrink-0 slack_blocks_to_jsx__task_card_status_complete">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-green-600 dark:text-green-400">
          <path
            d="M13.25 4.75L6 12 2.75 8.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (status === "in_progress") {
    return (
      <span className="flex items-center justify-center w-5 h-5 shrink-0 slack_blocks_to_jsx__task_card_status_in_progress">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></span>
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="flex items-center justify-center w-5 h-5 shrink-0 slack_blocks_to_jsx__task_card_status_error">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-red-400"></span>
      </span>
    );
  }

  // pending / default
  return (
    <span className="flex items-center justify-center w-5 h-5 shrink-0 slack_blocks_to_jsx__task_card_status_pending">
      <span className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500"></span>
    </span>
  );
};

export const TaskCard = (props: TaskCardProps) => {
  const { task_id, title, details, output, sources, status = "pending", block_id } = props.data;

  return (
    <div
      id={block_id}
      data-task-id={task_id}
      className="my-1 p-3 rounded border border-black-primary/[0.13] dark:border-dark-border text-black-primary dark:text-dark-text-primary slack_blocks_to_jsx__task_card"
    >
      <div className="flex items-start gap-2">
        <StatusIndicator status={status} />
        <span className="font-semibold text-primary slack_blocks_to_jsx__task_card_title">
          {title}
        </span>
      </div>

      {details && (
        <div className="mt-2 pl-7 slack_blocks_to_jsx__task_card_details">
          <RichText data={details} />
        </div>
      )}

      {output && (
        <div className="mt-2 pl-7 slack_blocks_to_jsx__task_card_output">
          <RichText data={output} />
        </div>
      )}

      {sources && sources.length > 0 && (
        <div className="mt-2 pl-7 flex flex-wrap gap-2 slack_blocks_to_jsx__task_card_sources">
          {sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-small text-blue-primary dark:text-dark-link hover:underline underline-offset-4"
            >
              {source.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
