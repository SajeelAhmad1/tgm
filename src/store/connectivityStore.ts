import {create} from 'zustand';

type ConnectivityState = {
  isOnline: boolean;
  setOnline: (value: boolean) => void;
};

export const useConnectivityStore = create<ConnectivityState>(set => ({
  isOnline: true,
  setOnline: value => set({isOnline: value}),
}));
