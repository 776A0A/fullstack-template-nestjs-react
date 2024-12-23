import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

// TODO: 优化代码，userStore有点散落了
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        setUser: (user): void => set({ user }),
        setToken: (token): void => set({ token }),
        clearUser: (): void => set({ user: null, token: null }),
        isAuthenticated: (): boolean => !!get().token,
      }),
      {
        name: 'user-storage',
      },
    ),
  ),
);
