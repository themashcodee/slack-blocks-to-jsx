import { InlineCodeSubElement } from "../types";

type Props = {
  element: InlineCodeSubElement;
};

export const InlineCode = (props: Props) => {
  const { element } = props;

  return <code className="slack_code_inline">{element.value}</code>;
};
