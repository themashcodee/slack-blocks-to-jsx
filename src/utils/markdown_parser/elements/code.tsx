import { CodeElement } from "../types";

type Props = {
  element: CodeElement;
};

export const Code = (props: Props) => {
  const { element } = props;

  return <code className="slack_code">{element.value}</code>;
};
