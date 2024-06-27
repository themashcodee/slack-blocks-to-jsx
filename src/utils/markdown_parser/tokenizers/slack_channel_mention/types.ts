import { Literal } from "@yozora/ast";
import type {
  IBaseInlineTokenizerProps,
  IPartialInlineToken,
  ITokenDelimiter,
  ITokenizer,
} from "@yozora/core-tokenizer";

export const SlackChannelMentionType = "slack_channel_mention";
export type T = typeof SlackChannelMentionType;
export type INode = Literal<typeof SlackChannelMentionType>;

export interface IToken extends IPartialInlineToken<T> {
  thickness: number;
}

export interface IDelimiter extends ITokenDelimiter {
  type: "full";
  thickness: number;
}

export type IThis = ITokenizer;
export type ITokenizerProps = Partial<IBaseInlineTokenizerProps>;
