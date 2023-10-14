import XRegExp, { MatchSubString } from "xregexp";

type Object = Record<string, string>;
type Delimiter = string;
type PatternOptions = {
  prefixPattern?: string;
  spacePadded?: boolean;
  escapeDelimiter?: boolean;
};
type Window = [number, number];

const known_commands = ["here", "channel", "group", "everyone"] as const;

const escapeTags = (string: string) =>
  ["&lt;", string.substring(1, string.length - 1), "&gt;"].join("");

const regex = {
  new_line: XRegExp.cache("\\n", "nsg"),
  whitespace: XRegExp.cache("\\s", "ns"),
  characters: XRegExp.cache("(?<mrkdwnCharacter>[\\*\\`\\~\\_]|&gt;)", "ng"),
  user_mention: XRegExp.cache(
    "<@(((?<userID>[U|W][^|>]+)(\\|(?<userName>[^>]+))?)|(?<userNameWithoutID>[^>]+))>",
    "ng",
  ),
  channel_mention: XRegExp.cache(
    "<#(((?<channelID>C[^|>]+)(\\|(?<channelName>[^>]+))?)|(?<channelNameWithoutID>[^>]+))>",
    "ng",
  ),
  link: XRegExp.cache("<(?<linkUrl>https?:[^|>]+)(\\|(?<linkHtml>[^>]+))?>", "ng"),
  mail_to: XRegExp.cache("<mailto:(?<mailTo>[^|>]+)(\\|(?<mailToName>[^>]+))?>", "ng"),
  tel: XRegExp.cache("<tel:(?<tel>[^|>]+)(\\|(?<telName>[^>]+))?>", "ng"),
  subteam_command: XRegExp.cache(
    "<!subteam\\^(?<subteamID>S[^|>]+)(\\|(?<subteamName>[^>]+))?>",
    "ng",
  ),
  command: XRegExp.cache("<!(?<commandLiteral>[^|>]+)(\\|(?<commandName>[^>]+))?>", "ng"),
};

const utility = {
  replace_username: (match: MatchSubString, users: Object) => {
    const userName =
      match.userName || match.userNameWithoutID || (match.userID && users && users[match.userID]);
    if (userName) {
      return `<span class="user-mention">@${userName}</span>`;
    }
    return escapeTags(match.toString());
  },
  replace_channel: (match: MatchSubString, channels: Object) => {
    const channelName =
      match.channelName ||
      match.channelNameWithoutID ||
      (match.channelID && channels && channels[match.channelID]);
    if (channelName) {
      return `<span class="channel-mention">#${channelName}</span>`;
    }
    return escapeTags(match.toString());
  },
  replace_mailto: (match: MatchSubString) => {
    return `<a href="mailto:${match.mailTo}" target="_blank" rel="noopener noreferrer">${
      match.mailToName || match.mailTo
    }</a>`;
  },
  replace_tel: (match: MatchSubString) => {
    return `<a href="tel:${match.tel}" target="_blank" rel="noopener noreferrer">${
      match.telName || match.tel
    }</a>`;
  },
  replace_usergroup: (match: MatchSubString, usergroups: Object) => {
    const userGroupName =
      match.subteamName || (match.subteamID && usergroups && usergroups[match.subteamID]);
    if (userGroupName) {
      return `${userGroupName}`;
    }
    return escapeTags(match.toString());
  },
  replace_command: (match: MatchSubString) => {
    if (match.commandLiteral && match.commandLiteral.startsWith("subteam")) {
      return match.toString();
    } else if (known_commands.includes(match.commandLiteral)) {
      return `@${match.commandLiteral}`;
    } else if (match.commandName) {
      return `<${match.commandName}>`;
    }
    return `<${match.commandLiteral}>`;
  },
  build_opening_delimiter_regexp: (pattern: string, options: PatternOptions) => {
    const { prefixPattern = "", escapeDelimiter = true, spacePadded = false } = options;
    const escapedDelimiter = escapeDelimiter ? XRegExp.escape(pattern) : pattern;
    return XRegExp.cache(
      `${
        spacePadded ? "(?<openingCapturedWhitespace>^|\\s)" : ""
      }${prefixPattern}${escapedDelimiter}`,
      "ns",
    );
  },
  build_closing_delimiter_regexp: (delimiter: string, options: PatternOptions) => {
    const { spacePadded = false, escapeDelimiter = true } = options;
    const escapedDelimiter = escapeDelimiter ? XRegExp.escape(delimiter) : delimiter;
    return XRegExp.cache(
      `${escapedDelimiter}${spacePadded ? "(?<closingCapturedWhitespace>\\s|$)" : ""}`,
      "ns",
    );
  },
  increment_windows: (windows: Window[], offset: number) => {
    windows.forEach((tagWindow) => {
      tagWindow[0] += offset;
      tagWindow[1] += offset;
    });
    return windows;
  },
};

