import { ReactNode } from "react";
import {
  SlackBroadcast,
  SlackChannelMention,
  SlackDate,
  SlackUserGroupMention,
  SlackUserMention,
} from "./sub_elements";
import {
  SlackBroadcastSubElement,
  SlackDateSubElement,
} from "./types";

export const DIRECTIVE_USER = /<@[^|>\s]+(?:\|[^>]*)?>/;
export const DIRECTIVE_CHANNEL = /<#[^|>\s]+(?:\|[^>]*)?>/;
export const DIRECTIVE_USERGROUP = /<!subteam\^[^|>\s]+(?:\|[^>]*)?>/;
export const DIRECTIVE_BROADCAST = /<!(?:here|channel|everyone)>/;
export const DIRECTIVE_DATE = /<!date\^[^>]+>/;

const sources = [
  DIRECTIVE_USER,
  DIRECTIVE_CHANNEL,
  DIRECTIVE_USERGROUP,
  DIRECTIVE_BROADCAST,
  DIRECTIVE_DATE,
].map((r) => r.source);

export const DIRECTIVE_PATTERN_GLOBAL = new RegExp(sources.join("|"), "g");

const DATE_PARSE = /<!date\^(\d+)\^([^\^]*)\^?([^\|]*)\|([^>]*)>/;

export const renderDirective = (raw: string, key: number | string): ReactNode => {
  if (raw.startsWith("<@")) {
    const value = raw.slice(2, -1);
    return <SlackUserMention key={key} element={{ type: "slack_user_mention", value }} />;
  }
  if (raw.startsWith("<#")) {
    const value = raw.slice(2, -1);
    return <SlackChannelMention key={key} element={{ type: "slack_channel_mention", value }} />;
  }
  if (raw.startsWith("<!subteam^")) {
    const value = raw.slice(10, -1);
    return (
      <SlackUserGroupMention key={key} element={{ type: "slack_user_group_mention", value }} />
    );
  }
  if (raw === "<!here>" || raw === "<!everyone>" || raw === "<!channel>") {
    const value = raw.slice(2, -1) as SlackBroadcastSubElement["value"];
    return <SlackBroadcast key={key} element={{ type: "slack_broadcast", value }} />;
  }
  if (raw.startsWith("<!date^")) {
    const m = DATE_PARSE.exec(raw);
    const value: SlackDateSubElement["value"] = m
      ? {
          timestamp: m[1] ?? "",
          tokenString: m[2] ?? "",
          optionalLink: m[3] ?? "",
          fallbackText: m[4] ?? "",
        }
      : { timestamp: "", tokenString: "", optionalLink: "", fallbackText: "" };
    return <SlackDate key={key} element={{ type: "slack_date", value }} />;
  }
  return raw;
};

export const renderTextWithDirectives = (text: string): ReactNode[] => {
  const result: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(DIRECTIVE_PATTERN_GLOBAL.source, "g");
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    result.push(renderDirective(match[0], `d-${match.index}`));
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  return result;
};
