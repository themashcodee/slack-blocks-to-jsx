import { ReactNode } from "react";
import { InlineCodeSubElement } from "../types";

type Props = {
  element: InlineCodeSubElement;
};

type ParsedPart = { type: "text"; content: string } | { type: "link"; url: string; label: string };

/**
 * Parse inline code value and extract links embedded within text.
 * Handles:
 * - Markdown links: [label](url)
 * - Slack links with label: <url|label>
 * - Slack links without label: <url>
 * - Bare URLs: https://...
 */
function parseInlineCodeValue(value: string): ParsedPart[] {
  const parts: ParsedPart[] = [];

  // Combined regex to match all link formats
  // Group 1: Markdown link label, Group 2: Markdown link URL
  // Group 3: Slack link URL (with label), Group 4: Slack link label
  // Group 5: Slack link URL (without label)
  // Group 6: Bare URL
  const linkRegex =
    /\[([^\]]+)\]\(([^)]+)\)|<(https?:\/\/[^|>]+)\|([^>]+)>|<(https?:\/\/[^>]+)>|(https?:\/\/\S+)/g;

  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(value)) !== null) {
    // Add text before this match
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: value.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      // Markdown link: [label](url)
      parts.push({ type: "link", label: match[1], url: match[2] });
    } else if (match[3] !== undefined && match[4] !== undefined) {
      // Slack link with label: <url|label>
      parts.push({ type: "link", url: match[3], label: match[4] });
    } else if (match[5] !== undefined) {
      // Slack link without label: <url>
      parts.push({ type: "link", url: match[5], label: match[5] });
    } else if (match[6] !== undefined) {
      // Bare URL
      parts.push({ type: "link", url: match[6], label: match[6] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < value.length) {
    parts.push({ type: "text", content: value.slice(lastIndex) });
  }

  return parts;
}

export const InlineCode = (props: Props) => {
  const { element } = props;
  const parts = parseInlineCodeValue(element.value);

  // If the entire value is just a single link, render without code wrapper
  const firstPart = parts[0];
  if (parts.length === 1 && firstPart?.type === "link") {
    return (
      <a
        href={firstPart.url}
        target="_blank"
        rel="noopener noreferrer"
        className="slack_code_inline hover:underline"
      >
        {firstPart.label}
      </a>
    );
  }

  // If there are no links, just render as plain code
  if (parts.every((part) => part.type === "text")) {
    return <code className="slack_code_inline">{element.value}</code>;
  }

  // Mixed content: render code with embedded links
  const children: ReactNode[] = parts.map((part, i) => {
    if (part.type === "text") {
      return <span key={i}>{part.content}</span>;
    }
    return (
      <a
        key={i}
        href={part.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {part.label}
      </a>
    );
  });

  return <code className="slack_code_inline">{children}</code>;
};
