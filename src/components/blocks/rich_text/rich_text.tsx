import { RichTextBlockElement } from "../../../types";
import { RichTextBlock } from "../../../types";
import { numberToAlpha, numberToRoman } from "../../../utils";
import { RichTextListWrapper } from "./rich_text_list_wrapper";
import { RichTextSectionElement } from "./rich_text_section";

type RichTextProps = {
  data: RichTextBlock;
};

export const RichText = (props: RichTextProps) => {
  const { elements, block_id } = props.data;

  return (
    <div id={block_id} className="slack_blocks_to_jsx__rich_text">
      {elements.map((element, i) => {
        return <Element key={`${element.type}__${i}`} element={element} />;
      })}
    </div>
  );
};

type ElementProps = {
  element: RichTextBlockElement;
};

const Element = (props: ElementProps) => {
  const { element } = props;

  if (element.type === "rich_text_list") {
    const { elements, style, border = 0, indent, offset } = element;

    // TODO: Add support for offset

    return (
      <div className="flex gap-2 slack_blocks_to_jsx__rich_text_list_element">
        {border === 1 && <div className="w-1 rounded bg-gray-primary self-stretch"></div>}

        <RichTextListWrapper element={element} className="list-none">
          {elements.map((el, i) => {
            return (
              <li
                className="flex"
                key={`${el.type}__${i}`}
                style={{
                  marginLeft: indent ? (indent > 5 ? 0 : indent * 28) : 0,
                }}
              >
                {style === "ordered" && (
                  <span className="w-[22px] h-[22px] shrink-0 flex items-center justify-center">
                    {(indent === undefined || indent === 0 || indent === 3 || indent === 6) &&
                      `${i + 1}.`}
                    {(indent === 1 || indent === 4 || indent === 7) && `${numberToAlpha(i + 1)}.`}
                    {(indent === 2 || indent === 5 || indent === 8) && `${numberToRoman(i + 1)}.`}
                  </span>
                )}

                {style === "bullet" && (
                  <span className="w-[22px] h-[22px] shrink-0 flex items-center justify-center">
                    {(indent === undefined || indent === 0 || indent === 3 || indent === 6) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    )}

                    {(indent === 1 || indent === 4 || indent === 7) && (
                      <span className="w-1.5 h-1.5 rounded-full border border-current"></span>
                    )}

                    {(indent === 2 || indent === 5 || indent === 8) && (
                      <span className="w-1.5 h-1.5 rounded-[1.5px] bg-current"></span>
                    )}
                  </span>
                )}

                <div
                  style={{
                    marginLeft: 6,
                  }}
                >
                  <Element key={`${element.type}__${i}`} element={el} />
                </div>
              </li>
            );
          })}
        </RichTextListWrapper>
      </div>
    );
  }

  if (element.type === "rich_text_preformatted") {
    const { elements, border } = element;

    return (
      <code className="flex gap-2 w-full slack_blocks_to_jsx__rich_text_preformatted_element">
        {border === 1 && <div className="w-1 rounded bg-gray-primary self-stretch"></div>}

        <pre
          className="p-2 rounded my-1 whitespace-pre-wrap bg-gray-secondary text-xs leading-[1.50001] border grow"
          style={{
            wordWrap: "break-word",
            wordBreak: "normal",
          }}
        >
          {elements.map((el, i) => {
            return <RichTextSectionElement key={`${el.type}__${i}`} element={el} />;
          })}
        </pre>
      </code>
    );
  }

  if (element.type === "rich_text_quote") {
    const { elements, border } = element;

    return (
      <blockquote className="flex gap-2 slack_blocks_to_jsx__rich_text_quote_element">
        {border === 1 && <div className="w-1 rounded bg-gray-primary self-stretch"></div>}

        <p>
          {elements.map((el, i) => {
            return <RichTextSectionElement key={`${el.type}__${i}`} element={el} />;
          })}
        </p>
      </blockquote>
    );
  }

  if (element.type === "rich_text_section") {
    const { elements } = element;

    return (
      <p className="inline-block slack_blocks_to_jsx__rich_text_section_element">
        {elements.map((el, i) => {
          return <RichTextSectionElement key={`${el.type}__${i}`} element={el} />;
        })}
      </p>
    );
  }

  return null;
};