const patterns = {
  inline_code_opening: '<code class="slack_inline_code">',
  inline_code_closing: "</code>",
  code_opening: '<pre class="slack_code">',
  code_closing: "</pre>",
  bold_opening: '<strong class="slack_bold">',
  bold_closing: "</strong>",
  strikethrough_opening: '<del class="slack_strikethrough">',
  strikethrough_closing: "</del>",
  italic_opening: '<i class="slack_italics">',
  italic_closing: "</i>",
  blockquote_opening: '<blockquote class="slack_blockquote">',
  blockquote_closing: "</blockquote>",
  inline_blockquote_opening: '<blockquote class="slack_inline_blockquote">',
  inline_blockquote_closing: "</blockquote>",
  line_break_tag_literal: "<br />",
};

type ConvertMarkdownOptions = {
  markdown: boolean;
  users?: {
    [key: string]: string;
  };
  channels?: {
    [key: string]: string;
  };
  usergroups?: {
    [key: string]: string;
  };
};
export const slack_text_parser = (text: string, options: ConvertMarkdownOptions) => {
  if (!text) return text;

  let content = text;

  const users = options.users || {};
  const channels = options.channels || {};
  const usergroups = options.usergroups || {};
  const markdown = options.markdown;

  // Links can contain characters such as *_&~` that are a part of the character set used by
  // Slack Mrkdwn so before converting slack mrkdwn to html we need to encode these characters
  content = XRegExp.replace(text, regex.link, (match) => {
    const slackMrkdwnPercentageCharsMap: {
      [key: string]: string;
    } = {
      "*": "%2A",
      "&gt;": "%26gt;",
      "`": "%27",
      "~": "%7E",
      _: "%5F",
    };

    const mrkdwnCharacter = match.mrkdwnCharacter as string;

    const encodedLink = XRegExp.replace(
      match.linkUrl,
      regex.characters,
      (match) => slackMrkdwnPercentageCharsMap[mrkdwnCharacter] || match.mrkdwnCharacter,
    );
    return `<a href="${encodedLink}" target="_blank" rel="noopener noreferrer">${
      match.linkHtml || encodedLink
    }</a>`;
  });

  if (markdown) content = parse_markdown(content);

  return XRegExp.replaceEach(content, [
    [regex.user_mention, (match) => utility.replace_username(match, users)],
    [regex.channel_mention, (match) => utility.replace_channel(match, channels)],
    [regex.mail_to, (match) => utility.replace_mailto(match)],
    [regex.tel, (match) => utility.replace_tel(match)],
    [regex.subteam_command, (match) => utility.replace_usergroup(match, usergroups)],
    [regex.command, (match) => utility.replace_command(match)],
  ]);
};

