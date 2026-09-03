import type { UrlSourceElement as UrlSourceElementType } from "../../types";
import { useGlobalData } from "../../store";

type UrlSourceElementProps = {
  data: UrlSourceElementType;
};

export const UrlSourceElement = (props: UrlSourceElementProps) => {
  const { url, text } = props.data;
  const { urlTransform } = useGlobalData();

  return (
    <a
      href={urlTransform(url, "link")}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-primary dark:text-dark-link hover:underline text-small slack_blocks_to_jsx__url_source_element"
    >
      {text}
    </a>
  );
};
