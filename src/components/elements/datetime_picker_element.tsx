import { useEffect, useRef, useState } from "react";
import type { DateTimePickerElement as DateTimePickerElementType } from "../../types";

type DateTimePickerElementProps = {
  data: DateTimePickerElementType;
};

const unixToDateAndTime = (timestamp?: number): { date: string; time: string } => {
  if (!timestamp) return { date: "", time: "" };
  const d = new Date(timestamp * 1000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
};

export const DateTimePickerElement = (props: DateTimePickerElementProps) => {
  const { action_id, initial_date_time, focus_on_load } = props.data;
  const initial = unixToDateAndTime(initial_date_time);
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus_on_load && dateRef.current) {
      dateRef.current.focus();
    }
  }, [focus_on_load]);

  return (
    <div
      id={action_id}
      className="flex items-center gap-2 text-small slack_blocks_to_jsx__datetime_picker_element"
    >
      <input
        ref={dateRef}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="py-1 px-2 h-7 min-h-[28px] rounded border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary text-black-primary focus:outline-none"
        aria-label="Select a date"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="py-1 px-2 h-7 min-h-[28px] rounded border border-black-primary.3 dark:border-dark-border dark:bg-dark-bg-secondary dark:text-dark-text-primary text-black-primary focus:outline-none"
        aria-label="Select a time"
      />
    </div>
  );
};
