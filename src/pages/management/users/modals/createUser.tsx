import { customLocale } from "@/utils/customLocale";
import {
  Modal,
  Form,
  Input,
  Button,
  ConfigProvider,
  Select,
  Checkbox,
} from "antd";

export default function CreateUserModal({
  showCreateUserModal,
  setShowCreateUserModal,
  createUser,
}: any) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setShowCreateUserModal(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      createUser(values);
      setShowCreateUserModal(false);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  return (
    <Modal
      centered
      open={showCreateUserModal}
      onCancel={handleCancel}
      footer={null}
      width={800}
      title="Adicionar Usuário"
    >
      <div className="p-4">
        <ConfigProvider
          theme={{
            components: {
              Input: {
                hoverBorderColor: "#242424",
                activeBorderColor: "#242424",
                activeShadow: "none",
              },
              Select: {
                hoverBorderColor: "#242424",
                activeBorderColor: "#242424",
                activeOutlineColor: "none",
              },
            },
          }}
        >
          <Form form={form} layout="vertical" className="space-y-2">
            <div className="max-h-[520px] overflow-y-auto scrollbar-thin">
              {/* Informações Básicas */}
              <div className="bg-neutral-50 p-2 rounded-lg mb-4">
                <div className="grid grid-cols-3 w-full gap-4">
                  <Form.Item
                    label="Nome"
                    name="nome"
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Nome é obrigatório",
                      },
                      {
                        min: 3,
                        message: "Deve ter ao menos 3 caracteres",
                      },

                      {
                        pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
                        message: "Nome inválido",
                      },
                    ]}
                  >
                    <Input placeholder="" />
                  </Form.Item>

                  <Form.Item
                    className="flex-1"
                    label="E-mail"
                    name="email"
                    rules={[
                      { required: true, message: "E-mail é obrigatório" },
                      { type: "email", message: "E-mail inválido" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    className="flex-1"
                    label="Senha"
                    name="senha"
                    rules={[
                      { required: true, message: "Senha é obrigatória" },
                      { min: 5, message: "Deve ter ao menos 5 caracteres" },
                    ]}
                  >
                    <Input.Password type="password" />
                  </Form.Item>
                  <Form.Item
                    className="flex-1"
                    label="Telefone"
                    name="whatsapp"
                    rules={[
                      {
                        pattern: /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/,
                        message: "Telefone inválido",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    rules={[
                      {
                        pattern: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/,
                        message: "CPF inválido",
                      },
                    ]}
                    className="flex-1"
                    label="CPF"
                    name="cpf"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    className="flex-1"
                    label="Cargo"
                    name="nivel_acesso"
                  >
                    <Select
                      placeholder="Nível de Acesso"
                      options={[
                        { value: "Gold", label: "Gold" },
                        { value: "Master", label: "Master" },
                        { value: "Gerente", label: "Gerente" },
                        { value: "Líder", label: "Líder" },
                        { value: "Consultor", label: "Consultor" },
                        { value: "Parceiro", label: "Parceiro" },
                      ]}
                      allowClear
                    />
                  </Form.Item>
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
                      },
                    }}
                  >
                    <div className="flex flex-col">
                      <label>Receber notificação por:</label>
                      <div className="flex gap-4">
                        {" "}
                        <Form.Item
                          className="mb-0"
                          name="aceita_notificacao_email"
                          valuePropName="checked"
                          initialValue={false}
                        >
                          <Checkbox>Email</Checkbox>
                        </Form.Item>
                        <Form.Item
                          className="mb-0"
                          name="aceita_notificacao_browser"
                          valuePropName="checked"
                          initialValue={false}
                        >
                          <Checkbox>Browser</Checkbox>
                        </Form.Item>
                      </div>
                    </div>
                  </ConfigProvider>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                style={{ borderColor: "#242424", color: "#242424" }}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                type="primary"
                style={{ backgroundColor: "#242424", borderColor: "#242424" }}
              >
                Adicionar
              </Button>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    </Modal>
  );
}
