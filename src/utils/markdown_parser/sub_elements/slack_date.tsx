import { ReactNode } from "react";
import { SlackDateSubElement } from "../types";

type Props = {
  element: SlackDateSubElement;
};

export const SlackDate = (props: Props) => {
  const { element } = props;
  const { optionalLink, timestamp, tokenString } = element.value;

  const date = new Date(Number(timestamp) * 1000);

  let date_text = tokenString;

  if (tokenString.includes("{date_num}")) {
    date_text = date_text.replace("{date_num}", date_token_to_label(date, "{date_num}"));
  }
  if (tokenString.includes("{date}"))
    date_text = date_text.replace("{date}", date_token_to_label(date, "{date}"));
  if (tokenString.includes("{date_short}"))
    date_text = date_text.replace("{date_short}", date_token_to_label(date, "{date_short}"));
  if (tokenString.includes("{date_long}"))
    date_text = date_text.replace("{date_long}", date_token_to_label(date, "{date_long}"));
  if (tokenString.includes("{date_pretty}"))
    date_text = date_text.replace("{date_pretty}", date_token_to_label(date, "{date_pretty}"));
  if (tokenString.includes("{date_short_pretty}"))
    date_text = date_text.replace(
      "{date_short_pretty}",
      date_token_to_label(date, "{date_short_pretty}"),
    );
  if (tokenString.includes("{date_long_pretty}"))
    date_text = date_text.replace(
      "{date_long_pretty}",
      date_token_to_label(date, "{date_long_pretty}"),
    );
  if (tokenString.includes("{time}")) {
    date_text = date_text.replace("{time}", date_token_to_label(date, "{time}"));
  }
  if (tokenString.includes("{time_secs}")) {
    date_text = date_text.replace("{time_secs}", date_token_to_label(date, "{time_secs}"));
  }

  return (
    <div className="inline-block slack_date">
      <WrapWithLink wrap={!!optionalLink} href={optionalLink}>
        {date_text}
      </WrapWithLink>
    </div>
  );
};

const WrapWithLink = (props: { wrap: boolean; href: string; children: ReactNode }) => {
  if (!props.wrap) return <>{props.children}</>;

  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer" className="text-blue-primary">
      {props.children}
    </a>
  );
};

const date_token_to_label = (inputDate: Date, formatString: string): string => {
  const dateObj = new Date(inputDate);

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

  // Format strings based on formatString
  switch (formatString) {
    case "{date_num}":
      return `${dateObj.getFullYear()}-${getMonthWithZero(dateObj)}-${dateObj
        .getDate()
        .toString()
        .padStart(2, "0")}`;
    case "{date}":
      return `${dateObj.toLocaleString("en-US", { month: "long" })} ${getDayWithSuffix(
        dateObj,
      )}, ${dateObj.getFullYear()}`;
    case "{date_short}":
      return `${dateObj.toLocaleString("en-US", { month: "short" })} ${getDayWithSuffix(
        dateObj,
      )}, ${dateObj.getFullYear()}`;
    case "{date_long}":
      return `${dateObj.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
      })} ${getDayWithSuffix(dateObj)}, ${dateObj.getFullYear()}`;
    case "{date_pretty}":
      // Assuming implementation to check if date is yesterday, today, or tomorrow
      // For simplicity, let's return the same as {date}
      return `${dateObj.toLocaleString("en-US", { month: "long" })} ${getDayWithSuffix(
        dateObj,
      )}, ${dateObj.getFullYear()}`;
    case "{date_short_pretty}":
      // Assuming implementation to check if date is yesterday, today, or tomorrow
      // For simplicity, let's return the same as {date_short}
      return `${dateObj.toLocaleString("en-US", { month: "short" })} ${getDayWithSuffix(
        dateObj,
      )}, ${dateObj.getFullYear()}`;
    case "{date_long_pretty}":
      // Assuming implementation to check if date is yesterday, today, or tomorrow
      // For simplicity, let's return the same as {date_long}
      return `${dateObj.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
      })} ${getDayWithSuffix(dateObj)}, ${dateObj.getFullYear()}`;
    case "{time}":
      return dateObj.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    case "{time_secs}":
      return dateObj.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
    default:
      return formatString;
  }
};
