import type { INodePoint } from "@yozora/character";
import { AsciiCodePoint, calcStringFromNodePoints } from "@yozora/character";
import type { IParseInlineHookCreator } from "@yozora/core-tokenizer";
import { SlackBroadcastType, type INode, type IThis, type IToken, type T } from "./types";

export const parse: IParseInlineHookCreator<T, IToken, INode, IThis> = function (api) {
  return {
    parse: (tokens) =>
      tokens.map((token) => {
        const nodePoints: ReadonlyArray<INodePoint> = api.getNodePoints();
        const isBracket = nodePoints[token.startIndex]?.codePoint === AsciiCodePoint.OPEN_ANGLE;
        const startIndex = isBracket ? token.startIndex + 2 : token.startIndex + 1;
        const endIndex = isBracket ? token.endIndex - 1 : token.endIndex;

        const value = calcStringFromNodePoints(nodePoints, startIndex, endIndex);
        const node: INode = api.shouldReservePosition
          ? { type: SlackBroadcastType, position: api.calcPosition(token), value }
          : { type: SlackBroadcastType, value };
        return node;
      }),
  };
};
