import { ReactNode } from "react";
import { Block, Element } from "../types";

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
import { ButtonElement, CheckboxesElement, ImageElement } from "./elements";

export const getBlockComponent = (block: Block): ReactNode => {
  // ✅ DONE
  if (block.type === "divider") return <Divider data={block} />;
  // ✅ DONE
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

export const getElementComponent = (element: Element): ReactNode => {
  // ✅ PARTIALLY DONE, CONFIRM MODAL NOT IMPLEMENTED
  if (element.type === "button") return <ButtonElement data={element} />;
  // ✅ PARTIALLY DONE, CONFIRM MODAL NOT IMPLEMENTED
  if (element.type === "checkboxes") return <CheckboxesElement data={element} />;
  // ✅ DONE
  if (element.type === "image") return <ImageElement data={element} />;

  //
  if (element.type === "datepicker") return null;
  if (element.type === "datetimepicker") return null;
  if (element.type === "email_text_input") return null;
  if (element.type === "multi_static_select") return null;
  if (element.type === "multi_external_select") return null;
  if (element.type === "multi_users_select") return null;
  if (element.type === "multi_conversations_select") return null;
  if (element.type === "multi_channels_select") return null;
  if (element.type === "number_input") return null;
  if (element.type === "overflow") return null;
  if (element.type === "plain_text_input") return null;
  if (element.type === "radio_buttons") return null;
  if (element.type === "static_select") return null;
  if (element.type === "external_select") return null;
  if (element.type === "users_select") return null;
  if (element.type === "conversations_select") return null;
  if (element.type === "channels_select") return null;
  if (element.type === "timepicker") return null;
  if (element.type === "url_text_input") return null;

  return null;
};
