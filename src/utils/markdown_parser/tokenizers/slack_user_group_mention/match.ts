import type { INodeInterval, INodePoint } from "@yozora/character";
import { AsciiCodePoint } from "@yozora/character";
import type {
  IMatchInlineHookCreator,
  IResultOfFindDelimiters,
  IResultOfProcessSingleDelimiter,
  ITokenDelimiter,
} from "@yozora/core-tokenizer";
import { eatOptionalCharacters } from "@yozora/core-tokenizer";
import {
  SlackUserGroupMentionType,
  type IDelimiter,
  type IThis,
  type IToken,
  type T,
} from "./types";

export const match: IMatchInlineHookCreator<T, IDelimiter, IToken, IThis> = function (api) {
  return { findDelimiter, processSingleDelimiter };

  function* findDelimiter(): IResultOfFindDelimiters<IDelimiter> {
    const nodePoints: ReadonlyArray<INodePoint> = api.getNodePoints();
    const blockStartIndex: number = api.getBlockStartIndex();
    const blockEndIndex: number = api.getBlockEndIndex();

    const potentialDelimiters: ITokenDelimiter[] = [];
    for (let i = blockStartIndex; i < blockEndIndex; ++i) {
      const c = nodePoints[i]?.codePoint;
      if (
        c === AsciiCodePoint.OPEN_ANGLE &&
        nodePoints[i + 1]?.codePoint === AsciiCodePoint.EXCLAMATION_MARK &&
        nodePoints[i + 2]?.codePoint === AsciiCodePoint.LOWERCASE_S &&
        nodePoints[i + 3]?.codePoint === AsciiCodePoint.LOWERCASE_U &&
        nodePoints[i + 4]?.codePoint === AsciiCodePoint.LOWERCASE_B &&
        nodePoints[i + 5]?.codePoint === AsciiCodePoint.LOWERCASE_T &&
        nodePoints[i + 6]?.codePoint === AsciiCodePoint.LOWERCASE_E &&
        nodePoints[i + 7]?.codePoint === AsciiCodePoint.LOWERCASE_A &&
        nodePoints[i + 8]?.codePoint === AsciiCodePoint.LOWERCASE_M &&
        nodePoints[i + 9]?.codePoint === AsciiCodePoint.CARET
      ) {
        const j = eatOptionalCharacters(nodePoints, i + 10, blockEndIndex, AsciiCodePoint.CARET);
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
      nodeType: SlackUserGroupMentionType,
      startIndex: delimiter.startIndex,
      endIndex: delimiter.endIndex,
      thickness: delimiter.thickness,
    };
    return [token];
  }
};
