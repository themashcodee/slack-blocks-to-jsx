import { Literal } from "@yozora/ast";
import type {
  IBaseInlineTokenizerProps,
  IPartialInlineToken,
  ITokenDelimiter,
  ITokenizer,
} from "@yozora/core-tokenizer";

export const SlackUserMentionType = "slack_user_mention";
export type T = typeof SlackUserMentionType;
export type INode = Literal<typeof SlackUserMentionType>;

export interface IToken extends IPartialInlineToken<T> {
  thickness: number;
}

export interface IDelimiter extends ITokenDelimiter {
  type: "full";
  thickness: number;
}

export type IThis = ITokenizer;
export type ITokenizerProps = Partial<IBaseInlineTokenizerProps>;
