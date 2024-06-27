import type { InlineCode, InlineCodeType } from "@yozora/ast";
import type {
  IBaseInlineTokenizerProps,
  IPartialInlineToken,
  ITokenDelimiter,
  ITokenizer,
} from "@yozora/core-tokenizer";

export type T = InlineCodeType;
export type INode = InlineCode;

export type ElementName = "slack_user_mention";

export interface IToken extends IPartialInlineToken<T> {
  thickness: number;
}

export interface IDelimiter extends ITokenDelimiter {
  type: "full";
  thickness: number;
}

export type IThis = ITokenizer;

export type ITokenizerProps = Partial<IBaseInlineTokenizerProps>;
