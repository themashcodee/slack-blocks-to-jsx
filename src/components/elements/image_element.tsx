import type { ImageElement as ImageElementType } from "../../types";

type ImageElementProps = {
  inside?: "context" | "section";
  data: ImageElementType;
};

export const ImageElement = (props: ImageElementProps) => {
  const { inside = "section" } = props;
  const { alt_text, image_url } = props.data;

  return (
    <div className="relative">
      <img
        src={image_url}
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
