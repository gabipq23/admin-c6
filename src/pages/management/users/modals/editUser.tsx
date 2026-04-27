import {
  Modal,
  Form,
  Input,
  Button,
  ConfigProvider,
  Select,
  Checkbox,
} from "antd";
import { useEffect, useState } from "react";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCPF } from "@/utils/formatCPF";
import { customLocale } from "@/utils/customLocale";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
export default function EditUserModal({
  isModalOpen,
  closeModal,
  selectedUser,
  removeUser,
  updateUser,
}: any) {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCancel = () => {
    closeModal();
  };

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        id: selectedUser.id,
        nome: selectedUser.nome,
        email: selectedUser.email,
        whatsapp: selectedUser.whatsapp,
        cpf: selectedUser.cpf,
        nivel_acesso: selectedUser.nivel_acesso,
        aceita_notificacao_email:
          selectedUser.aceita_notificacao_email ||
          selectedUser.aceita_notificacoes_email,
        aceita_notificacao_browser:
          selectedUser.aceita_notificacao_browser ||
          selectedUser.aceita_notificacoes_browser,
      });
    }
  }, [selectedUser, form]);
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = { ...values };
      if (!payload.senha || payload.senha === undefined) {
        delete payload.senha;
      }

      updateUser({ id: selectedUser?.id, values: payload });
      setIsEditing(false);
      closeModal();
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };
  return (
    <>
      <Modal
        centered
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        title={isEditing ? "Editar Usuário" : "Informações do Usuário"}
      >
        {" "}
        <div>
          {isEditing ? (
            <>
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
                          rules={[
                            {
                              min: 5,
                              message: "Deve ter ao menos 5 caracteres",
                            },
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
                          className="flex-1"
                          label="Telefone"
                          name="whatsapp"
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
                              >
                                <Checkbox>Email</Checkbox>
                              </Form.Item>
                              <Form.Item
                                className="mb-0"
                                name="aceita_notificacao_browser"
                                valuePropName="checked"
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
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleSave();
                        setIsEditing(false);
                      }}
                      style={{
                        backgroundColor: "#242424",
                        borderColor: "#242424",
                      }}
                    >
                      Salvar
                    </Button>
                  </div>
                </Form>
              </ConfigProvider>
            </>
          ) : (
            <>
              <div>
                {/* Informações do Usuário - Display Mode */}
                <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-3 w-full gap-4 text-gray-900">
                    {/* Nome */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nome
                      </label>
                      <div className=" flex items-center">
                        {selectedUser?.nome || "-"}
                      </div>
                    </div>

                    {/* E-mail */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        E-mail
                      </label>
                      <div className="  flex items-center">
                        {selectedUser?.email || "-"}
                      </div>
                    </div>

                    {/* Telefone */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Telefone
                      </label>
                      <div className=" flex items-center">
                        {formatPhoneNumber(selectedUser?.whatsapp) || "-"}
                      </div>
                    </div>

                    {/* CPF */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        CPF
                      </label>
                      <div className="flex items-center">
                        {formatCPF(selectedUser?.cpf) || "-"}
                      </div>
                    </div>

                    {/* Nível de Acesso */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nível de Acesso
                      </label>
                      <div className="flex items-center">
                        {selectedUser?.nivel_acesso || "-"}
                      </div>
                    </div>
                    {/* Notificação */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Receber notificação por
                      </label>
                      <div className="flex flex-col ">
                        <span>
                          {" "}
                          {selectedUser?.aceita_notificacao_email === true
                            ? "• Email"
                            : ""}
                        </span>
                        <span>
                          {" "}
                          {selectedUser?.aceita_notificacao_browser === true
                            ? "• Browser"
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão de Editar */}
                <div className="flex justify-end pt-4 gap-2">
                  <Button
                    type="primary"
                    onClick={() => setIsEditing(true)}
                    style={{
                      backgroundColor: "#242424",
                      borderColor: "#242424",
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDeleteModal(true);
                    }}
                    color="red"
                    variant="outlined"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          removeUser(selectedUser?.id);
          setShowDeleteModal(false);
          closeModal();
        }}
        message="Tem certeza que deseja excluir o usuário"
        itemToDelete={selectedUser?.nome || selectedUser?.id}
      />
    </>
  );
}
