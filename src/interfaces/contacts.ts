export interface IContact {
  id: number;
  company: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
  status_message: string;
  cnpj?: string;
  total?: string;
  cpf?: string;
}

export interface IContactResponse {
  success: boolean;
  messages: IContact[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  assunto_enum?: string[];
}
export interface IFilters {
  page?: number;
  per_page?: number;
  data_to?: string;
  data_from?: string;
  status?: string;
  name?: string;
  email?: string;
  cnpj?: string;
  cpf?: string;
  subject?: string;
  sort?: string;
  order?: string;
}
