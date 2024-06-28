import { emojify } from "node-emoji";
import { missing_emojis } from "./list";

export const parseEmojis = (text: string) => {
  return emojify(text, {
    fallback: (value: string) => missing_emojis[value] || value,
  });
};
