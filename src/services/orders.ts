import { apiPurchase } from "@/configs/api";
import { OrderC6BankResponse } from "@/interfaces/orders";

export class OrdersService {
  async allFiltered({
    page,
    per_page,
    data_to,
    data_from,
    status,
    availability,
    cpf,
    cnpj,
    phone,
    after_sales_status,
    order,
    sort,
    order_number,
  }: {
    page?: string | number;
    per_page?: string | number;
    data_to?: string;
    data_from?: string;
    status?: string;
    availability?: string;
    cpf?: string;
    cnpj?: string;
    phone?: string;
    after_sales_status?: string;
    order?: string;
    sort?: string;
    order_number?: string;
  }): Promise<OrderC6BankResponse> {
    const res = await apiPurchase.get(`/finances/c6/orders`, {
      params: {
        page,
        per_page,
        data_to,
        data_from,
        status,
        availability,
        cpf,
        cnpj,
        phone,
        after_sales_status,
        order,
        sort,
        order_number,
      },
    });

    return res.data;
  }

  async updateOrderInfo(id: number, data: any): Promise<any> {
    const response = await apiPurchase.put(`/finances/c6/orders/${id}`, data);
    return response.data;
  }
  async removeOrder(id: number) {
    await apiPurchase.delete(`/finances/c6/orders/${id}`);
  }

  async changeOrderStatus(id: number, data: { status: string }) {
    await apiPurchase.patch(`/finances/c6/orders/${id}/status`, data);
  }
}
