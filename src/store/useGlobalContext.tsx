import React, { createContext, useContext, ReactNode, useState } from "react";

type User = {
  id: string;
  name: string;
};

type Channel = {
  id: string;
  name: string;
};

type UserGroup = {
  id: string;
  name: string;
};

type Hooks = {
  user?: (data: User) => ReactNode;
  channel?: (data: Channel) => ReactNode;
  usergroup?: (data: UserGroup) => ReactNode;
  atChannel?: () => ReactNode;
  atEveryone?: () => ReactNode;
  atHere?: () => ReactNode;
  emoji?: (name: string, parse: (name: string) => string) => ReactNode;
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
