import { render, RenderResult } from "@testing-library/react";
import { ReactNode } from "react";
import { GlobalProvider, GlobalStore } from "../../../store";
import { TextObject } from "../../../components/composition_objects/text_object";

type Data = {
  users?: GlobalStore["users"];
  channels?: GlobalStore["channels"];
  user_groups?: GlobalStore["user_groups"];
};

type Options = {
  data?: Data;
  hooks?: GlobalStore["hooks"];
};

export const renderMrkdwn = (
  text: string,
  verbatim: boolean,
  options: Options = {},
): RenderResult => {
  return render(
    <GlobalProvider data={options.data} hooks={options.hooks}>
      <TextObject data={{ type: "mrkdwn", text, verbatim }} />
    </GlobalProvider>,
  );
};

export const renderWithProvider = (children: ReactNode, options: Options = {}): RenderResult => {
  return render(
    <GlobalProvider data={options.data} hooks={options.hooks}>
      {children}
    </GlobalProvider>,
  );
};
