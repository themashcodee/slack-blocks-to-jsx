import { Block } from "./types";
import { Header } from "./header";
import { getBlockComponent } from "./components";
import { BlockWrapper } from "./block_wrapper";

type Props = {
  theme?: "light" | "dark";
  blocks: Block[];
  logo: string;
  name: string;
  time?: Date;
  className?: string;
  style?: React.CSSProperties;
};

export const Message = (props: Props) => {
  const { theme = "light", blocks, logo, name, time = new Date(), className = "", style } = props;

  return (
    <section className={`flex gap-2 w-full max-w-[600px] slack-message ${className}`} style={style}>
      <div className="shrink-0">
        <img src={logo} className="w-9 h-9" alt={name} />
      </div>

      <div className="flex flex-col w-full">
        <Header name={name} time={time} />

        {blocks.map((block, i) => {
          const element = getBlockComponent(block);
          if (!element) return null;

          return <BlockWrapper key={i}>{element}</BlockWrapper>;
        })}
      </div>
    </section>
  );
};
