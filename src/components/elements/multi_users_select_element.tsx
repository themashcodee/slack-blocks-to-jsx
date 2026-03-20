import type { MultiUsersSelectElement as MultiUsersSelectElementType } from "../../types";
import { TextObject } from "../composition_objects";

type MultiUsersSelectElementProps = {
  data: MultiUsersSelectElementType;
};

export const MultiUsersSelectElement = (props: MultiUsersSelectElementProps) => {
  const { action_id, placeholder, initial_users } = props.data;

  return (
    <div
      id={action_id}
      className="py-1 px-2 h-7 min-h-[28px] relative flex items-center justify-between rounded text-small w-[190px] border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary slack_blocks_to_jsx__multi_users_select_element"
      tabIndex={0}
    >
      <div className="w-full flex items-center text-black-primary.3 dark:text-dark-text-secondary">
        {initial_users && initial_users.length > 0 ? (
          <span className="text-black-primary dark:text-dark-text-primary">
            {initial_users.length} selected
          </span>
        ) : (
          <TextObject
            data={
              placeholder ?? {
                type: "plain_text",
                text: "Select users",
              }
            }
          />
        )}
      </div>

      <button
        type="button"
        className="absolute right-1 top-1/2 flex justify-center items-center w-5 -translate-y-1/2 text-black-secondary dark:text-dark-text-secondary z-10 h-full"
        onClick={() => {}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3"
          stroke="currentColor"
          className="w-3 h-3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </div>
  );
};
