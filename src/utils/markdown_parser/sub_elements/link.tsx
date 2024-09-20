import { useGlobalData } from "../../../store";
import { LinkSubElement } from "../types";
import { Delete } from "./delete";
import { Emphasis } from "./emphasis";
import { SlackEmoji } from "./slack_emoji";
import { Strong } from "./strong";
import { Text } from "./text";

type Props = {
  element: LinkSubElement;
};

export const Link = (props: Props) => {
  const { element } = props;
  const { hooks } = useGlobalData();

  if (hooks.link) {
    return (
      <>
        {hooks.link({
          href: element.url,
          children: (
            <>
              {element.children.map((child, i) => {
                if (child.type === "delete") return <Delete key={i} element={child} />;
                if (child.type === "emphasis") return <Emphasis key={i} element={child} />;
                if (child.type === "strong") return <Strong key={i} element={child} />;
                if (child.type === "slack_emoji") return <SlackEmoji key={i} element={child} />;

                return <Text key={i} element={child} />;
              })}
            </>
          ),
          className: "slack_link",
        })}
      </>
    );
  }

  return (
    <a href={element.url} className="slack_link">
      {element.children.map((child, i) => {
        if (child.type === "delete") return <Delete key={i} element={child} />;
        if (child.type === "emphasis") return <Emphasis key={i} element={child} />;
        if (child.type === "strong") return <Strong key={i} element={child} />;
        if (child.type === "slack_emoji") return <SlackEmoji key={i} element={child} />;

        return <Text key={i} element={child} />;
      })}
    </a>
  );
};
