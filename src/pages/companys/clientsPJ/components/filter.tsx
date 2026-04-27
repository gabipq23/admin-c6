import {
  Input,
  Button,
  Tooltip,
  ConfigProvider,
  Select,
  Checkbox,
  Dropdown,
} from "antd";
import { DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import { InputNumber } from "antd";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { outlineButtonClass } from "@/utils/buttonStyles";
import { customLocale } from "@/utils/customLocale";
import { handleExportXLSX } from "../controllers/exportXLSX";
import { ICompanyFilter } from "@/interfaces/consult";

interface FiltroPedidosFormProps {
  control: Control<ICompanyFilter>;
  handleSubmit: UseFormHandleSubmit<ICompanyFilter>;
  onSubmit: (data: ICompanyFilter) => void;
  onClear: () => void;
  selectedRowKeys: any;
  isFiltered: boolean;
  companies: any;
  allColumnOptions: any[];
  visibleColumns: string[];
  handleColumnsChange: (checked: string[]) => void;
  tableColumns: any;
}

const CNPJInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="##.###.###/####-##"
    customInput={Input}
    placeholder="CNPJ"
    size="middle"
    allowEmptyFormatting
  />
);
export function FilterClients({
  control,
  handleSubmit,
  onSubmit,
  onClear,
  selectedRowKeys,
  companies,
  visibleColumns,
  tableColumns,
  handleColumnsChange,
  allColumnOptions,
}: FiltroPedidosFormProps) {
  const { Option } = Select;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={onClear}
      className="flex justify-between items-center  min-w-[200px] flex-wrap  gap-2 mb-4"
    >
      <div className="flex gap-2 items-center flex-wrap ">
        <div className="flex gap-2 flex-wrap">
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
            <Controller
              control={control}
              name="cnpj"
              render={({ field }) => (
                <CNPJInput
                  {...field}
                  format="##.###.###/####-##"
                  value={field.value || ""}
                  onValueChange={(values) => field.onChange(values.value)}
                  style={{ width: "150px" }}
                />
              )}
            />

            <Controller
              control={control}
              name="company_legal_name"
              render={({ field }) => (
                <Input
                  style={{
                    width: "170px",
                  }}
                  placeholder="Razão Social"
                  {...field}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="rfb_status"
              render={({ field }) => (
                <Select
                  style={{ width: "130px" }}
                  placeholder="Status Receita"
                  {...field}
                  value={field.value || undefined}
                  onChange={field.onChange}
                >
                  <Option value="ativa">Ativa</Option>
                  <Option value="baixada">Baixada</Option>
                  <Option value="suspensa">Suspensa</Option>
                  <Option value="inapta">Inapta</Option>
                </Select>
              )}
            />

            <Controller
              control={control}
              name="is_mei"
              render={({ field }) => (
                <Select
                  style={{ width: "130px" }}
                  placeholder="MEI"
                  {...field}
                  value={field.value || undefined}
                  onChange={field.onChange}
                >
                  <Option value="1">Sim</Option>
                  <Option value="0">Não</Option>
                </Select>
              )}
            />

            <Controller
              control={control}
              name="credit_min"
              render={({ field }) => (
                <InputNumber
                  style={{ width: "130px" }}
                  min={0}
                  placeholder="Crédito Mín."
                  value={field.value}
                  onChange={field.onChange}
                  formatter={(value) =>
                    value === undefined || value === null
                      ? ""
                      : `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value) =>
                    value ? Number(value.replace(/[R$\s.]/g, "").replace(",", ".")) : 0
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="credit_max"
              render={({ field }) => (
                <InputNumber
                  style={{ width: "130px" }}
                  min={0}
                  placeholder="Crédito Máx."
                  value={field.value}
                  onChange={field.onChange}
                  formatter={(value) =>
                    value === undefined || value === null
                      ? ""
                      : `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value) =>
                    value ? Number(value.replace(/[R$\s.]/g, "").replace(",", ".")) : 0
                  }
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
                  handleExportXLSX({
                    companies,
                    selectedRowKeys,
                    visibleColumns,
                    tableColumns,
                  })
                }
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div></div>
      <div className="flex  justify-end  ">
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
                colorPrimaryHover: "#cb1ef5",
                colorPrimaryBorderHover: "#cb1ef5",
              },
            },
          }}
        >
          {/* Tabela para web */}
          <Dropdown
            popupRender={() => (
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
                <style>
                  {`
                            .hide-scrollbar::-webkit-scrollbar {
                              display: none;
                            }
                            `}
                </style>
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
            trigger={["click"]}
          >
            <Button className={outlineButtonClass}>Selecionar Colunas</Button>
          </Dropdown>
        </ConfigProvider>
      </div>
    </form>
  );
}
