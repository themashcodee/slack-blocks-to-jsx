import { Position } from "@yozora/ast";
import type {
  IBaseInlineTokenizerProps,
  IPartialInlineToken,
  ITokenDelimiter,
  ITokenizer,
} from "@yozora/core-tokenizer";

export const SlackDateType = "slack_date";
export type T = typeof SlackDateType;

export type INode = {
  readonly type: T;
  position?: Position;
  value: {
    timestamp: string;
    tokenString: string;
    optionalLink: string;
    fallbackText: string;
  };
};

export interface IToken extends IPartialInlineToken<T> {
  thickness: number;
}

export interface IDelimiter extends ITokenDelimiter {
  type: "full";
  thickness: number;
}

export type IThis = ITokenizer;
export type ITokenizerProps = Partial<IBaseInlineTokenizerProps>;
