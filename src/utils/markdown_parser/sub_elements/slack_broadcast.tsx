import { useGlobalData } from "../../../store";
import { SlackBroadcastSubElement } from "../types";

type Props = {
  element: SlackBroadcastSubElement;
};

export const SlackBroadcast = (props: Props) => {
  const { element } = props;
  const { hooks } = useGlobalData();

  if (element.value === "here" && hooks.atHere) return <>{hooks.atHere()}</>;
  if (element.value === "everyone" && hooks.atEveryone) return <>{hooks.atEveryone()}</>;
  if (element.value === "channel" && hooks.atChannel) return <>{hooks.atChannel()}</>;

  return <span className="slack_broadcast text-broadcast-text dark:text-dark-broadcast-text bg-broadcast-bg dark:bg-dark-broadcast-bg font-semibold">@{element.value}</span>;
};
