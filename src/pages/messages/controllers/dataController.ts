import { ContactService } from "@/services/contact";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { IContactResponse } from "src/interfaces/contacts";

export function useContactsController() {
  const contactService = new ContactService();
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());
  const queryClient = useQueryClient();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [removeContactIds, setRemoveContactIds] = useState([] as number[]);

  const { data: contactsQuery, isFetching: isContactFetching } =
    useQuery<IContactResponse>({
      refetchOnWindowFocus: false,
      queryKey: [
        "messages",
        filters.page,
        filters.data_to,
        filters.data_from,
        filters.per_page,
        filters.name,
        filters.email,
        filters.cnpj,
        filters.cpf,
        filters.subject,
        filters.sort,
        filters.order,
        filters.status,
      ],
      queryFn: async (): Promise<IContactResponse> => {
        const response = await contactService.allContacts({
          page: filters.page,
          data_to: filters.data_to,
          data_from: filters.data_from,
          per_page: filters.per_page,
          name: filters.name,
          email: filters.email,
          cnpj: filters.cnpj,
          cpf: filters.cpf,
          subject: filters.subject,
          sort: filters.sort,
          order: filters.order,
          status: filters.status,
        });
        return response;
      },
    });

  const { mutate: changeContactStatus } = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "LIDA" | "RESPONDIDA";
    }) => {
      const response = await contactService.changeContactStatus({
        id,
        status,
      });
      return response;
    },
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["messages"] }),
    onSuccess: () => {
      toast.success("Status alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o status. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: removeContact } = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      contactService.removeContact(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["messages"] }),
    onError: (error) => {
      toast.error("Houve um erro ao remover a mensagem. Tente novamente");
      console.error(error.message);
    },
    onSuccess: () => {
      toast.success("Mensagem removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const removeContacts = () => {
    for (const id of removeContactIds) {
      removeContact({ id });
    }
  };

  const contacts =
    contactsQuery?.messages?.filter(
      (contact) => contact.company === "C6BANK",
    ) || [];

  return {
    changeContactStatus,
    contactsQuery,
    contacts,
    totalContacts: contactsQuery?.pagination?.total || 0,
    isModalOpen,
    showModal,
    closeModal,
    isLoading: isContactFetching,
    setRemoveContactIds,
    removeContacts,
  };
}
