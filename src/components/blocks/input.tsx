import { getElementComponent } from "..";
import { InputBlock } from "../../types";
import { TextObject } from "../composition_objects";

type InputProps = {
  data: InputBlock;
};

export const Input = (props: InputProps) => {
  const { element: given_element, label, block_id, hint, optional, type } = props.data;

  const element = given_element ? getElementComponent(given_element) : null;

  return (
    <div
      id={block_id}
      className={`mt-2 mb-1 text-primary slack_blocks_to_jsx__input flex w-full text-black-primary`}
    >
      <div className="grow">
        <div className="flex flex-col gap-2">
          <TextObject
            data={{
              type: "mrkdwn",
              text: `*${label.text}*`,
              emoji: label.emoji,
              verbatim: label.verbatim,
            }}
          />

          <div className="mb-1 flex flex-col gap-1">
            <div className="relative shrink-0">{element}</div>

            {(hint || given_element.type === "plain_text_input") && (
              <div className="text-black-secondary text-small flex gap-1">
                {hint && (
                  <div className="inline">
                    <TextObject data={hint} />
                  </div>
                )}

                {given_element.type === "plain_text_input" && <p>↵ Please 'enter' to submit</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
