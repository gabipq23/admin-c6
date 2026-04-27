import { apiPurchase } from "../configs/api";
import { LocalStorageKeys, LocalStorageService } from "./storage";
import {
  ILoginData,
  IUser,
  ILoginResponse as ILoginResponseInterface,
} from "../interfaces/login";

class AuthService {
  async login({ email, password }: ILoginData): Promise<{ user: IUser }> {
    const response = await apiPurchase.post<ILoginResponseInterface>(
      "/finances/c6/auth/login",
      {
        email,
        password,
      },
    );

    const { success, admin } = response.data;

    if (!success || !admin) {
      throw new Error("Falha na autenticação. Verifique suas credenciais.");
    }

    const localStorageService = new LocalStorageService();
    localStorageService.setItem(LocalStorageKeys.user, JSON.stringify(admin));

    return { user: admin };
  }

  getCachedUser() {
    const raw = localStorage.getItem("c6@user");
    return raw ? JSON.parse(raw) : null;
  }

  async me() {
    const cached = this.getCachedUser();
    if (cached) return { user: cached };
    throw new Error("No session endpoint and no cached user.");
  }

  async logout() {
    await apiPurchase.post("/finances/c6/auth/logout");
    localStorage.removeItem("c6@user");
  }
}

export { AuthService };
