import { IUser, IUserResponse } from "@/interfaces/users";
import { UsersService } from "@/services/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useUsersController() {
  const usersService = new UsersService();
  const queryClient = useQueryClient();
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());
  const { data: usersQuery, isFetching } = useQuery<IUserResponse>({
    refetchOnWindowFocus: false,
    queryKey: [
      "users",
      filters.nome || "",
      filters.email || "",
      filters.nivel_acesso || "",
    ],
    queryFn: async (): Promise<IUserResponse> => {
      const response = await usersService.getAllUsers({
        nome: filters.nome || "",
        email: filters.email || "",
        nivel_acesso: filters.nivel_acesso || "",
      });
      return response;
    },
  });

  const { mutate: createUser } = useMutation({
    mutationFn: async (data: IUser) => usersService.createUser(data),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["users"] }),
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error("Houve um erro ao criar o usuário. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: removeUser } = useMutation({
    mutationFn: async (id: number) => usersService.removeUser(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["users"] }),
    onSuccess: () => {
      toast.success("Usuário removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error("Houve um erro ao remover o usuário. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: updateUser } = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: any }) =>
      usersService.updateUser(id, values),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["users"] }),
    onSuccess: () => {
      toast.success("Usuário alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o usuário. Tente novamente");
      console.error(error.message);
    },
  });

  return {
    usersQuery,
    isLoading: isFetching,
    isModalOpen,
    showModal,
    closeModal,
    createUser,
    removeUser,
    updateUser,
  };
}
