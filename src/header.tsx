import { dateToTime } from "./utils";

type Props = {
  name: string;
  time: Date;
};

export const Header = (props: Props) => {
  const { name, time } = props;

  return (
    <div className="flex gap-[5px] items-center w-full slack_blocks_to_jsx--header">
      <h3 className="font-black text-[15px]">{name}</h3>
      <div className="h-[14px] w-[27px] leading-[12.5px] py-[1px] px-[3px] uppercase text-[10px]  text-black-primary/[0.7] bg-black-primary/[0.13] font-semibold rounded-[2px] text-center">
        APP
      </div>
      <div className="text-xs text-black-secondary uppercase leading-[17.6px]">
        {dateToTime(time)}
      </div>
    </div>
  );
};
