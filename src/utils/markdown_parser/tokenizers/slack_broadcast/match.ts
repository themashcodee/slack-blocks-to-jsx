import type { INodePoint } from "@yozora/character";
import { AsciiCodePoint } from "@yozora/character";
import type {
  IMatchInlineHookCreator,
  IResultOfFindDelimiters,
  IResultOfProcessSingleDelimiter,
} from "@yozora/core-tokenizer";
import { SlackBroadcastType, type IDelimiter, type IThis, type IToken, type T } from "./types";

export const match: IMatchInlineHookCreator<T, IDelimiter, IToken, IThis> = function (api) {
  return { findDelimiter, processSingleDelimiter };

  function* findDelimiter(): IResultOfFindDelimiters<IDelimiter> {
    const nodePoints: ReadonlyArray<INodePoint> = api.getNodePoints();
    const blockStartIndex: number = api.getBlockStartIndex();
    const blockEndIndex: number = api.getBlockEndIndex();

    const targets = ["@everyone", "@here", "@channel"];
    const potentialDelimiters: IDelimiter[] = [];

    for (let i = blockStartIndex; i < blockEndIndex; ++i) {
      if (nodePoints[i]?.codePoint === AsciiCodePoint.AT_SIGN) {
        for (const target of targets) {
          if (matchTarget(nodePoints, i, target)) {
            potentialDelimiters.push({
              type: "full",
              startIndex: i,
              endIndex: i + target.length,
              thickness: target.length,
            });
            i += target.length - 1; // Skip past the matched target
            break;
          }
        }
      }
    }

    let pIndex = 0;
    let lastEndIndex = -1;
    let currentDelimiter: IDelimiter | null = null;
    while (pIndex < potentialDelimiters.length) {
      const [startIndex, endIndex] = yield currentDelimiter;

      if (lastEndIndex === endIndex) {
        if (currentDelimiter == null || currentDelimiter.startIndex >= startIndex) continue;
      }
      lastEndIndex = endIndex;

      for (; pIndex < potentialDelimiters.length; ++pIndex) {
        const delimiter = potentialDelimiters[pIndex]!;
        if (delimiter.startIndex >= startIndex) {
          currentDelimiter = {
            type: "full",
            startIndex: delimiter.startIndex,
            endIndex: delimiter.endIndex,
            thickness: delimiter.thickness,
          };
          break;
        }
      }
    }
  }

  function matchTarget(
    nodePoints: ReadonlyArray<INodePoint>,
    startIndex: number,
    target: string,
  ): boolean {
    for (let j = 0; j < target.length; ++j) {
      if (nodePoints[startIndex + j]?.codePoint !== target.charCodeAt(j)) {
        return false;
      }
    }
    return true;
  }

  function processSingleDelimiter(
    delimiter: IDelimiter,
  ): IResultOfProcessSingleDelimiter<T, IToken> {
    const token: IToken = {
      nodeType: SlackBroadcastType,
      startIndex: delimiter.startIndex,
      endIndex: delimiter.endIndex,
      thickness: delimiter.thickness,
    };
    return [token];
  }
};
