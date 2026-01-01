import { InlineCodeSubElement } from "../types";

type Props = {
  element: InlineCodeSubElement;
};

type ExtractedLink = {
  url: string;
  label: string;
} | null;

function extractLink(value: string): ExtractedLink {
  // Check for markdown link format: [label](url)
  const markdownLinkMatch = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (markdownLinkMatch) {
    return {
      label: markdownLinkMatch[1] as string,
      url: markdownLinkMatch[2] as string,
    };
  }

  // Check for Slack link format with label: <url|label>
  const slackLinkWithLabelMatch = value.match(/^<(https?:\/\/[^|>]+)\|([^>]+)>$/);
  if (slackLinkWithLabelMatch) {
    return {
      url: slackLinkWithLabelMatch[1] as string,
      label: slackLinkWithLabelMatch[2] as string,
    };
  }

  // Check for Slack link format without label: <url>
  const slackLinkMatch = value.match(/^<(https?:\/\/[^>]+)>$/);
  if (slackLinkMatch) {
    const url = slackLinkMatch[1] as string;
    return { url, label: url };
  }

  // Check for bare URL (entire value is just a URL)
  const bareUrlMatch = value.match(/^https?:\/\/\S+$/);
  if (bareUrlMatch) {
    return { url: value, label: value };
  }

  return null;
}

export const InlineCode = (props: Props) => {
  const { element } = props;
  const link = extractLink(element.value);

  if (link) {
    return (
      <a href={link.url} className="slack_code_inline slack_link">
        {link.label}
      </a>
    );
  }

  return <code className="slack_code_inline">{element.value}</code>;
};
