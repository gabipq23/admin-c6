export interface IUser {
  id: number;
  name: string;
  email: string;
  company?: string;
  nome?: string;
  perfil?: string;
}

// export interface AuthState {
//   user: IUser | null;
//   login: (data: ILoginData) => Promise<void>;
//   logout: () => void;
//   checkAuth: () => void;
// }

export interface AuthState {
  user: IUser | null;
  isAuthLoading: boolean;
  login: (data: ILoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  admin: IUser;
}
