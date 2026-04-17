import { CarouselBlock } from "../../types";
import { Card } from "./card";

type CarouselProps = {
  data: CarouselBlock;
};

export const Carousel = (props: CarouselProps) => {
  const { elements, block_id } = props.data;
  const cards = elements.slice(0, 10);

  if (cards.length === 0) return null;

  return (
    <div
      id={block_id}
      className="my-2 slack_blocks_to_jsx__carousel"
      role="region"
      aria-label="Carousel"
    >
      <div
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 slack_blocks_to_jsx__carousel_track"
        style={{ scrollbarWidth: "thin" }}
      >
        {cards.map((card, i) => (
          <Card key={card.block_id || i} data={card} inCarousel />
        ))}
      </div>
    </div>
  );
};
