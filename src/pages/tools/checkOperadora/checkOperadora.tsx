import { SearchOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Form, Input, Table, Tooltip } from "antd";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { useCheckOperadoraFilterController } from "./controller/filterController";
import { useState } from "react";
import { useCheckOperadoraController } from "./controller/dataController";
import { customLocale } from "@/utils/customLocale";

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

export default function CheckOperadora() {
  const queryClient = new QueryClient();
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const { tableColumns, styles } = useCheckOperadoraFilterController();
  const { checkOperadora, isLoadingCheckOperadora } =
    useCheckOperadoraController(phone);
  const handleSubmit = (values: any) => {
    const phoneLimpo = values.numero?.replace(/[^\d]/g, "") || "";
    setPhone(phoneLimpo);
  };

  const handleClear = () => {
    form.resetFields();
    setPhone("");
  };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 h-[calc(100vh-160px)]">
          <div className="flex flex-col gap-2 justify-between  ">
            <h1 className="text-[22px] ">Check Operadora</h1>
            <div className=" flex gap-1 items-center text-[14px]  text-neutral-500">
              <p>
                Consulte as informações de operadora a partir de um número de
                telefone.
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
              <Form onFinish={handleSubmit} form={form}>
                <div className="flex ">
                  <Form.Item name="numero">
                    <PhoneInput format="(##) #####-####" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoadingCheckOperadora}
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
                          onClick={handleClear}
                          className="w-6 h-6 !border-[#242424] !text-[#242424] hover:!border-[#242424] hover:!bg-[#24242414]"
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
            {phone && (
              <div className="hidden md:block overflow-y-auto ">
                {(() => {
                  if (checkOperadora?.data) {
                    return (
                      <Table<any>
                        scroll={{ y: 800 }}
                        rowKey="id"
                        dataSource={[checkOperadora.data]}
                        loading={isLoadingCheckOperadora}
                        className={styles.customTable}
                        columns={tableColumns}
                        pagination={false}
                      />
                    );
                  } else if (!isLoadingCheckOperadora && phone) {
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
