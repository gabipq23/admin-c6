import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./context";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { outlineButtonClass } from "@/utils/buttonStyles";
interface ILoginForm {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { control, handleSubmit } = useForm<ILoginForm>();

  const mutation = useMutation<void, Error, ILoginForm>({
    mutationFn: (data: ILoginForm) => login(data),
    onSuccess: () => {
      navigate("/admin/leads");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.erro ||
        "Erro ao realizar login";

      toast.error(`${errorMessage}`);

      console.error("Erro ao consultar produtos:", error);
    },
  });

  function onSubmit(data: ILoginForm) {
    mutation.mutate(data);
  }

  return (
    <div className=" flex flex-col items-center bg-neutral-100 justify-center h-screen ">
      <div className="flex flex-col md:w-[400px] lg:w-[400px] bg-[#c5c5c5] justify-start gap-10 shadow-lg  rounded-lg p-6 h-[400px]">
        <div className="flex justify-center items-center  mb-4">

          <img
            src="\assets\c6-logo.png"
            className="h-8 hover:cursor-pointer"
          ></img>
        </div>

        <div className="flex flex-col gap-2">
          <form
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
            className="flex flex-col gap-5"
          >
            <p className="text-[14px] text-neutral-500">Email: </p>

            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input {...field} placeholder="Digite seu email" />
              )}
            />
            <p className="text-[14px] text-neutral-500">Senha: </p>

            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input.Password {...field} placeholder="Digite sua senha" />
              )}
            />
            <div className="flex justify-center mt-4">
              <Button className={outlineButtonClass} htmlType="submit">
                Entrar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
