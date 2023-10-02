import { ReactNode } from "react";
import { Block } from "../types";

import {
  Divider,
  Image,
  Section,
  Context,
  Actions,
  File,
  Header,
  Input,
  RichText,
  Video,
} from "./blocks";

export const getBlockComponent = (block: Block): ReactNode => {
  if (block.type === "divider") return <Divider data={block} />;
  if (block.type === "section") return <Section data={block} />;
  if (block.type === "image") return <Image data={block} />;
  if (block.type === "context") return <Context data={block} />;
  if (block.type === "actions") return <Actions data={block} />;
  if (block.type === "file") return <File data={block} />;
  if (block.type === "header") return <Header data={block} />;
  if (block.type === "input") return <Input data={block} />;
  if (block.type === "video") return <Video data={block} />;
  if (block.type === "rich_text") return <RichText data={block} />;

  return null;
};
