import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownBlock } from "../../types";
import { SlackEmoji } from "../../utils/markdown_parser/sub_elements/slack_emoji";
import { remarkSlackEmoji, SLACK_EMOJI_TAG } from "../../utils/remark_slack_emoji";

type MarkdownBlockProps = {
  data: MarkdownBlock;
};

// Renders the placeholder emitted by remarkSlackEmoji through the same
// <SlackEmoji> component the mrkdwn parser uses (so custom/standard/alias/
// skin-tone emoji match). The emoji name comes from the hast node properties.
const MarkdownEmoji = ({ node }: { node?: { properties?: { name?: unknown } } }) => {
  const name = typeof node?.properties?.name === "string" ? node.properties.name : "";
  return <SlackEmoji element={{ type: "slack_emoji", value: name }} />;
};

// react-markdown's `Components` type only allows known HTML tag names as keys,
// so the custom `slack-emoji` element is registered through a cast.
const emojiComponents = { [SLACK_EMOJI_TAG]: MarkdownEmoji } as Components;

export const MarkdownBlockComponent = (props: MarkdownBlockProps) => {
  const { text, block_id } = props.data;

  // TO MAKE SURE THE EMOJIS RENDER CORRECTLY AFTER \N
  const transformedText = text.replace(/\n/g, " \n ");

  return (
    <div
      id={block_id}
      className="mt-2 mb-1 text-primary text-black-primary dark:text-dark-text-primary slack_blocks_to_jsx__markdown_block"
    >
      <Markdown
        remarkPlugins={[remarkGfm, remarkSlackEmoji]}
        components={{
          ...emojiComponents,
          h1: ({ children }) => (
            <h1 className="text-header font-semibold text-black-primary dark:text-dark-text-primary mb-0.5">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-header font-semibold text-black-primary dark:text-dark-text-primary mb-0.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-header font-semibold text-black-primary dark:text-dark-text-primary mb-0.5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-semibold text-black-primary dark:text-dark-text-primary mb-0.5">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="font-semibold text-black-primary dark:text-dark-text-primary mb-0.5">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="font-semibold text-black-primary dark:text-dark-text-primary mb-0.5">
              {children}
            </h6>
          ),
          p: ({ children }) => <p className="mb-0.5">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-0.5">{children}</ol>,
          li: ({ children, ...props }) => {
            const className = props.className;
            if (className === "task-list-item") {
              return <li className="list-none flex items-start gap-1">{children}</li>;
            }
            return <li className="mb-0.5">{children}</li>;
          },
          input: ({ checked, ...props }) => {
            if (props.type === "checkbox") {
              return <input type="checkbox" checked={checked} readOnly className="mt-1 mr-1" />;
            }
            return <input {...props} />;
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-primary dark:text-dark-link hover:underline underline-offset-4"
            >
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="slack_code block p-2 text-xs whitespace-pre-wrap break-words rounded-[3px] border border-black-primary/[0.13] dark:border-dark-code-border bg-black-primary/[0.04] dark:bg-dark-code-bg dark:text-dark-text-primary w-full my-1 font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="slack_code_inline inline-block px-1 text-xs whitespace-pre-wrap break-words rounded-[3px] border border-black-primary/[0.13] dark:border-dark-code-border bg-black-primary/[0.04] dark:bg-dark-code-bg text-red-primary dark:text-dark-text-primary font-mono">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="my-0.5">{children}</pre>,
          blockquote: ({ children }) => (
            <blockquote className="relative pl-4 my-0.5">{children}</blockquote>
          ),
          table: ({ children }) => (
            <table className="border-collapse my-1 w-full">{children}</table>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-black-primary/30 dark:border-dark-border">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-black-primary/[0.13] dark:border-dark-border">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1 text-left font-semibold border border-black-primary/[0.13] dark:border-dark-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2 py-1 border border-black-primary/[0.13] dark:border-dark-border">
              {children}
            </td>
          ),
          hr: () => <hr className="border-black-primary/[0.13] dark:border-dark-border my-1" />,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => <del className="line-through">{children}</del>,
        }}
      >
        {transformedText}
      </Markdown>
    </div>
  );
};
