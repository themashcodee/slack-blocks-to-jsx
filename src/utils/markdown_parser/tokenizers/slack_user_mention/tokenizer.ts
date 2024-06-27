import type {
  IInlineTokenizer,
  IMatchInlineHookCreator,
  IParseInlineHookCreator,
} from "@yozora/core-tokenizer";
import { BaseInlineTokenizer, TokenizerPriority } from "@yozora/core-tokenizer";
import { match } from "./match";
import { parse } from "./parse";
import {
  SlackUserMentionType,
  type IDelimiter,
  type INode,
  type IThis,
  type IToken,
  type ITokenizerProps,
  type T,
} from "./types";

export class SlackUserMentionTokenizer
  extends BaseInlineTokenizer<T, IDelimiter, IToken, INode, IThis>
  implements IInlineTokenizer<T, IDelimiter, IToken, INode, IThis>
{
  constructor(props: ITokenizerProps = {}) {
    super({
      name: SlackUserMentionType,
      priority: props.priority || TokenizerPriority.ATOMIC,
    });
  }

  public override readonly match: IMatchInlineHookCreator<T, IDelimiter, IToken, IThis> = match;
  public override readonly parse: IParseInlineHookCreator<T, IToken, INode, IThis> = parse;
}
