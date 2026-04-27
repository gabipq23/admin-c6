import { apiPurchase } from "@/configs/api";
import { IContactResponse } from "src/interfaces/contacts";

// Infos vem do link de fale conosco da LP
export class ContactService {
  async allContacts({
    data_to,
    data_from,
    page,
    per_page,
    name,
    email,
    cnpj,
    cpf,
    subject,
    sort,
    order,
    status,
  }: {
    page?: number | string;
    data_to?: string;
    data_from?: string;
    per_page?: number | string;
    name?: string;
    email?: string;
    cnpj?: string;
    cpf?: string;
    subject?: string;
    sort?: string;
    order?: string;
    status?: string;
  }): Promise<IContactResponse> {
    const res = await apiPurchase.get(`/finances/c6/messages`, {
      params: {
        page,
        data_to,
        data_from,
        per_page,
        name,
        email,
        cnpj,
        cpf,
        subject,
        sort,
        order,
        status,
      },
    });
    return res.data;
  }

  async changeContactStatus({
    id,
    status,
  }: {
    id: number;
    status: "LIDA" | "RESPONDIDA";
  }) {
    return apiPurchase.patch(`/finances/c6/messages/${id}/status`, {
      status: status,
    });
  }

  async removeContact(id: number) {
    await apiPurchase.delete(`/finances/c6/messages/${id}`);
  }
}
