import { Literal } from "@yozora/ast";
import type {
  IBaseInlineTokenizerProps,
  IPartialInlineToken,
  ITokenDelimiter,
  ITokenizer,
} from "@yozora/core-tokenizer";

export const SlackBroadcastType = "slack_broadcast";
export type T = typeof SlackBroadcastType;
export type INode = Literal<typeof SlackBroadcastType>;

export interface IToken extends IPartialInlineToken<T> {
  thickness: number;
}

export interface IDelimiter extends ITokenDelimiter {
  type: "full";
  thickness: number;
}

export type IThis = ITokenizer;
export type ITokenizerProps = Partial<IBaseInlineTokenizerProps>;
