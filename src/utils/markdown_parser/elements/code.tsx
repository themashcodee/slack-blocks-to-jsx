import { CodeElement } from "../types";

type Props = {
  element: CodeElement;
};

export const Code = (props: Props) => {
  const { element } = props;

  return <code className="slack_code block p-2 text-xs whitespace-pre-wrap break-words rounded-[3px] border border-black-primary/[0.13] dark:border-dark-code-border bg-black-primary/[0.04] dark:bg-dark-code-bg dark:text-dark-text-primary w-full my-1 font-mono">{element.value}</code>;
};
