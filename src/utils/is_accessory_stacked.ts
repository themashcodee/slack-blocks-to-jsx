import { Element } from "../types";

export const is_accessory_stacked = (element: Element): boolean => {
  if (element.type === "button") return false;
  if (element.type === "checkboxes") return true;
  if (element.type === "datepicker") return false;
  if (element.type === "datetimepicker") return false;
  if (element.type === "email_text_input") return false;
  if (element.type === "image") return false;
  if (element.type === "multi_static_select") return false;
  if (element.type === "multi_external_select") return false;
  if (element.type === "multi_users_select") return false;
  if (element.type === "multi_conversations_select") return false;
  if (element.type === "multi_channels_select") return false;
  if (element.type === "number_input") return false;
  if (element.type === "overflow") return false;
  if (element.type === "plain_text_input") return false;
  if (element.type === "radio_buttons") return false;
  if (element.type === "static_select") return false;
  if (element.type === "external_select") return false;
  if (element.type === "users_select") return false;
  if (element.type === "conversations_select") return false;
  if (element.type === "channels_select") return false;
  if (element.type === "timepicker") return false;
  if (element.type === "url_text_input") return false;

  return false;
};
