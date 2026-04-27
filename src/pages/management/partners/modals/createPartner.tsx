import { Modal, Form, Input, Button, ConfigProvider } from "antd";

export default function CreatePartnerModal({
  showCreatePartnerModal,
  setShowCreatePartnerModal,
  createPartner,
}: any) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setShowCreatePartnerModal(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      createPartner(values);
      setShowCreatePartnerModal(false);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  return (
    <Modal
      centered
      open={showCreatePartnerModal}
      onCancel={handleCancel}
      footer={null}
      width={800}
      title="Adicionar Representante"
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
