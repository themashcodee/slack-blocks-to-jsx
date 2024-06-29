import type { INodePoint } from "@yozora/character";
import { calcStringFromNodePoints } from "@yozora/character";
import type { IParseInlineHookCreator } from "@yozora/core-tokenizer";
import { SlackDateType, INode, IThis, IToken, T } from "./types";

export const parse: IParseInlineHookCreator<T, IToken, INode, IThis> = function (api) {
  return {
    parse: (tokens) =>
      tokens.map((token) => {
        const nodePoints: ReadonlyArray<INodePoint> = api.getNodePoints();
        const fullString = calcStringFromNodePoints(nodePoints, token.startIndex, token.endIndex);

        const datePattern = /<!date\^(\d+)\^([^\^]*)\^?([^\|]*)\|([^>]*)>/;
        const match = datePattern.exec(fullString);

        let value = {
          timestamp: "",
          tokenString: "",
          optionalLink: "",
          fallbackText: "",
        };

        if (match) {
          value = {
            timestamp: match[1] as string,
            tokenString: match[2] as string,
            optionalLink: match[3] as string,
            fallbackText: match[4] as string,
          };
        }

        const node: INode = api.shouldReservePosition
          ? { type: SlackDateType, position: api.calcPosition(token), value }
          : { type: SlackDateType, value };
        return node;
      }),
  };
};
