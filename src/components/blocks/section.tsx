import { getElementComponent } from "..";
import { SectionBlock } from "../../types";
import { is_accessory_stacked } from "../../utils";
import { TextObject } from "../composition_objects";

type SectionProps = {
  data: SectionBlock;
};

export const Section = (props: SectionProps) => {
  const { accessory, fields, text, block_id } = props.data;

  const element = accessory ? getElementComponent(accessory) : null;
  const is_stacked = accessory ? is_accessory_stacked(accessory) : false;

  return (
    <div
      id={block_id}
      className={`mt-2 mb-1 text-primary slack_blocks_to_jsx__section flex w-full text-black-primary ${
        is_stacked ? "flex-col" : ""
      }`}
    >
      <div className="grow">
        <div className="flex flex-col gap-3">
          {text && <TextObject data={text} />}

          {fields && (
            <div className="grid grid-col-2 w-full">
              {fields.map((field, i) => {
                return <TextObject key={i} data={field} />;
              })}
            </div>
          )}
        </div>
      </div>

      {element && is_stacked ? (
        element
      ) : (
        <div className="ml-2 mb-1 relative shrink-0">{element}</div>
      )}
    </div>
  );
};
