import { ReactNode } from "react";
import { SlackDateSubElement } from "../types";
import { useGlobalData } from "../../../store";

type Props = {
  element: SlackDateSubElement;
};

export const SlackDate = (props: Props) => {
  const { element } = props;
  const { fallbackText, optionalLink, timestamp, tokenString } = element.value;
  const { hooks } = useGlobalData();

  if (hooks.date)
    return (
      <>
        {hooks.date({
          fallback: fallbackText,
          timestamp,
          format: tokenString,
          link: optionalLink || null,
        })}
      </>
    );

  const date = new Date(Number(timestamp) * 1000);

  let date_text = tokenString;

  const replacements: { [key: string]: string } = {
    "{day_divider_pretty}": date_token_to_label(date, "{day_divider_pretty}"),
    "{date_num}": date_token_to_label(date, "{date_num}"),
    "{date_slash}": date_token_to_label(date, "{date_slash}"),
    "{date_long}": date_token_to_label(date, "{date_long}"),
    "{date_long_full}": date_token_to_label(date, "{date_long_full}"),
    "{date_long_pretty}": date_token_to_label(date, "{date_long_pretty}"),
    "{date}": date_token_to_label(date, "{date}"),
    "{date_pretty}": date_token_to_label(date, "{date_pretty}"),
    "{date_short}": date_token_to_label(date, "{date_short}"),
    "{date_short_pretty}": date_token_to_label(date, "{date_short_pretty}"),
    "{time}": date_token_to_label(date, "{time}"),
    "{time_secs}": date_token_to_label(date, "{time_secs}"),
    "{ago}": date_token_to_label(date, "{ago}"),
  };

  Object.entries(replacements).forEach(([key, value]) => {
    if (tokenString.includes(key)) {
      date_text = date_text.replace(key, value);
    }
  });

  return (
    <span className="slack_date">
      <WrapWithLink wrap={!!optionalLink} href={optionalLink}>
        {date_text}
      </WrapWithLink>
    </span>
  );
};

const WrapWithLink = (props: { wrap: boolean; href: string; children: ReactNode }) => {
  const { hooks } = useGlobalData();

  if (!props.wrap) return <>{props.children}</>;

  if (hooks.link) {
    return (
      <>
        {hooks.link({
          href: props.href,
          children: props.children,
          className: "text-blue-primary",
          rel: "noopener noreferrer",
          target: "_blank",
        })}
      </>
    );
  }

  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer" className="text-blue-primary">
      {props.children}
    </a>
  );
};

const date_token_to_label = (inputDate: Date, formatString: string): string => {
  const dateObj = new Date(inputDate);
  const now = new Date();

  // Function to get month with leading zero
  const getMonthWithZero = (date: Date): string => {
    return (date.getMonth() + 1).toString().padStart(2, "0");
  };

  // Function to get day with ordinal suffix
  const getDayWithSuffix = (date: Date): string => {
    const day = date.getDate();
    const suffixes = ["th", "st", "nd", "rd"];
    const relevantDigits = (day < 30 ? day % 20 : day % 30) % 10;
    return day + (suffixes[relevantDigits] || suffixes[0] || "");
  };

  // Function to check if date is today, yesterday, or tomorrow
  const getRelativeDay = (date: Date): string | null => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((inputDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    return null;
  };

  // Format strings based on formatString
  switch (formatString) {
    case "{day_divider_pretty}": {
      const relativeDay = getRelativeDay(dateObj);
      if (relativeDay) return relativeDay;
      if (dateObj.getFullYear() === now.getFullYear()) {
        return dateObj.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric" });
      }
      return dateObj.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    case "{date_num}":
      return `${dateObj.getFullYear()}-${getMonthWithZero(dateObj)}-${dateObj
        .getDate()
        .toString()
        .padStart(2, "0")}`;
    case "{date_slash}":
      return dateObj.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    case "{date_long}":
      return dateObj.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    case "{date_long_full}":
      return dateObj.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
    case "{date_long_pretty}": {
      const relativeDay = getRelativeDay(dateObj);
      if (relativeDay) return relativeDay;
      return dateObj.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    case "{date}":
      return dateObj.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
    case "{date_pretty}": {
      const relativeDay = getRelativeDay(dateObj);
      if (relativeDay) return relativeDay;
      return dateObj.toLocaleString("en-US", { month: "long", day: "numeric" });
    }
    case "{date_short}":
      return dateObj.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
    case "{date_short_pretty}": {
      const relativeDay = getRelativeDay(dateObj);
      if (relativeDay) return relativeDay;
      return dateObj.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    case "{time}":
      return dateObj.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    case "{time_secs}":
      return dateObj.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
    case "{ago}": {
      const diff = dateObj.getTime() - now.getTime();
      const absDiff = Math.abs(diff);
      const seconds = Math.floor(absDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      const isFuture = diff > 0;
      const suffix = isFuture ? "" : " ago";
      const prefix = isFuture ? "in " : "";

      if (seconds < 60) return `${prefix}${seconds} second${seconds !== 1 ? "s" : ""}${suffix}`;
      if (minutes < 60) return `${prefix}${minutes} minute${minutes !== 1 ? "s" : ""}${suffix}`;
      if (hours < 24) return `${prefix}${hours} hour${hours !== 1 ? "s" : ""}${suffix}`;
      if (days < 30) return `${prefix}${days} day${days !== 1 ? "s" : ""}${suffix}`;
      if (months < 12) return `${prefix}${months} month${months !== 1 ? "s" : ""}${suffix}`;
      return `${prefix}${years} year${years !== 1 ? "s" : ""}${suffix}`;
    }
    default:
      return formatString;
  }
};
