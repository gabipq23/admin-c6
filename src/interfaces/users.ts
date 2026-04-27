export interface IUser {
  id: number;
  nome: string;
  email: string;
  senha: string;
  nivel_acesso: string;
  cpf: string;
  whatsapp: string;
  aceita_notificacao_browser: boolean;
  aceita_notificacao_email: boolean;
  created_at: string;
  updated_at: string;
}

export interface IUserResponse {
  sucesso: boolean;
  dados: IUser[];
  paginacao: {
    total: number;
    limite: number;
    pagina: number;
    totalPaginas: number;
  };
}

export interface IUserProfileResponse {
  sucesso: boolean;
  dados: IUser;
}
