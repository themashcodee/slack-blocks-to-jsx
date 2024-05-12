import { create } from "zustand";

type User = {
  id: string;
  name: string;
};

type Channel = {
  id: string;
  name: string;
};

type Data = {
  users: User[];
  channels: Channel[];
  setUsers: (users: User[]) => void;
  setChannels: (channels: Channel[]) => void;
};

const useBearStore = create<Data>((set) => ({
  users: [],
  channels: [],
  setUsers: (users) => set({ users }),
  setChannels: (channels) => set({ channels }),
}));

export const useGlobalData = () => {
  const { users, channels, setChannels, setUsers } = useBearStore();

  return {
    users,
    channels,
    setChannels,
    setUsers,
  };
};
