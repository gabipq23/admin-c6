
import { OrderC6BankResponse } from "@/interfaces/orders";
import { OrdersService } from "@/services/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useAllOrdersController(setSelectedBLOrder?: (order: any) => void) {
  const ordersService = new OrdersService();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data: orders, isLoading } =
    useQuery<OrderC6BankResponse>({
      refetchOnWindowFocus: false,
      queryKey: [
        "orders",
        filters.page,
        filters.per_page,
        filters.data_to,
        filters.data_from,
        filters.status,
        filters.availability,
        filters.cpf,
        filters.cnpj,
        filters.phone,
        filters.after_sales_status,
        filters.order,
        filters.sort,
        filters.order_number
      ],
      queryFn: async (): Promise<OrderC6BankResponse> => {
        const response = await ordersService.allFiltered({
          page: filters.page,
          per_page: filters.per_page,
          data_to: filters.data_to,
          data_from: filters.data_from,
          status: filters.status,
          availability: filters.availability,
          cpf: filters.cpf,
          cnpj: filters.cnpj,
          phone: filters.phone,
          after_sales_status: filters.after_sales_status,
          order: filters.order,
          sort: filters.sort,
          order_number: filters.order_number,
        });

        return response;
      },
    });

  const { mutate: updateOrder, isPending: isUpdateOrderFetching } =
    useMutation({
      mutationFn: async ({ id, data }: { id: number; data: any }) =>
        ordersService.updateOrderInfo(id, data),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["orders"] }),
      onSuccess: (variables) => {
        toast.success("Pedido alterado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["orders"] });

        if (setSelectedBLOrder && variables?.data) {
          setSelectedBLOrder((prev: any) =>
            prev && prev.id === variables.id ? { ...prev, ...variables.data } : prev
          );
        }
      },
      onError: (error) => {
        toast.error("Houve um erro ao alterar o pedido. Tente novamente");
        console.error(error.message);
      },
    });

  const {
    mutate: removeOrder,
    isPending: isRemoveOrderFetching,
  } = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      ordersService.removeOrder(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["orders"] }),
    onError: (error) => {
      toast.error("Houve um erro ao remover o pedido. Tente novamente");
      console.error(error.message);
    },
    onSuccess: () => {
      toast.success("Pedido removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const { mutate: changeOrderStatus } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { status: string };
    }) => ordersService.changeOrderStatus(id, data),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["orders"] }),
    onSuccess: () => {
      toast.success("Status do pedido alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o status do pedido.");
      console.error(error.message);
    },
  });

  const updateDataIdCRMAndConsultorResponsavel = (
    id: string | undefined,
    values: any,
  ) => {
    if (!id) {
      toast.error("ID do pedido inválido.");
      return;
    }

    const dadosGerais = {
      responsible_consultant: values.responsible_consultant,
      corporate_id: values.corporate_id,
      crm_id: values.crm_id,
      credit: values.credit,

    };

    updateOrder({
      id: Number(id),
      data: dadosGerais,
    });
  };


  return {
    orders,
    showModal,
    closeModal,
    isModalOpen,
    isLoading,
    updateOrder,
    isUpdateOrderFetching,
    removeOrder,
    isRemoveOrderFetching,
    changeOrderStatus,
    updateDataIdCRMAndConsultorResponsavel
  };
}
