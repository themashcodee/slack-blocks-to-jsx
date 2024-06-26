export type TextSubElement = {
  type: "text";
  value: string;
};

export type EmphasisSubElement = {
  type: "emphasis";
  children: (TextSubElement | DeleteSubElement)[];
};

export type StrongSubElement = {
  type: "strong";
  children: TextSubElement[];
};

export type DeleteSubElement = {
  type: "delete";
  children: TextSubElement[];
};

export type InlineCodeSubElement = {
  type: "inlineCode";
  value: string;
};

export type LinkSubElement = {
  type: "link";
  url: "http://www.example.com";
  children: (TextSubElement | EmphasisSubElement | StrongSubElement | DeleteSubElement)[];
};

export type ParagraphElement = {
  type: "paragraph";
  children: (
    | EmphasisSubElement
    | TextSubElement
    | StrongSubElement
    | InlineCodeSubElement
    | DeleteSubElement
    | LinkSubElement
  )[];
};

export type BlockQuoteElement = {
  type: "blockquote";
  children: ParagraphElement[];
};

export type CodeElement = {
  type: "code";
  lang: null | string;
  meta: null | string;
  value: string;
};

export type Element = ParagraphElement | BlockQuoteElement | CodeElement;
