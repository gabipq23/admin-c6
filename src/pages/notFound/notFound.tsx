import { useNavigate } from "react-router-dom";
import { Button } from "antd";

import { useAuthContext } from "@/pages/login/context";
import { outlineButtonClass } from "@/utils/buttonStyles";

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const redirectPath = user
    ? "/admin/pedidos"
    : "/admin";

  const buttonLabel = user
    ? "Retornar para o Admin"
    : "Ir para Login";

  return (
    <div className="h-[601px] bg-red-white flex justify-center items-center">
      <div className="flex h-[220px] w-[300px] bg-[#c5c5c5] p-8 flex-col rounded shadow-2xl items-center justify-center  text-[#242424] gap-4">
        <img
          className="h-16 w-16"
          src="/assets/c6-logo.png"
        // style={{
        //   filter:
        //     "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
        // }}
        />
        <p className="text-[16px]">Página não encontrada.</p>
        <Button
          onClick={() => navigate(redirectPath)}
          className={outlineButtonClass}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
