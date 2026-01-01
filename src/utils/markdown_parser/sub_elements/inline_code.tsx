import { InlineCodeSubElement } from "../types";

type Props = {
  element: InlineCodeSubElement;
};

function extractUrl(value: string): string | null {
  const markdownLinkMatch = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (markdownLinkMatch && markdownLinkMatch[1] === markdownLinkMatch[2]) {
    return markdownLinkMatch[2] as string;
  }

  const slackLinkMatch = value.match(/^<(https?:\/\/[^>]+)>$/);
  if (slackLinkMatch) return slackLinkMatch[1] as string;

  return null;
}

export const InlineCode = (props: Props) => {
  const { element } = props;
  const url = extractUrl(element.value);

  if (url) {
    return (
      <a href={url} className="slack_code_inline slack_link">
        {url}
      </a>
    );
  }

  return <code className="slack_code_inline">{element.value}</code>;
};