const parse_markdown = (text: string) => {
  let expandedTextAndWindows: ReplaceCharactersOutput = { text: text, windows: [[0, text.length]] };

  expandedTextAndWindows = replace_characters({
    text: expandedTextAndWindows.text,
    delimiter: "*",
    replacementOpeningLiteral: patterns.bold_opening,
    replacementClosingLiteral: patterns.bold_closing,
    closedTagWindows: expandedTextAndWindows.windows,
    options: {
      maxReplacements: 100,
    },
  });

  expandedTextAndWindows = replace_characters({
    text: expandedTextAndWindows.text,
    delimiter: "~",
    replacementOpeningLiteral: patterns.strikethrough_opening,
    replacementClosingLiteral: patterns.strikethrough_closing,
    closedTagWindows: expandedTextAndWindows.windows,
    options: {
      maxReplacements: 100,
    },
  });

  expandedTextAndWindows = replace_characters({
    text: expandedTextAndWindows.text,
    delimiter: "_",
    replacementOpeningLiteral: patterns.italic_opening,
    replacementClosingLiteral: patterns.italic_closing,
    closedTagWindows: expandedTextAndWindows.windows,
    options: {
      spacePadded: true,
      maxReplacements: 100,
    },
  });

  expandedTextAndWindows = replace_characters({
    text: expandedTextAndWindows.text,
    delimiter: "```",
    replacementOpeningLiteral: patterns.code_opening,
    replacementClosingLiteral: patterns.code_closing,
    closedTagWindows: expandedTextAndWindows.windows,
    options: {
      partitionWindowOnMatch: true,
      replaceNewlines: true,
    },
  });
  expandedTextAndWindows = replace_characters({
    text: expandedTextAndWindows.text,
    delimiter: "`",
    replacementOpeningLiteral: patterns.inline_code_opening,
    replacementClosingLiteral: patterns.inline_code_closing,
    closedTagWindows: expandedTextAndWindows.windows,
    options: {
      partitionWindowOnMatch: true,
    },
  });

  expandedTextAndWindows = replace_characters({
    text: expandedTextAndWindows.text,
    delimiter: "&gt;&gt;&gt;",
    replacementOpeningLiteral: patterns.blockquote_opening,
    replacementClosingLiteral: patterns.blockquote_closing,
    closedTagWindows: expandedTextAndWindows.windows,
    options: {
      prefixPattern: "^\\s*",
      endingPattern: "$",
      replaceNewlines: true,
      maxReplacements: 100,
    },
  });

  expandedTextAndWindows = replace_characters({
    text: expandedTextAndWindows.text,
    delimiter: "&gt;",
    replacementOpeningLiteral: patterns.inline_blockquote_opening,
    replacementClosingLiteral: patterns.inline_blockquote_closing,
    closedTagWindows: expandedTextAndWindows.windows,
    options: {
      prefixPattern: "^\\s*",
      endingPattern: "\\n|$",
      maxReplacements: 100,
    },
  });

  return expandedTextAndWindows.text;
};

type ReplaceCharactersInput = {
  text: string;
  delimiter: Delimiter;
  replacementOpeningLiteral: string;
  replacementClosingLiteral: string;
  closedTagWindows: [Window];
  options: {
    partitionWindowOnMatch?: boolean;
    spacePadded?: boolean;
    endingPattern?: string;
    replaceNewlines?: boolean;
    prefixPattern?: string;
    maxReplacements?: number;
  };
  tagWindowIndex?: number;
  tagWindowOffset?: number;
};

type ReplaceCharactersOutput = {
  text: string;
  windows: [Window];
};

