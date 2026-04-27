import { IUserProfileResponse } from "@/interfaces/users";
import { UsersService } from "@/services/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export function useUserProfileController() {
  const usersService = new UsersService();
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("tim@user") || "null");
  const userID = user?.id;

  const { data: userProfileQuery, isFetching } = useQuery<IUserProfileResponse>(
    {
      refetchOnWindowFocus: false,
      queryKey: ["userProfile", userID],
      queryFn: async (): Promise<IUserProfileResponse> => {
        const response = await usersService.getUserById(userID);
        return response;
      },
    },
  );

  const { mutate: updateUserProfile } = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: any }) =>
      usersService.updateUser(id, values),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["userProfile"] }),
    onSuccess: () => {
      toast.success("Usuário alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o usuário. Tente novamente");
      console.error(error.message);
    },
  });

  return {
    userProfileQuery,
    isLoading: isFetching,
    updateUserProfile,
  };
}
