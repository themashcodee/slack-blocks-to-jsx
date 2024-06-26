import { InlineCodeSubElement } from "../types";

type Props = {
  element: InlineCodeSubElement;
};

export const InlineCode = (props: Props) => {
  const { element } = props;

  let text = element.value;
  text = text.replace(/LINE__BREAK/g, "\n");

  return <code className="slack_code_inline">{text}</code>;
};
