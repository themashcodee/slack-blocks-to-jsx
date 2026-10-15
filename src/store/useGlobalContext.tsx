import React, { ReactNode, createContext, useContext, useState } from "react";
import {
  RichTextSectionUser,
  RichTextSectionChannel,
  RichTextSectionBroadcast,
  RichTextSectionUsergroup,
} from "../types";
// Imported directly rather than through the utils barrel: the barrel pulls in the markdown parser,
// which imports this store, and that would be an import cycle.
import { UrlKind, UrlTransform, safeUrl } from "../utils/safe_url";

type User = {
  id: string;
  name: string;
};

type UserWithStyle = User & { style?: RichTextSectionUser["style"] };

type Channel = {
  id: string;
  name: string;
};

type ChannelWithStyle = Channel & { style?: RichTextSectionChannel["style"] };

type UserGroup = {
  id: string;
  name: string;
};

type UserGroupWithStyle = UserGroup & { style?: RichTextSectionUsergroup["style"] };

type Emoji = {
  name: string;
  /* hyphen-delineated list of Unicode code points */
  unicode?: string;
  /* included only for single-color skintone emojis (not compound emojis) */
  skin_tone?: 1 | 2 | 3 | 4 | 5 | 6;
};

type LinkInput = {
  href: string;
  children: ReactNode;
  className: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
};

type Hooks = {
  user?: (data: UserWithStyle) => ReactNode;
  channel?: (data: ChannelWithStyle) => ReactNode;
  usergroup?: (data: UserGroupWithStyle) => ReactNode;
  atChannel?: (style?: RichTextSectionBroadcast["style"]) => ReactNode;
  atEveryone?: (style?: RichTextSectionBroadcast["style"]) => ReactNode;
  atHere?: (style?: RichTextSectionBroadcast["style"]) => ReactNode;
  /**
   * The hook to replace emojis with custom components
   * @param data - the emoji object
   * @param parse - fallback function for default emoji parsing
   * @returns the custom emoji component
   */
  emoji?: (data: Emoji, parse: (data: Emoji) => string) => ReactNode;
  date?: (data: {
    timestamp: string;
    format: string;
    link: string | null;
    fallback: string;
  }) => ReactNode;
  /**
   *
   * This hook allows you to replace the anchor (a) tag with your own wrapper. It gets applied to rich_text_section links, links in mrkdown, slack date optional links, and video block title URLs.
   *
   * It is not called for a URL that `urlTransform` rejects — that link renders as an inert `<a>`
   * with no `href` instead, so a hook never receives a `javascript:`-style URL.
   */
  link?: (input: LinkInput) => ReactNode;
};

export type GlobalStore = {
  users: User[];
  channels: Channel[];
  user_groups: UserGroup[];
  hooks: Hooks;
  /**
   * Every `href` / `src` sink passes its URL through this before rendering. It is the consumer's
   * `urlTransform` (or `safeUrl` by default) wrapped to tolerate the missing/empty URLs that
   * optional block fields produce, so components can call it unconditionally.
   */
  urlTransform: (url: string | null | undefined, kind: UrlKind) => string | undefined;
  setUsers: (users: User[]) => void;
  setChannels: (channels: Channel[]) => void;
  setUserGroups: (userGroups: UserGroup[]) => void;
  setHooks: (hooks: Hooks) => void;
};

const GlobalContext = createContext<GlobalStore | undefined>(undefined);

type GlobalProviderProps = {
  data?:
    | {
        users?: GlobalStore["users"];
        channels?: GlobalStore["channels"];
        user_groups?: GlobalStore["user_groups"];
      }
    | undefined;
  hooks?: GlobalStore["hooks"] | undefined;
  urlTransform?: UrlTransform | undefined;
  children: ReactNode;
};

export const GlobalProvider: React.FC<GlobalProviderProps> = ({
  data,
  hooks: defaultHooks,
  urlTransform: customUrlTransform,
  children,
}) => {
  const [users, setUsers] = useState<User[]>(data?.users || []);
  const [channels, setChannels] = useState<Channel[]>(data?.channels || []);
  const [user_groups, setUserGroups] = useState<UserGroup[]>(data?.user_groups || []);
  const [hooks, setHooks] = useState<Hooks>(defaultHooks || {});

  const transform = customUrlTransform ?? safeUrl;
  const urlTransform: GlobalStore["urlTransform"] = (url, kind) =>
    url ? transform(url, kind) : undefined;

  const value: GlobalStore = {
    users,
    channels,
    user_groups,
    hooks,
    urlTransform,
    setUsers,
    setChannels,
    setUserGroups,
    setHooks,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobalData = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
