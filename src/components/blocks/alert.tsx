import { AlertBlock, AlertLevel } from "../../types";
import { TextObject } from "../composition_objects";

type AlertProps = {
  data: AlertBlock;
};

type LevelConfig = {
  containerClass: string;
  iconClass: string;
  icon: JSX.Element;
  label: string;
};

const LEVEL_CONFIG: Record<AlertLevel, LevelConfig> = {
  default: {
    containerClass:
      "border-black-primary/[0.13] bg-gray-secondary dark:border-dark-border dark:bg-dark-bg-secondary",
    iconClass: "text-black-secondary dark:text-dark-text-secondary",
    label: "Notice",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M8 5v3.5M8 11h.01"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  info: {
    containerClass:
      "border-blue-primary/30 bg-blue-primary/[0.08] dark:border-dark-link/40 dark:bg-dark-link/[0.1]",
    iconClass: "text-blue-primary dark:text-dark-link",
    label: "Info",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M8 7v4M8 5h.01"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  warning: {
    containerClass:
      "border-orange-primary/40 bg-orange-primary/[0.1] dark:border-orange-primary/50 dark:bg-orange-primary/[0.12]",
    iconClass: "text-orange-primary",
    label: "Warning",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <path
          d="M8 2.25 14.5 13.5h-13L8 2.25Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M8 6v3.5M8 11.5h.01"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  error: {
    containerClass:
      "border-red-primary/40 bg-red-primary/[0.08] dark:border-red-primary/50 dark:bg-red-primary/[0.12]",
    iconClass: "text-red-primary",
    label: "Error",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="m5.5 5.5 5 5M10.5 5.5l-5 5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  success: {
    containerClass:
      "border-green-primary/40 bg-green-primary/[0.08] dark:border-green-secondary/50 dark:bg-green-secondary/[0.12]",
    iconClass: "text-green-primary dark:text-green-secondary",
    label: "Success",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="m5 8.25 2.25 2.25L11 6.75"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export const Alert = (props: AlertProps) => {
  const { text, level = "default", block_id } = props.data;
  const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.default;

  return (
    <div
      id={block_id}
      role="status"
      aria-label={config.label}
      data-level={level}
      className={`my-2 flex items-start gap-2 rounded-md border px-3 py-2 text-base slack_blocks_to_jsx__alert slack_blocks_to_jsx__alert_${level} ${config.containerClass}`}
    >
      <span className={`mt-[2px] shrink-0 slack_blocks_to_jsx__alert_icon ${config.iconClass}`}>
        {config.icon}
      </span>
      <div className="flex-1 min-w-0 slack_blocks_to_jsx__alert_text text-black-primary dark:text-dark-text-primary">
        <TextObject data={text} />
      </div>
    </div>
  );
};
