import { SearchOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Form, Input, Table, Tooltip } from "antd";
import { useBase2bSocioFilterController } from "./controller/filterController";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { useState } from "react";
import { useBase2bSocioController } from "./controller/dataController";
import { customLocale } from "@/utils/customLocale";

const CNPJInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="##.###.###/####-##"
    customInput={Input}
    placeholder="CNPJ"
    size="middle"
    className="h-8"
  />
);
const CPFInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="###.###.###-##"
    customInput={Input}
    placeholder="CPF"
    size="middle"
    className="h-8"
  />
);
export default function Base2bSocio() {
  const queryClient = new QueryClient();
  const [cnpj, setCnpj] = useState("");
  const [cpf, setCpf] = useState("");
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const { cpfTableColumns, cnpjTableColumns, styles } =
    useBase2bSocioFilterController();

  const {
    base2bSociosCPF,
    isLoadingSociosCPF,
    base2bSociosCNPJ,
    isLoadingSociosCNPJ,
  } = useBase2bSocioController(cpf, cnpj);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleSubmit = (values: any) => {
    const cnpjLimpo = values.numero?.replace(/[^\d]/g, "") || "";
    const cpfLimpo = values.cpf?.replace(/[^\d]/g, "") || "";

    setCurrentPage(1);
    setPageSize(50);

    if (cpfLimpo) {
      setCpf(cpfLimpo);
      setCnpj("");
    } else if (cnpjLimpo) {
      const cnpjBasico = cnpjLimpo.slice(0, 8); // Pega apenas os 8 primeiros dígitos
      setCnpj(cnpjBasico);
      setCpf(""); //
    }
  };

  const handleClear = () => {
    form.resetFields();
    setCnpj("");
    setCpf("");
    setCurrentPage(1);
    setPageSize(50);
  };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 ">
          <div className="flex flex-col gap-2 justify-between  ">
            <h1 className="text-[22px] ">Base2B / Busca-Sócio</h1>
            {/* <div className=" flex gap-1 items-center text-[14px]  text-neutral-500">
              <p>
                Consulte por CPF para encontrar empresas vinculadas ao
                documento, ou por CNPJ para listar todos os sócios da empresa.
              </p>
            </div> */}

            <div className=" flex flex-col gap-1  text-[14px]  text-neutral-500">
              <p>
                Consulte as informações disponíveis de uma empresa a partir do
                CNPJ ou CPF.
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
          <div className="mt-2">
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
              <Form form={form} onFinish={handleSubmit}>
                <div className="flex gap-2">
                  <Form.Item name="numero">
                    <CNPJInput format="##.###.###/####-##" />
                  </Form.Item>
                  <div className="flex gap-2">
                    <Form.Item name="cpf">
                      <CPFInput format="###.###.###-##" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoadingSociosCPF || isLoadingSociosCNPJ}
                        style={{
                          backgroundColor: "#242424",
                          color: "white",
                          borderColor: "#000000",

                          height: "32px",
                        }}
                      >
                        <SearchOutlined /> Consultar
                      </Button>
                    </Form.Item>
                  </div>

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
            {(cpf || cnpj) && (
              <div className="overflow-y-auto ">
                {(() => {
                  const sociosCPF = base2bSociosCPF?.data?.empresas;
                  const sociosCNPJ = base2bSociosCNPJ?.data;
                  const hasData =
                    (Array.isArray(sociosCPF) && sociosCPF.length > 0) ||
                    (Array.isArray(sociosCNPJ) && sociosCNPJ.length > 0);
                  const isLoading = isLoadingSociosCPF || isLoadingSociosCNPJ;

                  if (hasData) {
                    return (
                      <Table<any>
                        scroll={{ y: 800 }}
                        rowKey={(_, index) => index?.toString() || "0"}
                        dataSource={
                          base2bSociosCPF?.data?.empresas
                            ? base2bSociosCPF.data.empresas
                            : base2bSociosCNPJ?.data
                              ? base2bSociosCNPJ.data
                              : []
                        }
                        loading={isLoading}
                        className={styles.customTable}
                        columns={
                          base2bSociosCPF?.data?.empresas
                            ? cpfTableColumns
                            : base2bSociosCNPJ?.data
                              ? cnpjTableColumns
                              : cpfTableColumns
                        }
                        pagination={{
                          current: currentPage,
                          pageSize: pageSize,
                          total:
                            base2bSociosCPF?.data?.total_count ||
                            base2bSociosCNPJ?.count ||
                            0,
                          showSizeChanger: true,
                          pageSizeOptions: ["50", "100", "200", "500"],
                          showLessItems: true,
                          onChange: handlePageChange,
                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} de ${total} registros`,
                        }}
                      />
                    );
                  } else if (!isLoading && (cpf || cnpj)) {
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
