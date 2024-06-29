import { ReactNode } from "react";
import { create } from "zustand";

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
  emoji?: (emoji_text: string) => string;
  date?: (data: {
    timestamp: string;
    format: string;
    link?: string | undefined;
    fallback: string;
  }) => ReactNode;
};

type Data = {
  users: User[];
  channels: Channel[];
  user_groups: UserGroup[];
  hooks: Hooks;
  setUsers: (users: User[]) => void;
  setChannels: (channels: Channel[]) => void;
  setUserGroups: (channels: UserGroup[]) => void;
  setHooks: (hooks: Hooks) => void;
};

export type GlobalStore = Data;

const useBearStore = create<Data>((set) => ({
  users: [],
  channels: [],
  user_groups: [],
  hooks: {},
  setUsers: (users) => set({ users }),
  setChannels: (channels) => set({ channels }),
  setUserGroups: (user_groups) => set({ user_groups }),
  setHooks: (hooks) => set({ hooks }),
}));

export const useGlobalData = () => {
  const { users, channels, user_groups, hooks, setChannels, setUsers, setHooks, setUserGroups } =
    useBearStore();

  return {
    users,
    channels,
    user_groups,
    hooks,
    setChannels,
    setUsers,
    setHooks,
    setUserGroups,
  };
};
