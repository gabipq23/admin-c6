import { apiPurchase } from "../configs/api";
import { ICompanyResponse } from "../interfaces/consult";

export class ClientsService {
  async allCompanyList({
    page,
    per_page,
    sort,
    order,
    cnpj,
    rfb_status,
    company_legal_name,
    is_mei,
    client_type,
    credit_min,
    credit_max,
    cpf,
  }: {
    page?: string | number;
    per_page?: string | number;
    sort?: string;
    order?: "asc" | "desc" | null;
    cnpj?: string;
    rfb_status?: string;
    company_legal_name?: string;
    is_mei?: boolean;
    client_type?: string;
    credit_min?: number;
    credit_max?: number;
    cpf?: string;
  }): Promise<ICompanyResponse> {
    const res = await apiPurchase.get(`/telecom/tim/clients`, {
      params: {
        page: page || 1,
        per_page: per_page || 100,
        sort: sort || "nm_cliente",
        order: order || "desc",
        cnpj: cnpj || "",
        rfb_status: rfb_status || "",
        company_legal_name: company_legal_name || "",
        is_mei: is_mei || false,
        client_type: client_type || "",
        credit_min: credit_min || 0,
        credit_max: credit_max || 1000000,
        cpf: cpf || "",
      },
    });
    return res.data;
  }

  async removeClient(clientId: number): Promise<void> {
    await apiPurchase.delete(`/telecom/tim/clients/${clientId}`);
  }
}