const replace_characters = (input: ReplaceCharactersInput): ReplaceCharactersOutput => {
  const {
    closedTagWindows,
    delimiter,
    options,
    replacementClosingLiteral,
    replacementOpeningLiteral,
    text,
    tagWindowIndex = 0,
    tagWindowOffset = 0,
  } = input;

  const partitionWindowOnMatch = options.partitionWindowOnMatch;
  const spacePadded = options.spacePadded;
  const asymmetric = options.endingPattern;
  const replaceNewlines = options.replaceNewlines;
  const prefixPattern = options.prefixPattern;
  let maxReplacements = options.maxReplacements;

  const openingDelimiterRegExp = utility.build_opening_delimiter_regexp(delimiter, {
    spacePadded,
    prefixPattern,
  });

  const closingDelimiterRegExp = asymmetric
    ? utility.build_closing_delimiter_regexp(options.endingPattern ?? "", {
        escapeDelimiter: false,
      })
    : utility.build_closing_delimiter_regexp(delimiter, { spacePadded });

  if (tagWindowIndex >= closedTagWindows.length || (maxReplacements && maxReplacements <= 0)) {
    return {
      text: text,
      windows: closedTagWindows,
    };
  }

  const currentClosedTagWindow = closedTagWindows[tagWindowIndex];
  const tagWindowStartIndex = currentClosedTagWindow?.[0] as number;
  const tagWindowEndIndex = currentClosedTagWindow?.[1] as number;
  if (
    tagWindowStartIndex >= tagWindowEndIndex ||
    tagWindowStartIndex + tagWindowOffset > tagWindowEndIndex
  ) {
    return replace_characters({
      text,
      delimiter,
      replacementClosingLiteral,
      replacementOpeningLiteral,
      closedTagWindows,
      options,
      tagWindowIndex: tagWindowIndex + 1,
    });
  }

  const openingMatch = XRegExp.exec(
    text,
    openingDelimiterRegExp,
    tagWindowStartIndex + tagWindowOffset,
  );

  if (openingMatch && openingMatch.index < tagWindowEndIndex) {
    const closingDelimiterLength = asymmetric ? 0 : delimiter.length;
    // Allow matching the end of the string if on the last window
    const closingMatchMaxIndex =
      (tagWindowIndex === closedTagWindows.length - 1 && tagWindowEndIndex === text.length
        ? tagWindowEndIndex + 1
        : tagWindowEndIndex) -
      closingDelimiterLength +
      1;

    // Look ahead at the next index to greedily capture as much inside the delimiters as possible
    let closingMatch = XRegExp.exec(
      text,
      closingDelimiterRegExp,
      openingMatch.index + delimiter.length,
    ) as XRegExp.ExecArray;
    let nextClosingMatch =
      closingMatch && XRegExp.exec(text, closingDelimiterRegExp, closingMatch.index + 1);
    while (nextClosingMatch) {
      // If the next match is still in the window and there is not whitespace in between the two, use the later one
      const nextWhitespace = XRegExp.exec(
        text,
        regex.whitespace,
        closingMatch.index + delimiter.length,
      );
      const crossedWhitespace = nextWhitespace && nextWhitespace.index < closingMatchMaxIndex;
      if (nextClosingMatch.index >= closingMatchMaxIndex || crossedWhitespace) {
        break;
      }
      closingMatch = nextClosingMatch;
      nextClosingMatch = XRegExp.exec(text, closingDelimiterRegExp, closingMatch.index + 1);
    }

    if (closingMatch && closingMatch.index < closingMatchMaxIndex) {
      const afterDelimitersIndex = closingMatch.index + closingMatch[0].length;
      const textBeforeDelimiter = text.slice(0, openingMatch.index);
      const textAfterDelimiter = text.slice(afterDelimitersIndex);

      const openingReplacementString = `${
        spacePadded ? openingMatch.openingCapturedWhitespace || " " : ""
      }${replacementOpeningLiteral}`;
      const closingReplacementString = `${replacementClosingLiteral}${
        spacePadded ? closingMatch.closingCapturedWhitespace || " " : ""
      }${asymmetric ? closingMatch[0] : ""}`;

      const textBetweenDelimiters = text.slice(
        openingMatch.index + openingMatch[0].length,
        closingMatch.index,
      );
      const replacedTextBetweenDelimiters = replaceNewlines
        ? XRegExp.replace(textBetweenDelimiters, regex.new_line, patterns.line_break_tag_literal)
        : textBetweenDelimiters;

      const replacedDelimiterText = [
        openingReplacementString,
        replacedTextBetweenDelimiters,
        closingReplacementString,
      ].join("");

      const delimiterReplacementLength = delimiter.length + closingDelimiterLength;
      const windowOffset =
        replacementOpeningLiteral.length +
        replacementClosingLiteral.length -
        delimiterReplacementLength +
        replacedTextBetweenDelimiters.length -
        textBetweenDelimiters.length;
      const newUpperWindowLimit = tagWindowEndIndex + windowOffset;

      const nextWindowIndex = partitionWindowOnMatch ? tagWindowIndex + 1 : tagWindowIndex;
      const nextTagWindowOffset = partitionWindowOnMatch
        ? 0
        : afterDelimitersIndex + windowOffset - tagWindowStartIndex + 1;
      if (partitionWindowOnMatch) {
        // Split the current window into two by the occurrence of the delimiter pair
        currentClosedTagWindow![1] = openingMatch.index;
        closedTagWindows.splice(nextWindowIndex, 0, [
          closingMatch.index + closingDelimiterLength + windowOffset,
          newUpperWindowLimit,
        ]);
      } else {
        currentClosedTagWindow![1] = newUpperWindowLimit;
      }
      utility.increment_windows(closedTagWindows.slice(nextWindowIndex + 1), windowOffset);

      if (maxReplacements) {
        maxReplacements -= 1;
      }

      return replace_characters({
        text: [textBeforeDelimiter, replacedDelimiterText, textAfterDelimiter].join(""),
        delimiter,
        replacementOpeningLiteral,
        replacementClosingLiteral,
        closedTagWindows,
        options: Object.assign({}, options, { maxReplacements }),
        tagWindowIndex: nextWindowIndex,
        tagWindowOffset: nextTagWindowOffset,
      });
    }
  }

  return replace_characters({
    text,
    delimiter,
    replacementOpeningLiteral,
    replacementClosingLiteral,
    closedTagWindows,
    options,
    tagWindowIndex: tagWindowIndex + 1,
  });
};
