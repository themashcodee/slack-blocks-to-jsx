import { useState } from "react";
import { VideoBlock, TextObject as TextObjectType } from "../../types";
import { TextObject } from "../composition_objects";
import { useGlobalData } from "../../store";

type VideoProps = {
  data: VideoBlock;
};

export const Video = (props: VideoProps) => {
  const {
    alt_text,
    title,
    video_url,
    author_name,
    block_id,
    description,
    title_url,
    iframeProps = {},
  } = props.data;

  const [showVideo, setShowVideo] = useState(true);

  return (
    <div className="py-2 slack_blocks_to_jsx__video" id={block_id}>
      {author_name && (
        <div className="slack_blocks_to_jsx__video_author">
          <span className="font-bold">{author_name}</span>
        </div>
      )}

      {description && (
        <div className="slack_blocks_to_jsx__video_description">
          <TextObject data={description} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1 slack_blocks_to_jsx__video_title">
        {title_url ? (
          <RenderLink title={title} url={title_url} />
        ) : (
          <p>
            <TextObject data={title} />
          </p>
        )}

        <button
          type="button"
          className="w-[15px] h-[15px]"
          onClick={() => setShowVideo((prev) => !prev)}
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
              transform: showVideo ? "rotate(0deg)" : "rotate(-90deg)",
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

      <div className="slack_blocks_to_jsx__video_container max-w-max">
        {showVideo && (
          <iframe
            title={alt_text}
            className="max-w-[360px] bg-gray-100 w-full aspect-video"
            src={video_url}
            {...iframeProps}
          />
        )}
      </div>
    </div>
  );
};

const RenderLink = ({ url, title }: { url: string; title: TextObjectType<"plain_text"> }) => {
  const { hooks } = useGlobalData();

  if (hooks.link) {
    return (
      <>
        {hooks.link({
          href: url,
          children: <TextObject data={title} />,
          className: "text-blue-primary",
          rel: "noopener noreferrer",
          target: "_blank",
        })}
      </>
    );
  }

  return (
    <a href={url} className="text-blue-primary" target="_blank" rel="noopener noreferrer">
      <TextObject data={title} />
    </a>
  );
};
