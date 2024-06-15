import type { ImageElement as ImageElementType } from "../../types";

type ImageElementProps = {
  data: ImageElementType;
};

export const ImageElement = (props: ImageElementProps) => {
  const { alt_text, image_url } = props.data;

  return (
    <div className="relative">
      <img
        src={image_url}
        alt={alt_text}
        className="w-[88px] h-[88px] rounded-lg overflow-hidden object-cover slack_blocks_to_jsx__image_element"
      />
    </div>
  );
};
