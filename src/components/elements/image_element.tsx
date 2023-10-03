import type { ImageElement as ImageElementType } from "../../types";

type ImageElementProps = {
  data: ImageElementType;
};

export const ImageElement = (props: ImageElementProps) => {
  const { alt_text, image_url } = props.data;

  return (
    <div className="relative w-6 h-[25.25px]">
      <img src={image_url} alt={alt_text} className="w-5 h-5 rounded-[2px] overflow-hidden" />
    </div>
  );
};
