import type { INodePoint } from "@yozora/character";
import { calcStringFromNodePoints } from "@yozora/character";
import type { IParseInlineHookCreator } from "@yozora/core-tokenizer";
import { SlackEmojiType, type INode, type IThis, type IToken, type T } from "./types";

export const parse: IParseInlineHookCreator<T, IToken, INode, IThis> = function (api) {
  return {
    parse: (tokens) =>
      tokens.map((token) => {
        const nodePoints: ReadonlyArray<INodePoint> = api.getNodePoints();
        const fullString = calcStringFromNodePoints(nodePoints, token.startIndex, token.endIndex);

        const emojiPattern = /^:([a-zA-Z0-9_\-+']+):$/;
        const match = emojiPattern.exec(fullString);

        let value = fullString;

        if (match) value = match[1] as string;

        const node: INode = api.shouldReservePosition
          ? { type: SlackEmojiType, position: api.calcPosition(token), value }
          : { type: SlackEmojiType, value };
        return node;
      }),
  };
};
