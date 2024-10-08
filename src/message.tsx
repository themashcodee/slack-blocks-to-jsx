import { BlockWrapper } from "./block_wrapper";
import { getBlockComponent } from "./components";
import { Header } from "./header";
import { GlobalProvider, GlobalStore } from "./store";
import { Block } from "./types";
import { merge_classes } from "./utils";

type Props = {
  /**
   * Not yet implemented.
   */
  theme?: "light" | "dark";
  /**
   * Show a link to open the message in the Slack Block Kit Builder, for debugging purposes. Defaults to false.
   */
  showBlockKitDebug?: boolean;
  blocks: Block[];
  logo: string;
  name: string;
  time?: Date;
  className?: string;
  style?: React.CSSProperties;
  unstyled?: boolean;
  data?: {
    users?: GlobalStore["users"];
    channels?: GlobalStore["channels"];
    user_groups?: GlobalStore["user_groups"];
  };
  hooks?: GlobalStore["hooks"];
  /**
   * If true, the header and the container which wraps the message will be removed and only the slack blocks will be returned.
   */
  withoutWrapper?: boolean;
};

export type MessageProps = Props;

export const Message = (props: Props) => {
  const {
    blocks,
    logo,
    name,
    time = new Date(),
    className = "",
    style,
    showBlockKitDebug = false,
    unstyled = false,
    data,
    hooks,
    withoutWrapper = false,
  } = props;

  if (withoutWrapper) {
    return (
      <GlobalProvider data={data} hooks={hooks}>
        <div
          id="slack_blocks_to_jsx"
          className={merge_classes([
            "slack_blocks_to_jsx relative flex gap-2 w-full max-w-[600px]",
            unstyled ? "styles_disabled" : "styles_enabled",
            className,
          ])}
          style={style}
        >
          <div className="flex flex-col w-full">
            <div className="slack_blocks_to_jsx--blocks">
              {blocks.map((block, i) => {
                const element = getBlockComponent(block);
                if (!element) return null;

                return <BlockWrapper key={i}>{element}</BlockWrapper>;
              })}
            </div>
          </div>
        </div>
      </GlobalProvider>
    );
  }

  return (
    <GlobalProvider data={data} hooks={hooks}>
      <div id="slack_blocks_to_jsx">
        <section
          className={merge_classes([
            "slack_blocks_to_jsx relative flex gap-2 w-full max-w-[600px]",
            unstyled ? "styles_disabled" : "styles_enabled",
            className,
          ])}
          style={style}
        >
          {showBlockKitDebug && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://app.slack.com/block-kit-builder#${encodeURIComponent(
                JSON.stringify({ blocks }),
              )}`}
              className="text-xs absolute right-0 top-0 text-blue-500 underline"
            >
              Open in Slack Block Kit Builder
            </a>
          )}

          <div className="shrink-0">
            <img src={logo} className="w-9 h-9" alt={name} />
          </div>

          <div className="flex flex-col w-full">
            <Header name={name} time={time} />

            <div className="slack_blocks_to_jsx--blocks">
              {blocks.map((block, i) => {
                const element = getBlockComponent(block);
                if (!element) return null;

                return <BlockWrapper key={i}>{element}</BlockWrapper>;
              })}
            </div>
          </div>
        </section>
      </div>
    </GlobalProvider>
  );
};
