import { emojify } from "node-emoji";

const missing_emojis: {
  [key: string]: string;
} = {
  heart_hands: "🫶",
  white_frowning_face: "🙁",
};

export const parseEmojis = (text: string) => {
  let emojified = text;

  for (const [key, value] of Object.entries(missing_emojis)) {
    emojified = emojified.replace(key, value);
  }

  emojified = emojify(emojified);

  return emojified;
};
