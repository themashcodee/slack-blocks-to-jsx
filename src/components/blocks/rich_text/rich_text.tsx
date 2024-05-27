import { AnyRichTextBlockElement, AnyRichTextSectionElement } from "../../../original_types";
import { RichTextBlock } from "../../../types";
import { RichTextSectionChannel } from "./rich_text_section_channel";
import { RichTextSectionUser } from "./rich_text_section_user";

type RichTextProps = {
  data: RichTextBlock;
};

export const RichText = (props: RichTextProps) => {
  const { elements, block_id } = props.data;

  return (
    <div id={block_id}>
      {elements.map((element, i) => {
        return <Element key={`${element.type}__${i}`} element={element} />;
      })}
    </div>
  );
};

type ElementProps = {
  element: AnyRichTextBlockElement;
};

const Element = (props: ElementProps) => {
  const { element } = props;

  if (element.type === "rich_text_list") {
    const { elements, style, border = 0, indent, offset } = element;

    // TODO: Add support for offset

    return (
      <div className="flex gap-2">
        {border === 1 && <div className="w-1 rounded bg-gray-primary self-stretch"></div>}

        <ul className={`list-none`}>
          {elements.map((el, i) => {
            return (
              <li
                className="flex"
                key={`${el.type}__${i}`}
                style={{
                  marginLeft: indent ? (indent > 5 ? 0 : indent * 28 + 6 + 28) : 0,
                }}
              >
                {style === "ordered" && (
                  <span className="w-[22px] h-[22px] shrink-0 flex items-center justify-center">
                    {i + 1}.
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
        </ul>
      </div>
    );
  }

  if (element.type === "rich_text_preformatted") {
    const { elements, border } = element;

    return (
      <div className="flex gap-2 w-full">
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
      </div>
    );
  }

  if (element.type === "rich_text_quote") {
    const { elements, border } = element;

    return (
      <div className="flex gap-2">
        <div className="w-1 rounded bg-gray-primary self-stretch"></div>
        {border === 1 && <div className="w-1 rounded bg-gray-primary self-stretch"></div>}

        {elements.map((el, i) => {
          return <RichTextSectionElement key={`${el.type}__${i}`} element={el} />;
        })}
      </div>
    );
  }

  if (element.type === "rich_text_section") {
    return (
      <div className="inline-block">
        {element.elements.map((el, i) => {
          return <RichTextSectionElement key={`${el.type}__${i}`} element={el} />;
        })}
      </div>
    );
  }

  return null;
};

type RichTextSectionElementProps = {
  element: AnyRichTextSectionElement;
};

const RichTextSectionElement = (props: RichTextSectionElementProps) => {
  const { element } = props;

  if (element.type === "text") {
    return (
      <span
        className={`
            ${element.style?.italic ? "italic" : ""}
            ${element.style?.strike ? "line-through" : ""}
            ${element.style?.code ? "slack_inline_code" : ""}
            ${element.style?.bold ? "font-medium" : ""}
          `}
      >
        {element.text}
      </span>
    );
  }

  if (element.type === "user") {
    return <RichTextSectionUser user_id={element.user_id} style={element.style} />;
  }

  if (element.type === "channel") {
    return <RichTextSectionChannel channel_id={element.channel_id} style={element.style} />;
  }

  if (element.type === "link") {
    return (
      <a
        target="_blank"
        rel="noreferrer noopener"
        href={element.url}
        className={`
        text-blue-primary hover:underline underline-offset-4
          ${element.style?.italic ? "italic" : ""}
          ${element.style?.strike ? "line-through" : ""}
          ${element.style?.code ? "slack_inline_code" : ""}
          ${element.style?.bold ? "font-medium" : ""}
        `}
      >
        {element.text}
      </a>
    );
  }

  return <span></span>;
};
