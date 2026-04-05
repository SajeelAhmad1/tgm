import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {LoginSuccessData} from '../api/auth/types';

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

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setAuthFromLogin: (data: LoginSuccessData) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuthFromLogin: data =>
        set({
          accessToken: data.token,
          refreshToken: data.refreshToken,
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
          },
        }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
    }),
    {
      name: 'glassmarket-auth-v2',
      storage: createJSONStorage(() => safeAsyncStorage),
      partialize: s => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
      }),
    },
  ),
);

export const selectIsLoggedIn = (s: AuthState) => Boolean(s.accessToken);
export const selectAuthUser = (s: AuthState) => s.user;
