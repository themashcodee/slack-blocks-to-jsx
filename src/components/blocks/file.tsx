import { FileBlock } from "../../types";

type FileProps = {
  data: FileBlock;
};

export const File = (props: FileProps) => {
  const { type } = props.data;

  return null;
};
