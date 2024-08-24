import { useState } from "react";
import { ImageBlock } from "../../types";

type ImageProps = {
  data: ImageBlock;
};

export const Image = (props: ImageProps) => {
  // TODO: USE OTHER PROPERTIES
  const { block_id, alt_text, image_url, image_bytes, image_height, image_width, title } =
    props.data;
  const [showImage, setShowImage] = useState(true);
  const captionText = title?.text;

  return (
    <div id={block_id} className="my-2 flex flex-col gap-2 slack_blocks_to_jsx__image">
      <div className="slack_blocks_to_jsx__image_media_trigger text-black-secondary text-small flex gap-1 items-center">
        {captionText && <span className="slack_blocks_to_jsx__image_title">{captionText}</span>}
        {image_bytes && (
          <span className="slack_blocks_to_jsx__image_size">
            {`(${Math.round(image_bytes / 1000)} kB)`}
          </span>
        )}

        <button
          type="button"
          className="w-[15px] h-[15px]"
          onClick={() => setShowImage((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="text-blue-primary"
            imageRendering="optimizeQuality"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            viewBox="0 0 512 336.36"
            width={6}
            height={6}
            style={{
              transform: showImage ? "rotate(0deg)" : "rotate(-90deg)",
            }}
          >
            <path
              fill="currentColor"
              fillRule="nonzero"
              d="M42.47.01L469.5 0C492.96 0 512 19.04 512 42.5c0 11.07-4.23 21.15-11.17 28.72L294.18 320.97c-14.93 18.06-41.7 20.58-59.76 5.65-1.8-1.49-3.46-3.12-4.97-4.83L10.43 70.39C-4.97 52.71-3.1 25.86 14.58 10.47 22.63 3.46 32.57.02 42.47.01z"
            ></path>
          </svg>
        </button>
      </div>

      {showImage && (
        <div className="rounded-md overflow-hidden relative max-w-max">
          <img
            src={image_url}
            style={{
              width: image_width,
              height: image_height,
            }}
            alt={alt_text}
          />
        </div>
      )}
    </div>
  );
};
