import type { INodePoint } from "@yozora/character";
import { calcStringFromNodePoints } from "@yozora/character";
import type { IParseInlineHookCreator } from "@yozora/core-tokenizer";
import { SlackUserGroupMentionType, type INode, type IThis, type IToken, type T } from "./types";

export const parse: IParseInlineHookCreator<T, IToken, INode, IThis> = function (api) {
  return {
    parse: (tokens) =>
      tokens.map((token) => {
        const nodePoints: ReadonlyArray<INodePoint> = api.getNodePoints();
        let startIndex: number = token.startIndex + 2; // Skip `<#`
        let endIndex: number = token.endIndex - 1; // Skip `>`

        const value = calcStringFromNodePoints(nodePoints, startIndex, endIndex);
        const node: INode = api.shouldReservePosition
          ? { type: SlackUserGroupMentionType, position: api.calcPosition(token), value }
          : { type: SlackUserGroupMentionType, value };
        return node;
      }),
  };
};
