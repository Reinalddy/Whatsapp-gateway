import { create } from 'zustand';

type User = {
    userId: string;
    name: string;
    email: string;
    role: string;
    token: string
};

type UserState = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));
