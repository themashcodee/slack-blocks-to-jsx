import { create } from "zustand";

type User = {
  id: string;
  name: string;
};

type Channel = {
  id: string;
  name: string;
};

type Hooks = {
  user?: (data: User) => string;
  channel?: (data: Channel) => string;
  atChannel?: (data: { name: string }) => string;
  usergroup?: (data: Channel) => string;
  atEveryone?: (data: { name: string }) => string;
  atHere?: (data: { name: string }) => string;
  date?: (data: {
    timestamp: string;
    format: string;
    link?: string | undefined;
    fallback: string;
  }) => string;
};

type Data = {
  users: User[];
  channels: Channel[];
  hooks: Hooks;
  setUsers: (users: User[]) => void;
  setChannels: (channels: Channel[]) => void;
  setHooks: (hooks: Hooks) => void;
};

export type GlobalStore = Data;

const useBearStore = create<Data>((set) => ({
  users: [],
  channels: [],
  hooks: {},
  setUsers: (users) => set({ users }),
  setChannels: (channels) => set({ channels }),
  setHooks: (hooks) => set({ hooks }),
}));

export const useGlobalData = () => {
  const { users, channels, hooks, setChannels, setUsers, setHooks } = useBearStore();

  return {
    users,
    channels,
    hooks,
    setChannels,
    setUsers,
    setHooks,
  };
};
