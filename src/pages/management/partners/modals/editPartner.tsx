import { Modal, Form, Input, Button, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCNPJ } from "@/utils/formatCNPJ";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
export default function EditPartnerModal({
  isModalOpen,
  closeModal,
  selectedPartner,
  removePartner,
  updatePartner,
}: any) {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCancel = () => {
    closeModal();
  };

  useEffect(() => {
    if (selectedPartner) {
      form.setFieldsValue({
        id: selectedPartner.id,
        nome: selectedPartner.nome,
        email: selectedPartner.email,
        cnpj: selectedPartner.cnpj,
        razao_social: selectedPartner.razao_social,
        telefone: selectedPartner.telefone,
      });
    }
  }, [selectedPartner, form]);
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = { ...values };

      updatePartner({ id: selectedPartner?.id, values: payload });
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
        title={
          isEditing ? "Editar Representante" : "Informações do Representante"
        }
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
                          label="CNPJ"
                          name="cnpj"
                          className="flex-1"
                          rules={[
                            {
                              required: true,
                              message: "CNPJ é obrigatório",
                            },
                            {
                              pattern: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/,
                              message: "CNPJ inválido",
                            },
                          ]}
                        >
                          <Input placeholder="" />
                        </Form.Item>
                        <Form.Item
                          label="Razão Social"
                          name="razao_social"
                          className="flex-1"
                          rules={[
                            {
                              required: true,
                              message: "Razão Social é obrigatório",
                            },
                          ]}
                        >
                          <Input placeholder="" />
                        </Form.Item>
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
                          label="Telefone"
                          name="telefone"
                          rules={[
                            {
                              pattern: /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/,
                              message: "Telefone inválido",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      style={{ borderColor: "#242424", color: "#242424" }}
                      onClick={() => {
                        setIsEditing(false);
                      }}
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
                    {/* CNPJ */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        CNPJ
                      </label>
                      <div className=" flex items-center">
                        {formatCNPJ(selectedPartner?.cnpj) || "-"}
                      </div>
                    </div>

                    {/* Razão Social */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Razão Social
                      </label>
                      <div className=" flex items-center">
                        {selectedPartner?.razao_social || "-"}
                      </div>
                    </div>

                    {/* Nome */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nome
                      </label>
                      <div className=" flex items-center">
                        {selectedPartner?.nome || "-"}
                      </div>
                    </div>

                    {/* E-mail */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        E-mail
                      </label>
                      <div className="  flex items-center">
                        {selectedPartner?.email || "-"}
                      </div>
                    </div>

                    {/* Telefone */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Telefone
                      </label>
                      <div className=" flex items-center">
                        {formatPhoneNumber(selectedPartner?.telefone) || "-"}
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
          removePartner(selectedPartner?.id);
          setShowDeleteModal(false);
          closeModal();
        }}
        message="Tem certeza que deseja excluir o representante"
        itemToDelete={selectedPartner?.razao_social || selectedPartner?.id}
      />
    </>
  );
}
