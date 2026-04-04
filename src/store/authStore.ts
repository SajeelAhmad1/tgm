import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

const safeAsyncStorage = {
  getItem: (name: string) =>
    AsyncStorage.getItem(name).catch(err => {
      console.warn('[authStore] AsyncStorage.getItem failed:', err);
      return null;
    }),
  setItem: (name: string, value: string) =>
    AsyncStorage.setItem(name, value).catch(err => {
      console.warn('[authStore] AsyncStorage.setItem failed:', err);
    }),
  removeItem: (name: string) =>
    AsyncStorage.removeItem(name).catch(err => {
      console.warn('[authStore] AsyncStorage.removeItem failed:', err);
    }),
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  setSession: (payload: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
  }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      email: null,
      setSession: payload =>
        set({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          userId: payload.userId,
          email: payload.email,
        }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          email: null,
        }),
    }),
    {
      name: 'glassmarket-auth',
      storage: createJSONStorage(() => safeAsyncStorage),
      partialize: s => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        userId: s.userId,
        email: s.email,
      }),
    },
  ),
);

export const selectIsLoggedIn = (s: AuthState) => Boolean(s.accessToken);
