export type RichTextBlockSubElement =
  | RichTextList
  | RichTextPreformatted
  | RichTextQuote
  | RichTextSection;

export type RichTextList = {
  type: "rich_text_list";
  style: "bullet" | "ordered";
  /**
   * The number of spaces to indent this block. It must be a number between 0 and 8.
   */
  indent?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  offset?: number;
  /**
   * 0 or 1 (default 0) - if 1, a border is drawn on the left side of the block.
   */
  border?: 0 | 1;
  elements: RichTextSection[];
};
export type RichTextPreformatted = {
  type: "rich_text_preformatted";
  elements: RichTextSectionElement[];
  /**
   * 0 or 1 (default 0) - if 1, a border is drawn on the left side of the block.
   */
  border?: 0 | 1;
};
export type RichTextQuote = {
  type: "rich_text_quote";
  elements: RichTextSectionElement[];
  /**
   * 0 or 1 (default 0) - if 1, a border is drawn on the left side of the block.
   */
  border?: 0 | 1;
};
export type RichTextSection = {
  type: "rich_text_section";
  elements: RichTextSectionElement[];
};

export type RichTextBlockElement =
  | RichTextList
  | RichTextPreformatted
  | RichTextQuote
  | RichTextSection;

export type RichTextSectionElement =
  | RichTextSectionText
  | RichTextSectionChannel
  | RichTextSectionUser
  | RichTextSectionEmoji
  | RichTextSectionLink
  | RichTextSectionUsergroup
  | RichTextSectionBroadcast
  | RichTextSectionDate;

export type RichTextSectionDate = {
  type: "date";
  timestamp: number;
  format: string;
  style?: RichTextSectionElementStyleCode;
};

export type RichTextSectionText = {
  type: "text";
  text: string;
  style?: RichTextSectionElementStyleCode;
};
export type RichTextSectionChannel = {
  type: "channel";
  channel_id: string;
  style?: RichTextSectionElementStyle;
};
export type RichTextSectionUser = {
  type: "user";
  user_id: string;
  style?: RichTextSectionElementStyle;
};
export type RichTextSectionEmoji = {
  type: "emoji";
  /**
   * Name of the emoji, e.g. smiley, sparkles, grinning_face.
   */
  name: string;
  /**
   * hyphen-delineated list of Unicode code points
   * */
  unicode?: string;
  /**
   * included only for single-color skintone emojis (not compound emojis)
   * */
  skin_tone?: 1 | 2 | 3 | 4 | 5 | 6;
};
export type RichTextSectionLink = {
  type: "link";
  url: string;
  text?: string;
  style?: RichTextSectionElementStyleCode;
};

export type RichTextSectionUsergroup = {
  type: "usergroup";
  usergroup_id: string;
  style?: RichTextSectionElementStyle;
};

export type RichTextSectionBroadcast = {
  type: "broadcast";
  range: "channel" | "here" | "everyone";
  style?: RichTextSectionElementStyleCode;
};

export type RichTextSectionElementStyle = {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  underline?: boolean;
  highlight?: boolean;
  client_highlight?: boolean;
  unlink?: boolean;
};

export type RichTextSectionElementStyleCode = {
  code?: boolean;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  underline?: boolean;
};
