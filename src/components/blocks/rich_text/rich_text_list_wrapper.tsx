import React, { ComponentPropsWithoutRef } from "react";
import { RichTextList } from "../../../original_types";

type Props = ComponentPropsWithoutRef<"ul"> & {
  element: RichTextList;
};

export const RichTextListWrapper = (props: Props) => {
  const { element, children, ...rest } = props;

  if (element.style === "bullet") {
    return <ul {...rest}>{children}</ul>;
  }

  return <ol {...rest}>{children}</ol>;
};
