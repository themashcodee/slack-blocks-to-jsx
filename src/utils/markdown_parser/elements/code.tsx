import { CodeElement } from "../types";

type Props = {
  element: CodeElement;
};

export const Code = (props: Props) => {
  const { element } = props;
  const value = element.value.replace(/LBKS/g, "\n");

  return <code className="slack_code">{value}</code>;
};
