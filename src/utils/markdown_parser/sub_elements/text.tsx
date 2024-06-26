import { TextSubElement } from "../types";

type Props = {
  element: TextSubElement;
};

export const Text = (props: Props) => {
  const { element } = props;

  let text = element.value;
  text = text.replace(/LINE__BREAK/g, "\n");

  return (
    <span>
      {element.value.split("[[DOUBLE_LINE_BREAK]]").map((line, index) => {
        return (
          <span key={index}>
            {index > 0 && <span className="slack_blocks_to_jsx__line_break_not_first"></span>}
            {line}
          </span>
        );
      })}
    </span>
  );
};
