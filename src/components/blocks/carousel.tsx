import { useCallback, useEffect, useRef, useState } from "react";
import { CarouselBlock } from "../../types";
import { Card } from "./card";

type CarouselProps = {
  data: CarouselBlock;
};

export const Carousel = (props: CarouselProps) => {
  const { elements, block_id } = props.data;
  const cards = elements.slice(0, 10);

  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const tolerance = 8;
    setCanScrollLeft(scrollLeft > tolerance);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - tolerance);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateScrollButtons) : null;
    resizeObserver?.observe(el);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, cards.length]);

  const scrollBy = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.8 * (direction === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (cards.length === 0) return null;

  return (
    <div
      id={block_id}
      className="my-2 relative slack_blocks_to_jsx__carousel"
      role="region"
      aria-label="Carousel"
    >
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 slack_blocks_to_jsx__carousel_track"
        style={{ scrollbarWidth: "thin" }}
      >
        {cards.map((card, i) => (
          <Card key={card.block_id || i} data={card} inCarousel />
        ))}
      </div>

      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white-primary dark:bg-dark-bg-secondary text-black-primary dark:text-dark-text-primary border border-black-primary/[0.13] dark:border-dark-border shadow-md hover:bg-gray-secondary dark:hover:bg-dark-bg-primary slack_blocks_to_jsx__carousel_arrow slack_blocks_to_jsx__carousel_arrow--left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="w-5 h-5"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M12.03 5.72a.75.75 0 0 1 0 1.06L8.81 10l3.22 3.22a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white-primary dark:bg-dark-bg-secondary text-black-primary dark:text-dark-text-primary border border-black-primary/[0.13] dark:border-dark-border shadow-md hover:bg-gray-secondary dark:hover:bg-dark-bg-primary slack_blocks_to_jsx__carousel_arrow slack_blocks_to_jsx__carousel_arrow--right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="w-5 h-5"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M7.72 5.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 0 1-1.06-1.06L10.94 10 7.72 6.78a.75.75 0 0 1 0-1.06"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
