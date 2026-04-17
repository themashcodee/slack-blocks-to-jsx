import { CardBlock, CardImage } from "../../types";
import { ButtonElement } from "../elements/button_element";
import { TextObject } from "../composition_objects";

type CardProps = {
  data: CardBlock;
  /**
   * When true, renders in "carousel slide" mode: fixed width, flex-shrink 0, smaller type,
   * and no outer vertical margin (the carousel owns layout).
   */
  inCarousel?: boolean;
};

const resolveImageUrl = (img?: CardImage): string | undefined => {
  if (!img) return undefined;
  return img.image_url || img.slack_file?.url;
};

export const Card = (props: CardProps) => {
  const { title, subtitle, body, hero_image, icon, actions, block_id } = props.data;
  const inCarousel = props.inCarousel ?? false;

  const heroUrl = resolveImageUrl(hero_image);
  const iconUrl = resolveImageUrl(icon);
  const boundedActions = actions ? actions.slice(0, 5) : undefined;

  return (
    <div
      id={block_id}
      className={[
        "slack_blocks_to_jsx__card",
        "flex flex-col rounded-lg border border-black-primary/[0.13] dark:border-dark-border bg-white-primary dark:bg-dark-bg-secondary overflow-hidden",
        inCarousel
          ? "slack_blocks_to_jsx__card--in_carousel shrink-0 w-[260px] snap-start"
          : "my-2 max-w-[420px]",
      ].join(" ")}
    >
      {heroUrl && (
        <div className="slack_blocks_to_jsx__card_hero w-full aspect-[16/9] bg-gray-secondary dark:bg-dark-bg-primary overflow-hidden">
          <img
            src={heroUrl}
            alt={hero_image?.alt_text || ""}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-3 flex flex-col gap-1 slack_blocks_to_jsx__card_body_wrap">
        {(title || iconUrl) && (
          <div className="flex items-start gap-2 slack_blocks_to_jsx__card_header">
            {iconUrl && (
              <img
                src={iconUrl}
                alt={icon?.alt_text || ""}
                className="w-5 h-5 rounded shrink-0 mt-[1px] slack_blocks_to_jsx__card_icon"
              />
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <div className="text-base font-semibold text-black-primary dark:text-dark-text-primary slack_blocks_to_jsx__card_title">
                  <TextObject data={title} />
                </div>
              )}
              {subtitle && (
                <div className="text-small text-black-secondary dark:text-dark-text-secondary slack_blocks_to_jsx__card_subtitle">
                  <TextObject data={subtitle} />
                </div>
              )}
            </div>
          </div>
        )}

        {body && (
          <div className="text-base text-black-primary dark:text-dark-text-primary slack_blocks_to_jsx__card_body mt-1">
            <TextObject data={body} />
          </div>
        )}

        {boundedActions && boundedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 slack_blocks_to_jsx__card_actions">
            {boundedActions.map((btn, i) => (
              <ButtonElement key={btn.action_id || i} data={btn} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
