import { ReactNode } from "react";
import { Block } from "../types";

import { Divider, Image, Section, Context, Actions } from "./blocks";

export const getBlockComponent = (block: Block): ReactNode => {
  if (block.type === "divider") return <Divider data={block} />;
  if (block.type === "section") return <Section data={block} />;
  if (block.type === "image") return <Image data={block} />;
  if (block.type === "context") return <Context data={block} />;
  if (block.type === "actions") return <Actions data={block} />;
  if (block.type === "file") return <div>file</div>;
  if (block.type === "header") return <div>header</div>;
  if (block.type === "input") return <div>input</div>;
  if (block.type === "video") return <div>video</div>;

  return null;
};
