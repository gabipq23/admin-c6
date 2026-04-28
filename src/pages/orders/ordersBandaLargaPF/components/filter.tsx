import { Controller, Control, UseFormHandleSubmit } from "react-hook-form";
import {
  Button,
  Tooltip,
  ConfigProvider,
  Select,
  Dropdown,
  Checkbox,
  Input,
} from "antd";
import { FilterOutlined, DownloadOutlined } from "@ant-design/icons";
import ptBR from "antd/es/locale/pt_BR";
import { DatePicker } from "antd";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import dayjs from "dayjs";
import { handleExportXLSX } from "../controllers/exportXLSX";
import { outlineButtonClass } from "@/utils/buttonStyles";
import { customLocale } from "@/utils/customLocale";
import { C6BankFilters } from "@/interfaces/orders";


interface FiltroPedidosFormProps {
  control: Control<C6BankFilters>;
  handleSubmit: UseFormHandleSubmit<C6BankFilters>;
  onSubmit: (data: C6BankFilters) => void;
  onClear: () => void;
  selectedRowKeys: any;
  statusOptions?: string[];
  orderPF: any;
  allColumnOptions: any[];
  visibleColumns: string[];
  handleColumnsChange: (checked: string[]) => void;
  tableColumns: any;
}

const CPFInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="###.###.###-##"
    customInput={Input}
    placeholder="CPF"
    size="middle"
  />
);
export function FiltroOrdersPFForm({
  control,
  handleSubmit,
  onSubmit,
  onClear,
  selectedRowKeys,
  orderPF,
  allColumnOptions,
  visibleColumns,
  handleColumnsChange,
}: FiltroPedidosFormProps) {
  const { RangePicker } = DatePicker;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={onClear}
      className="flex justify-between items-center  min-w-[200px] flex-wrap  gap-2 "
    >
      <div className="flex gap-2 items-center flex-wrap ">
        <div className="flex gap-2 flex-wrap">
          <ConfigProvider
            locale={ptBR}
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
                DatePicker: {
                  hoverBorderColor: "#242424",
                  activeBorderColor: "#242424",
                  colorPrimaryBorder: "#242424",
                  colorPrimary: "#242424",
                },
              },
            }}
          >
            <Controller
              control={control}
              name="order_number"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="ID do Lead"
                  value={field.value || ""}
                  onChange={field.onChange}
                  style={{
                    width: "115px",
                  }}
                  maxLength={13}
                />
              )}
            />
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  mode="multiple"
                  style={{ minWidth: "120px" }}
                  placeholder="Pedido"
                  value={field.value?.length ? field.value : []}
                  onChange={field.onChange}
                  options={[
                    { value: "ABERTO", label: "Aberto" },
                    { value: "FECHADO", label: "Fechado" },
                    { value: "CANCELADO", label: "Cancelado" },
                  ]}
                  allowClear
                />
              )}
            />


            <Controller
              control={control}
              name="cpf"
              render={({ field }) => (
                <CPFInput
                  {...field}
                  format="###.###.###-##"
                  value={field.value || ""}
                  onValueChange={(values) => field.onChange(values.value)}
                  style={{ width: "150px" }}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Telefone"
                  value={field.value || ""}
                  onChange={field.onChange}
                  style={{
                    width: "110px",
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="after_sales_status"
              render={({ field }) => (
                <Select
                  style={{
                    width: "300px",
                  }}
                  placeholder="Status do Pedido"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  // options={statusOptions?.map((status: string) => ({
                  //   value: status,
                  //   label: status,
                  // }))}
                  allowClear
                />
              )}
            />
            {/* Período de datas: data_de (início) e data_ate (fim) */}
            <Controller
              control={control}
              name="data_from"
              render={({ field: fieldDe }) => (
                <Controller
                  control={control}
                  name="data_to"
                  render={({ field: fieldAte }) => (
                    <RangePicker
                      style={{
                        width: "215px",
                      }}
                      value={
                        fieldDe.value && fieldAte.value
                          ? [
                            fieldDe.value
                              ? dayjs(decodeURIComponent(fieldDe.value))
                              : null,
                            fieldAte.value
                              ? dayjs(decodeURIComponent(fieldAte.value))
                              : null,
                          ]
                          : [null, null]
                      }
                      format="DD/MM/YYYY"
                      onChange={(dates) => {
                        fieldDe.onChange(
                          dates && dates[0]
                            ? encodeURIComponent(
                              dates[0].startOf("day").format("YYYY-MM-DD"),
                            )
                            : null,
                        );
                        fieldAte.onChange(
                          dates && dates[1]
                            ? encodeURIComponent(
                              dates[1].endOf("day").format("YYYY-MM-DD"),
                            )
                            : null,
                        );
                      }}
                      allowClear
                      placeholder={["de", "até"]}
                    />
                  )}
                />
              )}
            />
          </ConfigProvider>
          <div className="flex gap-2 items-center">
            <Tooltip
              title="Filtrar"
              placement="top"
              styles={{ body: { fontSize: "11px" } }}
            >
              <Button
                className={outlineButtonClass}
                style={{
                  width: "24px",
                  height: "28px",

                }}
                htmlType="submit"
              >
                <FilterOutlined />
              </Button>
            </Tooltip>

            <Tooltip
              title="Limpar filtro"
              placement="top"
              styles={{ body: { fontSize: "11px" } }}
            >
              <Button
                className={outlineButtonClass}
                onClick={onClear}
                style={{ width: "24px", height: "28px" }}
              >
                X
              </Button>
            </Tooltip>
            <Tooltip
              title="Download"
              placement="top"
              styles={{ body: { fontSize: "11px" } }}
            >
              <Button
                className={outlineButtonClass}
                style={{ width: "24px", height: "28px" }}
                onClick={() =>
                  handleExportXLSX(orderPF, selectedRowKeys)
                }
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div></div>
      <div className="flex  justify-end ">
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
                colorBorder: "#242424",
                colorText: "#242424",
                colorPrimaryHover: "#242424",
                colorPrimaryBorderHover: "#242424",
              },
            },
          }}
        >
          <div className="flex justify-end">
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <div
                  style={{
                    width: 240,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    padding: 12,
                    maxHeight: 300,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                  <div className="hide-scrollbar">
                    <Checkbox.Group
                      options={allColumnOptions}
                      value={visibleColumns}
                      onChange={handleColumnsChange}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    />
                  </div>
                </div>
              )}
            >
              <Button className={outlineButtonClass}>Selecionar Colunas</Button>
            </Dropdown>
          </div>
        </ConfigProvider>
      </div>
    </form>
  );
}
