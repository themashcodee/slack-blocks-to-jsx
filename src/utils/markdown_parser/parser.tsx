import YozoraParser from "@yozora/parser";
import { Element } from "./types";
import { Blockquote, Paragraph, Code } from "./elements";

const parser = new YozoraParser().unmountTokenizer("@yozora/tokenizer-list");

// TODO: HANDLE DATE PARSING
// TODO: HANDLE CHANNEL, USER, USER GROUP, @HERE, @EVERYONE, @CHANNEL PARSING

export const markdown_parser = (markdown: string): JSX.Element => {
  const parsed_data = parser.parse(markdown);

  console.log({ parsed_data });
  const elements = parsed_data.children as unknown as Element[];

  return (
    <div className="text-sm">
      {elements.map((element, i) => {
        if (element.type === "paragraph") return <Paragraph key={i} element={element} />;
        if (element.type === "blockquote") return <Blockquote key={i} element={element} />;
        if (element.type === "code") return <Code key={i} element={element} />;

        return null;
      })}
    </div>
  );
};
