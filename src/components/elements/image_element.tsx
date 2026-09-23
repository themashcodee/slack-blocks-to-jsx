import type { ImageElement as ImageElementType } from "../../types";
import { useGlobalData } from "../../store";

type ImageElementProps = {
  inside?: "context" | "section";
  data: ImageElementType;
};

export const ImageElement = (props: ImageElementProps) => {
  const { inside = "section" } = props;
  const { alt_text, image_url } = props.data;
  const { urlTransform } = useGlobalData();

  return (
    <div className="relative">
      <img
        src={urlTransform(image_url, "image")}
        alt={alt_text}
        className={`overflow-hidden object-cover slack_blocks_to_jsx__image_element ${
          inside === "context"
            ? "w-[20px] h-[20px] rounded-sm mr-1 mb-[5px]"
            : "w-[88px] h-[88px] rounded-lg"
        }`}
      />
    </div>
  );
};
