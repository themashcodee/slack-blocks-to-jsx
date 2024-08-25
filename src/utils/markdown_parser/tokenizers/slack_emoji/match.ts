import type { INodePoint } from "@yozora/character";
import { AsciiCodePoint } from "@yozora/character";
import type {
  IMatchInlineHookCreator,
  IResultOfFindDelimiters,
  IResultOfProcessSingleDelimiter,
} from "@yozora/core-tokenizer";
import { SlackEmojiType, type IDelimiter, type IThis, type IToken, type T } from "./types";

export const match: IMatchInlineHookCreator<T, IDelimiter, IToken, IThis> = function (api) {
  return { findDelimiter, processSingleDelimiter };

  function hasSpaceBetween(
    nodePoints: ReadonlyArray<INodePoint>,
    startIndex: number,
    endIndex: number,
  ): boolean {
    for (let i = startIndex + 1; i < endIndex; ++i) {
      if (nodePoints[i]?.codePoint === AsciiCodePoint.SPACE) {
        return true; // Found a space between the colons
      }
    }
    return false;
  }

  function isPartOfLink(nodePoints: ReadonlyArray<INodePoint>, index: number): boolean {
    // Check for common URL protocols preceding the colon (e.g., http:, https:, wss:, etc.)
    const protocolCheck = () => {
      const protocolPatterns = ["http", "https", "ftp", "wss", "ws", "mailto"];
      for (const protocol of protocolPatterns) {
        if (
          index >= protocol.length &&
          nodePoints
            .slice(index - protocol.length, index)
            .map((np) => String.fromCharCode(np.codePoint))
            .join("") === protocol
        ) {
          return true;
        }
      }
      return false;
    };

    // If the colon is part of a known protocol (e.g., http:), return true to skip parsing
    if (protocolCheck()) return true;

    return false;
  }

  function* findDelimiter(): IResultOfFindDelimiters<IDelimiter> {
    const nodePoints: ReadonlyArray<INodePoint> = api.getNodePoints();
    const blockStartIndex: number = api.getBlockStartIndex();
    const blockEndIndex: number = api.getBlockEndIndex();

    const potentialDelimiters: IDelimiter[] = [];

    for (let i = blockStartIndex; i < blockEndIndex; ++i) {
      if (nodePoints[i]?.codePoint === AsciiCodePoint.COLON) {
        const endIndex = findEndDelimiter(nodePoints, i, blockEndIndex);

        if (isPartOfLink(nodePoints, i)) continue;
        if (hasSpaceBetween(nodePoints, i, endIndex)) continue;

        if (endIndex !== -1) {
          potentialDelimiters.push({
            type: "both",
            startIndex: i,
            endIndex: endIndex + 1,
            thickness: endIndex + 1 - i,
          });
          i = endIndex; // Skip past the matched emoji
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

  function findEndDelimiter(
    nodePoints: ReadonlyArray<INodePoint>,
    startIndex: number,
    blockEndIndex: number,
  ): number {
    for (let i = startIndex + 1; i < blockEndIndex; ++i) {
      if (nodePoints[i]?.codePoint === AsciiCodePoint.COLON) {
        return i;
      }
    }
    return -1; // Not found
  }

  function processSingleDelimiter(
    delimiter: IDelimiter,
  ): IResultOfProcessSingleDelimiter<T, IToken> {
    const token: IToken = {
      nodeType: SlackEmojiType,
      startIndex: delimiter.startIndex,
      endIndex: delimiter.endIndex,
      thickness: delimiter.thickness,
    };
    return [token];
  }
};
