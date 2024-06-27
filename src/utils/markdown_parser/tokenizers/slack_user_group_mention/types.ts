import { Literal } from "@yozora/ast";
import type {
  IBaseInlineTokenizerProps,
  IPartialInlineToken,
  ITokenDelimiter,
  ITokenizer,
} from "@yozora/core-tokenizer";

export const SlackUserGroupMentionType = "slack_user_group_mention";
export type T = typeof SlackUserGroupMentionType;
export type INode = Literal<typeof SlackUserGroupMentionType>;

export interface IToken extends IPartialInlineToken<T> {
  thickness: number;
}

export interface IDelimiter extends ITokenDelimiter {
  type: "full";
  thickness: number;
}

export type IThis = ITokenizer;
export type ITokenizerProps = Partial<IBaseInlineTokenizerProps>;
