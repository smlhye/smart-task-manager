import { create } from "zustand";
import { UserResponseType } from "../../users/schemas/user.schema";

export type userStore = {
    user: UserResponseType | null;
    setUser: (user: UserResponseType | null) => void;
}

export const useUserStore = create<userStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}))