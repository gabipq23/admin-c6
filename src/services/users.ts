import { apiPurchase } from "@/configs/api";
import { IUser, IUserProfileResponse, IUserResponse } from "@/interfaces/users";

export class UsersService {
  async getAllUsers({
    nome,
    email,
    nivel_acesso,
  }: {
    nome?: string;
    email?: string;
    nivel_acesso?: string;
  }): Promise<IUserResponse> {
    const res = await apiPurchase.get(`/usuarios`, {
      params: {
        nome,
        email,
        nivel_acesso,
      },
    });
    return res.data;
  }

  async getUserById(id: number): Promise<IUserProfileResponse> {
    const res = await apiPurchase.get(`/usuarios/${id}`);
    return res.data;
  }

  async createUser(data: IUser): Promise<IUser> {
    const res = await apiPurchase.post(`/usuarios`, data);
    return res.data;
  }

  async removeUser(id: number) {
    await apiPurchase.delete(`/usuarios/${id}`);
  }

  async updateUser(id: number, data: any): Promise<any> {
    const res = await apiPurchase.put(`/usuarios/${id}`, data);
    return res.data;
  }
}
