import { SearchOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Form, Input, Table, Tooltip } from "antd";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { useBase2bEmpresaFilterController } from "./controller/filterController";
import { useBase2bEmpresaController } from "./controller/dataController";
import { useState } from "react";
import { customLocale } from "@/utils/customLocale";

const CNPJInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="##.###.###/####-##"
    customInput={Input}
    placeholder="CNPJ"
    size="middle"
    className="h-8"
    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
  />
);

export default function Base2bEmpresa() {
  const queryClient = new QueryClient();
  const [cnpj, setCnpj] = useState("");
  const [form] = Form.useForm();

  const { tableColumns, styles } = useBase2bEmpresaFilterController();

  const { base2bEmpresas, isLoadingEmpresas } =
    useBase2bEmpresaController(cnpj);

  const handleSubmit = (values: any) => {
    const cnpjLimpo = values.numero?.replace(/[^\d]/g, "") || "";
    setCnpj(cnpjLimpo);
  };

  const handleClear = () => {
    form.resetFields();
    setCnpj("");
  };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 h-[calc(100vh-160px)]">
          <div className="flex flex-col gap-2 justify-between  ">
            <h1 className="text-[22px] ">Base2B / Busca-Empresa</h1>
            <div className=" flex flex-col gap-1  text-[14px]  text-neutral-500">
              <p>
                Consulte as informações disponíveis de uma empresa a partir do
                CNPJ.
              </p>
              <p>
                Para mais alternativas de consulta, buscas em massa e
                enriquecimento de dados acesse{" "}
                <a
                  href="https://base2b.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#242424]"
                >
                  https://base2b.online
                </a>{" "}
                com os mesmos dados de login e senha que você utiliza nesta
                plataforma.
              </p>
            </div>
          </div>

          <div className=" flex mt-2 flex-col gap-4">
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    activeBorderColor: "#242424",
                    hoverBorderColor: "#242424",
                  },
                },
              }}
            >
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div className="flex ">
                  <Form.Item
                    name="numero"
                    rules={[
                      { required: true, message: "Adicione um CNPJ" },
                      {
                        pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                        message: "CNPJ inválido",
                      },
                    ]}
                  >
                    <CNPJInput format="##.###.###/####-##" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoadingEmpresas}
                      style={{
                        backgroundColor: "#242424",
                        color: "white",
                        borderColor: "#000000",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        height: "32px",
                      }}
                    >
                      <SearchOutlined /> Consultar
                    </Button>
                  </Form.Item>

                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          colorBorder: "#242424",
                          colorText: "#242424",
                          colorPrimary: "#242424",
                          colorPrimaryHover: "#242424",
                        },
                      },
                    }}
                  >
                    <div className="ml-2">
                      <Tooltip
                        title="Limpar consulta"
                        placement="top"
                        styles={{ body: { fontSize: "12px" } }}
                      >
                        <Button
                          className="w-6 h-6 !border-[#242424] !text-[#242424] hover:!border-[#242424] hover:!bg-[#24242414]"
                          onClick={handleClear}
                        >
                          X
                        </Button>
                      </Tooltip>
                    </div>
                  </ConfigProvider>
                </div>
              </Form>
            </ConfigProvider>
          </div>
          <ConfigProvider
            locale={customLocale}
            theme={{
              token: {
                colorPrimary: "#242424",
                colorPrimaryHover: "#242424",
                colorLink: "#242424",
                colorPrimaryBg: "transparent",
              },
            }}
          >
            {cnpj && (
              <div className="hidden md:block overflow-y-auto ">
                {(() => {
                  if (base2bEmpresas?.data) {
                    return (
                      <Table<any>
                        scroll={{ y: 800 }}
                        rowKey="base_cnpj"
                        dataSource={[base2bEmpresas.data]}
                        loading={isLoadingEmpresas}
                        className={styles.customTable}
                        columns={tableColumns}
                        pagination={false}
                      />
                    );
                  } else if (!isLoadingEmpresas && cnpj) {
                    return (
                      <div className="flex justify-center items-center h-40">
                        <p className="text-gray-500 text-lg">
                          Não encontramos resultado para essa pesquisa
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </ConfigProvider>
        </div>
      </QueryClientProvider>
    </>
  );
}
