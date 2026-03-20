import { ReactNode } from "react";
import { Block, Element } from "../types";

import {
  Divider,
  Image,
  Section,
  Context,
  ContextActions,
  Actions,
  File,
  Header,
  Input,
  MarkdownBlockComponent,
  Plan,
  RichText,
  Table,
  TaskCard,
  Video,
} from "./blocks";
import {
  ButtonElement,
  CheckboxesElement,
  ImageElement,
  PlaintTextInput,
  UsersSelectElement,
  DatePickerElement,
  TimePickerElement,
  DateTimePickerElement,
  EmailInputElement,
  UrlInputElement,
  NumberInputElement,
  RadioButtonsElement,
  OverflowMenuElement,
  StaticSelectElement,
  ExternalSelectElement,
  ConversationsSelectElement,
  ChannelsSelectElement,
  MultiStaticSelectElement,
  MultiExternalSelectElement,
  MultiUsersSelectElement,
  MultiConversationsSelectElement,
  MultiChannelsSelectElement,
  FeedbackButtonsElement,
  IconButtonElement,
  FileInputElement,
  RichTextInputElement,
  UrlSourceElement,
  WorkflowButtonElement,
} from "./elements";

export const getBlockComponent = (block: Block): ReactNode => {
  if (block.type === "divider") return <Divider data={block} />;
  if (block.type === "section") return <Section data={block} />;
  if (block.type === "image") return <Image data={block} />;
  if (block.type === "context") return <Context data={block} />;
  if (block.type === "actions") return <Actions data={block} />;
  if (block.type === "context_actions") return <ContextActions data={block} />;
  if (block.type === "file") return <File data={block} />;
  if (block.type === "header") return <Header data={block} />;
  if (block.type === "input") return <Input data={block} />;
  if (block.type === "video") return <Video data={block} />;
  if (block.type === "rich_text") return <RichText data={block} />;
  if (block.type === "table") return <Table data={block} />;
  if (block.type === "markdown") return <MarkdownBlockComponent data={block} />;
  if (block.type === "plan") return <Plan data={block} />;
  if (block.type === "task_card") return <TaskCard data={block} />;

  return null;
};

export const getElementComponent = (element: Element): ReactNode => {
  if (element.type === "button") return <ButtonElement data={element} />;
  if (element.type === "checkboxes") return <CheckboxesElement data={element} />;
  if (element.type === "image") return <ImageElement data={element} />;
  if (element.type === "plain_text_input") return <PlaintTextInput data={element} />;
  if (element.type === "users_select") return <UsersSelectElement data={element} />;
  if (element.type === "datepicker") return <DatePickerElement data={element} />;
  if (element.type === "timepicker") return <TimePickerElement data={element} />;
  if (element.type === "datetimepicker") return <DateTimePickerElement data={element} />;
  if (element.type === "email_text_input") return <EmailInputElement data={element} />;
  if (element.type === "url_text_input") return <UrlInputElement data={element} />;
  if (element.type === "number_input") return <NumberInputElement data={element} />;
  if (element.type === "radio_buttons") return <RadioButtonsElement data={element} />;
  if (element.type === "overflow") return <OverflowMenuElement data={element} />;
  if (element.type === "static_select") return <StaticSelectElement data={element} />;
  if (element.type === "external_select") return <ExternalSelectElement data={element} />;
  if (element.type === "conversations_select") return <ConversationsSelectElement data={element} />;
  if (element.type === "channels_select") return <ChannelsSelectElement data={element} />;
  if (element.type === "multi_static_select") return <MultiStaticSelectElement data={element} />;
  if (element.type === "multi_external_select")
    return <MultiExternalSelectElement data={element} />;
  if (element.type === "multi_users_select") return <MultiUsersSelectElement data={element} />;
  if (element.type === "multi_conversations_select")
    return <MultiConversationsSelectElement data={element} />;
  if (element.type === "multi_channels_select")
    return <MultiChannelsSelectElement data={element} />;
  if (element.type === "feedback_buttons") return <FeedbackButtonsElement data={element} />;
  if (element.type === "icon_button") return <IconButtonElement data={element} />;
  if (element.type === "file_input") return <FileInputElement data={element} />;
  if (element.type === "rich_text_input") return <RichTextInputElement data={element} />;
  if (element.type === "url") return <UrlSourceElement data={element} />;
  if (element.type === "workflow_button") return <WorkflowButtonElement data={element} />;

  return null;
};
