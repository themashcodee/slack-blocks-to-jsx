export type SlackBroadcastSubElement = {
  type: "slack_broadcast";
  value: "here" | "everyone" | "channel";
};

export type SlackUserMentionSubElement = {
  type: "slack_user_mention";
  value: string;
};

export type SlackChannelMentionSubElement = {
  type: "slack_channel_mention";
  value: string;
};

export type SlackUserGroupMentionSubElement = {
  type: "slack_user_group_mention";
  value: string;
};

export type TextSubElement = {
  type: "text";
  value: string;
};

export type InlineCodeSubElement = {
  type: "inlineCode";
  value: string;
};

export type EmphasisSubElement = {
  type: "emphasis";
  children: (
    | TextSubElement
    | DeleteSubElement
    | SlackUserMentionSubElement
    | SlackChannelMentionSubElement
    | SlackUserGroupMentionSubElement
    | SlackBroadcastSubElement
  )[];
};

export type StrongSubElement = {
  type: "strong";
  children: (
    | TextSubElement
    | DeleteSubElement
    | SlackUserMentionSubElement
    | SlackChannelMentionSubElement
    | SlackUserGroupMentionSubElement
    | SlackBroadcastSubElement
  )[];
};

export type DeleteSubElement = {
  type: "delete";
  children: TextSubElement[];
};

export type LinkSubElement = {
  type: "link";
  url: "http://www.example.com";
  children: (TextSubElement | EmphasisSubElement | StrongSubElement | DeleteSubElement)[];
};

export type ParagraphElement = {
  type: "paragraph";
  children: (
    | EmphasisSubElement
    | TextSubElement
    | StrongSubElement
    | InlineCodeSubElement
    | DeleteSubElement
    | LinkSubElement
    | SlackUserMentionSubElement
    | SlackChannelMentionSubElement
    | SlackUserGroupMentionSubElement
    | SlackBroadcastSubElement
  )[];
};

export type BlockQuoteElement = {
  type: "blockquote";
  children: ParagraphElement[];
};

export type CodeElement = {
  type: "code";
  lang: null | string;
  meta: null | string;
  value: string;
};

export type MarkdownElement = ParagraphElement | BlockQuoteElement | CodeElement;