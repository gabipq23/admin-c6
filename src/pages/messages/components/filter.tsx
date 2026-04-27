import { Controller, Control, UseFormHandleSubmit } from "react-hook-form";
import { Input, Button, Tooltip, ConfigProvider, Select } from "antd";
import { DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import { IFilters } from "src/interfaces/contacts";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { outlineButtonClass } from "@/utils/buttonStyles";
interface FiltroPedidosFormProps {
  control: Control<IFilters>;
  handleSubmit: UseFormHandleSubmit<IFilters>;
  onSubmit: (data: IFilters) => void;
  onClear: () => void;
  isFiltered: boolean;
  contactsQuery: any;
  removeContacts: () => void;
}
// import { PatternFormat, PatternFormatProps } from "react-number-format";

// const CNPJInput = (props: PatternFormatProps) => (
//   <PatternFormat
//     {...props}
//     format="##.###.###/####-##"
//     customInput={Input}
//     placeholder="CNPJ"
//     size="middle"
//     allowEmptyFormatting
//   />
// );
// const CPFInput = (props: PatternFormatProps) => (
//   <PatternFormat
//     {...props}
//     format="###.###.###-##"
//     customInput={Input}
//     placeholder="CPF"
//     size="middle"
//     allowEmptyFormatting
//   />
// );
export function FiltroContactForm({
  control,
  handleSubmit,
  onSubmit,
  onClear,
  removeContacts,
  // contactsQuery,
}: FiltroPedidosFormProps) {
  const { RangePicker } = DatePicker;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={onClear}
      className="flex min-w-[200px] flex-wrap  gap-2 mb-4"
    >
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
            name="name"
            render={({ field }) => (
              <Input
                style={{
                  width: "140px",
                }}
                {...field}
                placeholder="Nome"
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                style={{
                  width: "160px",
                }}
                {...field}
                placeholder="Email"
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          {/* <Controller
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
          /> */}

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                style={{
                  width: "150px",
                }}
                placeholder="Status"
                value={field.value || undefined}
                onChange={field.onChange}
                options={[
                  { value: "RECEBIDA", label: "Nova Mensagem" },
                  { value: "LIDA", label: "Visualizada" },
                  { value: "RESPONDIDA", label: "Respondida" },
                ]}
                allowClear
              />
            )}
          />
          {/* <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <Select
                style={{
                  width: "245px",
                }}
                placeholder="Assunto"
                value={field.value || undefined}
                onChange={field.onChange}
                options={
                  Array.isArray(contactsQuery?.assunto_enum)
                    ? contactsQuery.assunto_enum.map((assunto: string) => ({
                      value: assunto,
                      label: assunto,
                    }))
                    : []
                }
                allowClear
              />
            )}
          /> */}
          {/* Período de datas: data_from (início) e data_to (fim) */}
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
                            dates[0].startOf("day").format("YYYY-MM-DD")
                          )
                          : null
                      );
                      fieldAte.onChange(
                        dates && dates[1]
                          ? encodeURIComponent(
                            dates[1].endOf("day").format("YYYY-MM-DD")
                          )
                          : null
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
      </div>

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
          title="Apagar mensagem"
          placement="top"
          styles={{ body: { fontSize: "11px" } }}
        >
          <Button
            className={outlineButtonClass}
            onClick={onClear}
            style={{ width: "24px", height: "28px" }}
          >
            <DeleteOutlined onClick={removeContacts} />
          </Button>
        </Tooltip>
      </div>
    </form>
  );
}
