import { HeaderBlock } from "../../types";
import { TextObject } from "../composition_objects";

type HeaderProps = {
  data: HeaderBlock;
};

export const Header = (props: HeaderProps) => {
  const { text, block_id } = props.data;

  return (
    <div id={block_id} className="mt-1 slack_blocks_to_jsx__header">
      <h3 className="text-header font-bold slack_blocks_to_jsx__header_heading">
        <TextObject data={text} />
      </h3>
    </div>
  );
};
