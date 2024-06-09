import { emojify } from "node-emoji";

const missing_emojis: {
  [key: string]: string;
} = {
  ":heart_hands:": "🫶",
  ":white_frowning_face:": "🙁",
  ":smiling_face_with_3_hearts:": "🥰",
  ":thumbsup:": ":+1:",
};

export const parseEmojis = (text: string, skin_tone?: number, unicode?: string) => {
  // TODO: HANDLE SKINTONE AND UNICODE

  let emojified = text;

  for (const [key, value] of Object.entries(missing_emojis)) {
    emojified = emojified.replace(key, value);
  }

  emojified = emojify(emojified);

  return emojified;
};
