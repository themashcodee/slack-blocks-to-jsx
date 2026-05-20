import YozoraParser from "@yozora/parser";
import { ReactNode } from "react";
import { GlobalStore } from "../../store";
import { Blockquote, Code, Paragraph } from "./elements";
import { maskProtectedRegions } from "./preparse";
import {
  SlackBroadcastTokenizer,
  SlackChannelMentionTokenizer,
  SlackDateTokenizer,
  SlackEmojiTokenizer,
  SlackUserGroupMentionTokenizer,
  SlackUserMentionTokenizer,
} from "./tokenizers";
import { MarkdownElement } from "./types";

// Slack directives like `<!subteam^S1|@team>` and `<@U1|name>` contain `@` chars in their
// fallback labels. Yozora's autolink tokenizers misread these as email autolinks and steal
// them from our directive tokenizers. Disable both — bare URL autolinking is already handled
// upstream by the `<X>` / `<X|Y>` regex rewrites that produce `[url](url)` markdown links.
const buildParser = (matchTypedBroadcast: boolean) =>
  new YozoraParser()
    .unmountTokenizer("@yozora/tokenizer-list")
    .unmountTokenizer("@yozora/tokenizer-autolink")
    .unmountTokenizer("@yozora/tokenizer-autolink-extension")
    .useTokenizer(new SlackUserMentionTokenizer())
    .useTokenizer(new SlackChannelMentionTokenizer())
    .useTokenizer(new SlackUserGroupMentionTokenizer())
    .useTokenizer(new SlackBroadcastTokenizer({ matchTypedBroadcast }))
    .useTokenizer(new SlackDateTokenizer())
    .useTokenizer(new SlackEmojiTokenizer());

// Slack's `verbatim` flag is effectively a no-op in section/mrkdwn rendering EXCEPT for one
// case: it suppresses interpolation of typed-out `@here` / `@channel` / `@everyone` (without
// the `<!…>` brackets). Empirically verified — see PR description for the side-by-side. We
// honor that by using a parser without the bare-form broadcast match in verbatim mode.
const parserDefault = buildParser(true);
const parserVerbatim = buildParser(false);

type Options = {
  markdown: boolean;
  // In Slack's renderer, `verbatim` only changes two things in section/mrkdwn (empirically
  // verified): it suppresses bare-URL autolinking, and it suppresses interpolation of bare
  // `@here` / `@channel` / `@everyone`. Everything else — directives in `<…>` form, markdown
  // sugar, code spans, angle-bracket URLs — renders identically in both modes. This library
  // doesn't autolink bare URLs in either mode, so the only thing we gate on `verbatim` is the
  // bare-broadcast tokenizer match.
  verbatim: boolean;
  users: GlobalStore["users"];
  channels: GlobalStore["channels"];
  hooks: GlobalStore["hooks"];
};

function isValidURL(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export const markdown_parser = (markdown: string, options: Options): ReactNode => {
  if (!markdown) return null;

  let text_string = markdown;

  // Normalize fenced code so yozora can recognize ``` blocks.
  text_string = text_string.replace(/```/g, `\n\`\`\`\n`);

  // Mask fenced code, inline code, and directive atoms so the regex transforms below
  // cannot mangle their interiors. Restore before handing to yozora — yozora's own
  // tokenizers parse the original directive/code text.
  const mask = maskProtectedRegions(text_string);
  text_string = mask.masked;

  // REPLACE SINGLE asterisk WITH DOUBLE asterisk
  text_string = text_string.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, "**$1**");
  // REPLACE SINGLE tilde WITH DOUBLE tilde
  text_string = text_string.replace(/(?<!~)~(?!~)([^~]+)~(?!~)/g, "~~$1~~");
  // CHANGE LINK FORMATTING FROM <link|label> to [label](link), EXCLUDING LINKS STARTING WITH !date
  text_string = text_string.replace(/<(?!(?:!date))([^|>]+)\|([^>]+)>/g, (match, link, label) => {
    if (isValidURL(link)) return `[${label}](${link})`;
    return match;
  });
  // CHANGE LINK FORMATTING FROM <link> to [link](link), EXCLUDING LINKS STARTING WITH !date
  text_string = text_string.replace(/<(?!(?:!date))([^|>]+)>/g, (match, link) => {
    if (isValidURL(link)) return `[${link}](${link})`;
    return match;
  });
  // REPLACE _\n with _[space]\n
  text_string = text_string.replace(/_\n/g, "_ \n");

  // ADD A SPACE BEFORE LINE BREAK AND AFTER THE :, SO IT DOES NOT MESS UP EMOJIS PARSING
  text_string = text_string.replace(/:\n/g, ": \n");

  // HANDLE CONSECUTIVE LINE BREAKS
  // We need to keep \n\n so Yozora can properly separate paragraphs and parse formatting.
  // For additional newlines beyond \n\n, we add LBKS markers to preserve visual line breaks.
  text_string = text_string.replace(/\n\n(\n*)/g, (_, extraNewlines) => {
    return "\n\n" + "LBKS".repeat(extraNewlines.length);
  });

  // Insert a blank line after blockquote lines if the next line is not a blockquote
  text_string = text_string.replace(/^>.*$(?!\n>)/gm, "$&\n");

  // Restore the originally-masked fenced code, inline code, and directive atoms so yozora
  // sees their native shape. Directive tokenizers will tokenize them at parse time.
  text_string = mask.restore(text_string);

  const parsed_data = (options.verbatim ? parserVerbatim : parserDefault).parse(text_string);

  const elements = parsed_data.children as unknown as MarkdownElement[];

  return (
    <div>
      {elements.map((element, i) => {
        if (element.type === "paragraph")
          return <Paragraph key={i} element={element} isFirst={i === 0} />;
        if (element.type === "blockquote") return <Blockquote key={i} element={element} />;
        if (element.type === "code") return <Code key={i} element={element} />;

        return null;
      })}
    </div>
  );
};
