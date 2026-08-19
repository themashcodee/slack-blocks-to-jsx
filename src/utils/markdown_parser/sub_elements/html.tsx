import { decodeEntities } from "../decode_entities";
import { HTMLSubElement } from "../types";

type Props = {
  element: HTMLSubElement;
};

export const HTML = (props: Props) => {
  const { element } = props;
  const value = decodeEntities(element.value);

  if (!value) return <span>{value}</span>;
  if (value === " ") return <span>&nbsp;</span>;

  return (
    <span>
      {value.split("LBKS").map((line, index) => {
        if (line === "") {
          return <span key={index} className="block h-2"></span>;
        }

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
