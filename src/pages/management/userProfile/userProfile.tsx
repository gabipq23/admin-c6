import { customLocale } from "@/utils/customLocale";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Form, Input, Button, Checkbox, ConfigProvider } from "antd";
import { useUserProfileController } from "./controllers/dataController";
import { useEffect } from "react";
import dayjs from "dayjs";
export default function UserProfile() {
  const queryClient = new QueryClient();
  const { userProfileQuery, updateUserProfile } = useUserProfileController();
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("tim@user") || "null");
  const userID = user?.id;
  const initials = userProfileQuery?.dados?.nome
    ? userProfileQuery.dados.nome
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
    : "";

  const formatBrazilianDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("/");
    const isoFormat = `${year}-${month}-${day} ${timePart}`;

    return dayjs(isoFormat).subtract(3, "hours").format("DD/MM/YYYY HH:mm:ss");
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        nome: userProfileQuery?.dados?.nome,
        email: userProfileQuery?.dados?.email,
        whatsapp: userProfileQuery?.dados?.whatsapp,
        cpf: userProfileQuery?.dados?.cpf,
        aceita_notificacao_browser:
          userProfileQuery?.dados?.aceita_notificacao_browser,
        aceita_notificacao_email:
          userProfileQuery?.dados?.aceita_notificacao_email,
      });
    }
  });
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = { ...values };
      if (!payload.senha || payload.senha === undefined) {
        delete payload.senha;
      }

      updateUserProfile({ id: userID, values: payload });
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 min-h-[784px] ">
          <div className="flex w-full justify-between mt-3 pb-4">
            <h1 className="text-[22px]">Perfil</h1>
          </div>

          <div className="flex w-full gap-4 ">
            <div className="flex flex-col  items-center justify-around p-2 bg-neutral-200 w-1/3 shadow-sm rounded-sm h-[300px]">
              <div className="flex flex-col items-center gap-2">
                <span className="bg-neutral-300 text-lg text-gray-600 w-16 h-16 rounded-full text-center flex items-center justify-center">
                  {initials}
                </span>
                <p className="text-[12px]  text-gray-600">
                  Nome: {userProfileQuery?.dados?.nome}
                </p>
                <p className="text-[12px]  text-gray-600">
                  Email: {userProfileQuery?.dados?.email}
                </p>
              </div>

              <p className="text-[11px]  text-gray-400">
                Usuário desde:{" "}
                {formatBrazilianDate(userProfileQuery?.dados?.created_at || "")}
              </p>
            </div>
            <div className="bg-neutral-200 w-2/3 shadow-sm rounded-sm h-[660px] p-6">
              <div className="flex w-full justify-between mt-3 pb-4">
                <h1 className="text-neutral-700 text-[18px]">
                  Informações do usuário
                </h1>
              </div>
              <ConfigProvider
                locale={customLocale}
                theme={{
                  components: {
                    Checkbox: {
                      colorPrimary: "#242424",
                      colorPrimaryHover: "#242424",
                      borderRadius: 4,
                      controlInteractiveSize: 18,
                      lineWidth: 2,
                    },
                    Button: {
                      colorPrimary: "#242424",
                      colorPrimaryHover: "#cb1ef5",
                    },
                  },
                }}
              >
                <Form
                  layout="vertical"
                  form={form}
                  className="h-full flex flex-col justify-around"
                >
                  <div className="">
                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        label="Nome:"
                        name="nome"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, insira o nome",
                          },
                        ]}
                      >
                        <Input placeholder="Digite o nome" />
                      </Form.Item>

                      <Form.Item
                        label="E-mail:"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Por favor, insira o e-mail",
                          },
                          { type: "email", message: "E-mail inválido" },
                        ]}
                      >
                        <Input placeholder="Digite o e-mail" />
                      </Form.Item>
                      <Form.Item
                        rules={[
                          { min: 5, message: "Deve ter ao menos 5 caracteres" },
                        ]}
                        className="flex-1"
                        label="Senha "
                        name="senha"
                      >
                        <Input.Password
                          type="password"
                          placeholder="Nova senha (opcional)"
                        />
                      </Form.Item>
                      <Form.Item
                        rules={[
                          {
                            pattern: /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/,
                            message: "Telefone inválido",
                          },
                        ]}
                        label="Telefone:"
                        name="whatsapp"
                      >
                        <Input placeholder="Digite o telefone" />
                      </Form.Item>

                      <Form.Item
                        rules={[
                          {
                            pattern: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/,
                            message: "CPF inválido",
                          },
                        ]}
                        label="CPF:"
                        name="cpf"
                      >
                        <Input placeholder="Digite o CPF" />
                      </Form.Item>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-base font-medium  text-gray-700">
                        Receber notificações:
                      </h3>

                      <div className="flex gap-1 mt-1">
                        <Form.Item
                          name="aceita_notificacao_browser"
                          valuePropName="checked"
                        >
                          <Checkbox>Browser</Checkbox>
                        </Form.Item>

                        <Form.Item
                          name="aceita_notificacao_email"
                          valuePropName="checked"
                        >
                          <Checkbox>Email</Checkbox>
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end ">
                    <Button
                      onClick={handleSave}
                      type="primary"
                      size="large"
                      htmlType="submit"
                      className="bg-geekblue-600 hover:bg-geekblue-700 px-8"
                    >
                      Salvar
                    </Button>
                  </div>
                </Form>
              </ConfigProvider>
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
}
