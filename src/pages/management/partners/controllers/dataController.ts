import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PartnersService } from "@/services/partners";
import { IPartner, IPartnerResponse } from "@/interfaces/partners";

export function usePartnersController() {
  const partnersService = new PartnersService();
  const queryClient = useQueryClient();
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());
  const { data: partnersQuery, isFetching } = useQuery<IPartnerResponse>({
    refetchOnWindowFocus: false,
    queryKey: ["partners", filters.cnpj || "", filters.razao_social || ""],
    queryFn: async (): Promise<IPartnerResponse> => {
      const response = await partnersService.getAllPartners({
        cnpj: filters.cnpj,
        razao_social: filters.razao_social,
      });
      return response;
    },
  });

  const { mutate: createPartner } = useMutation({
    mutationFn: async (data: IPartner) => partnersService.createPartner(data),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["partners"] }),
    onSuccess: () => {
      toast.success("Parceiro criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error: any) => {
      toast.error("Houve um erro ao criar o parceiro. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: removePartner } = useMutation({
    mutationFn: async (id: number) => partnersService.removePartner(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["partners"] }),
    onSuccess: () => {
      toast.success("Parceiro removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error: any) => {
      toast.error("Houve um erro ao remover o parceiro. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: updatePartner } = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: any }) =>
      partnersService.updatePartner(id, values),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["partners"] }),
    onSuccess: () => {
      toast.success("Parceiro alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o parceiro. Tente novamente");
      console.error(error.message);
    },
  });

  return {
    partnersQuery,
    createPartner,
    removePartner,
    updatePartner,
    isLoading: isFetching,
    isModalOpen,
    showModal,
    closeModal,
  };
}
