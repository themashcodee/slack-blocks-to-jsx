import React, { ReactNode, createContext, useContext, useState } from "react";
import {
  RichTextSectionUser,
  RichTextSectionChannel,
  RichTextSectionBroadcast,
  RichTextSectionUsergroup,
} from "../types";

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
};

export type GlobalStore = {
  users: User[];
  channels: Channel[];
  user_groups: UserGroup[];
  hooks: Hooks;
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
  children: ReactNode;
};

export const GlobalProvider: React.FC<GlobalProviderProps> = ({
  data,
  hooks: defaultHooks,
  children,
}) => {
  const [users, setUsers] = useState<User[]>(data?.users || []);
  const [channels, setChannels] = useState<Channel[]>(data?.channels || []);
  const [user_groups, setUserGroups] = useState<UserGroup[]>(data?.user_groups || []);
  const [hooks, setHooks] = useState<Hooks>(defaultHooks || {});

  const value: GlobalStore = {
    users,
    channels,
    user_groups,
    hooks,
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
