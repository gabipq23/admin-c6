import { AuthService } from "@/services/auth";
import { create } from "zustand";
import { AuthState, ILoginData } from "@/interfaces/login";

const authService = new AuthService();
// const initialAuth = authService.getAuthToken();

export const useAuthContext = create<AuthState>((set) => ({
  // user: initialAuth?.user ?? null,
  // login: async ({ email, password }: ILoginData) => {
  //   const res = await authService.login({ email, password });
  //   set({ user: res?.user ?? null });
  // },
  // logout: () => {
  //   const localStorageService = new LocalStorageService();
  //   localStorageService.removeItem(LocalStorageKeys.accessToken);
  //   localStorageService.removeItem(LocalStorageKeys.user);
  //   set({ user: null });
  // },

  // checkAuth: () => {
  //   const res = authService.getAuthToken();
  //   set({ user: res?.user ?? null });
  // },

  user: authService.getCachedUser(),
  isAuthLoading: true,

  login: async ({ email, password }: ILoginData) => {
    const res = await authService.login({ email, password });
    set({ user: res.user });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  checkAuth: async () => {
    const cachedUser = authService.getCachedUser();

    try {
      const me = await authService.me();
      set({
        user: me?.user ?? cachedUser ?? null,
        isAuthLoading: false,
      });
    } catch {
      set({
        user: cachedUser ?? null,
        isAuthLoading: false,
      });
    }
  },
}));
