import { RichTextBlock } from "../../types";

type RichTextProps = {
  data: RichTextBlock;
};

export const RichText = (props: RichTextProps) => {
  const { type } = props.data;

  return null;
};
