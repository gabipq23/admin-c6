import { apiPurchase } from "@/configs/api";
import { IPartner, IPartnerResponse } from "@/interfaces/partners";

export class PartnersService {
  async getAllPartners({
    nome,
    cnpj,
    razao_social,
  }: {
    nome?: string;
    cnpj?: string;
    razao_social?: string;
  }): Promise<IPartnerResponse> {
    const res = await apiPurchase.get(`/representantes`, {
      params: { nome, cnpj, razao_social },
    });
    return res.data;
  }

  async createPartner(data: IPartner): Promise<IPartner> {
    const res = await apiPurchase.post(`/representantes`, data);
    return res.data;
  }

  async removePartner(id: number) {
    await apiPurchase.delete(`/representantes/${id}`);
  }

  async updatePartner(id: number, data: any): Promise<any> {
    const res = await apiPurchase.put(`/representantes/${id}`, data);
    return res.data;
  }
}
