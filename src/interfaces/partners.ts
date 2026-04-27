export interface IPartner {
  id: number;
  cnpj: string;
  razao_social: string;
  nome: string;
  email: string;
  telefone: string;
  updated_at: string;
  created_at: string;
}

export interface IPartnerResponse {
  sucesso: boolean;
  dados: IPartner[];
  paginacao: {
    total: number;
    limite: number;
    pagina: number;
    totalPaginas: number;
  };
}
