import type { INodeInterval, INodePoint } from "@yozora/character";
import { AsciiCodePoint } from "@yozora/character";
import type {
  IMatchInlineHookCreator,
  IResultOfFindDelimiters,
  IResultOfProcessSingleDelimiter,
  ITokenDelimiter,
} from "@yozora/core-tokenizer";
import { eatOptionalCharacters } from "@yozora/core-tokenizer";
import { SlackChannelMentionType, type IDelimiter, type IThis, type IToken, type T } from "./types";

export const match: IMatchInlineHookCreator<T, IDelimiter, IToken, IThis> = function (api) {
  return { findDelimiter, processSingleDelimiter };

  function* findDelimiter(): IResultOfFindDelimiters<IDelimiter> {
    const nodePoints: ReadonlyArray<INodePoint> = api.getNodePoints();
    const blockStartIndex: number = api.getBlockStartIndex();
    const blockEndIndex: number = api.getBlockEndIndex();

    const potentialDelimiters: ITokenDelimiter[] = [];
    for (let i = blockStartIndex; i < blockEndIndex; ++i) {
      const c = nodePoints[i]?.codePoint;
      if (c === AsciiCodePoint.OPEN_ANGLE && nodePoints[i + 1]?.codePoint === AsciiCodePoint.HT) {
        const j = eatOptionalCharacters(nodePoints, i + 2, blockEndIndex, AsciiCodePoint.AT_SIGN);
        if (j < blockEndIndex) {
          potentialDelimiters.push({
            type: "opener",
            startIndex: i,
            endIndex: j,
          });
        }
      } else if (c === AsciiCodePoint.CLOSE_ANGLE) {
        potentialDelimiters.push({
          type: "closer",
          startIndex: i,
          endIndex: i + 1,
        });
      }
    }

    let pIndex = 0;
    let lastEndIndex = -1;
    let delimiter: IDelimiter | null = null;
    while (pIndex < potentialDelimiters.length) {
      const [startIndex, endIndex] = yield delimiter;

      if (lastEndIndex === endIndex) {
        if (delimiter == null || delimiter.startIndex >= startIndex) continue;
      }
      lastEndIndex = endIndex;

      let openerDelimiter: INodeInterval | null = null;
      let closerDelimiter: INodeInterval | null = null;
      for (; pIndex < potentialDelimiters.length; ++pIndex) {
        const delimiter = potentialDelimiters[pIndex]!;
        if (delimiter.startIndex >= startIndex && delimiter.type !== "closer") {
          openerDelimiter = delimiter;
          break;
        }
      }

      for (let i = pIndex + 1; i < potentialDelimiters.length; ++i) {
        const delimiter = potentialDelimiters[i]!;
        if (delimiter.type === "closer") {
          closerDelimiter = delimiter;
          break;
        }
      }

      if (closerDelimiter == null) return;

      delimiter = {
        type: "full",
        startIndex: openerDelimiter!.startIndex,
        endIndex: closerDelimiter.endIndex,
        thickness: closerDelimiter.endIndex - closerDelimiter.startIndex,
      };
    }
  }

  function processSingleDelimiter(
    delimiter: IDelimiter,
  ): IResultOfProcessSingleDelimiter<T, IToken> {
    const token: IToken = {
      nodeType: SlackChannelMentionType,
      startIndex: delimiter.startIndex,
      endIndex: delimiter.endIndex,
      thickness: delimiter.thickness,
    };
    return [token];
  }
};
