import { SearchOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Form, Input, Table, Tooltip } from "antd";
import { useZapCheckerFilterController } from "./controller/filterController";
import { PatternFormat, PatternFormatProps } from "react-number-format";

import { useZapCheckerController } from "./controller/dataController";
const PhoneInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="(##) #####-####"
    customInput={Input}
    placeholder="Telefone"
    size="middle"
    className="h-8"
    style={{
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    }}
  />
);
export default function ZapChecker() {
  const queryClient = new QueryClient();
  const [form] = Form.useForm();

  const { tableColumns, styles } = useZapCheckerFilterController();
  const { checkZap, isLoadingZapChecker, zapChecker } =
    useZapCheckerController();

  const handleSubmit = (values: any) => {
    const phoneLimpo = values.numero?.replace(/[^\d]/g, "") || "";
    checkZap(phoneLimpo);
  };

  const handleClear = () => {
    form.resetFields();
  };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 h-[calc(100vh-160px)]">
          <div className="flex flex-col gap-2 justify-between  ">
            <h1 className="text-[22px] ">Zap Checker</h1>
            <div className=" flex flex-col gap-1  text-[14px]  text-neutral-500">
              <p>
                Verifique se um número de telefone está registrado no WhatsApp.
              </p>
              <p>
                Para consultas em massa ou integração do serviço via API em
                outras plataformas acesse{" "}
                <a
                  href="https://zapchecker.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#242424]"
                >
                  https://zapchecker.online
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
                <div className="flex ">
                  <Form.Item name="numero">
                    <PhoneInput format="(##) #####-####" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoadingZapChecker}
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
          {zapChecker && (
            <div className="hidden md:block overflow-y-auto ">
              {(() => {
                const dataSource = Array.isArray(zapChecker)
                  ? zapChecker
                  : zapChecker
                    ? [zapChecker]
                    : [];

                if (dataSource.length === 0) {
                  return (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-gray-500 text-lg">
                        Não encontramos resultado para essa pesquisa
                      </p>
                    </div>
                  );
                }

                return (
                  <Table<any>
                    scroll={{ y: 800 }}
                    rowKey={(_, index) => index?.toString() || "0"}
                    dataSource={dataSource}
                    loading={isLoadingZapChecker}
                    className={styles.customTable}
                    columns={tableColumns}
                    pagination={false}
                  />
                );
              })()}
            </div>
          )}
        </div>
      </QueryClientProvider>
    </>
  );
}
