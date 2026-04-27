import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import { Input, Button, Tooltip, ConfigProvider } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import { outlineButtonClass } from "@/utils/buttonStyles";
import CreatePartnerModal from "../modals/createPartner";
interface FiltroPartnersFormProps {
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
  onClear: () => void;
  isFiltered: boolean;
  createPartner: any;
}

export function FiltroPartnersForm({
  createPartner,
  control,
  handleSubmit,
  onSubmit,
  onClear,
}: FiltroPartnersFormProps) {
  const [showCreatePartnerModal, setShowCreatePartnerModal] = useState(false);

  return (
    <>
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
              name="cnpj"
              render={({ field }) => (
                <Input
                  style={{
                    width: "140px",
                  }}
                  {...field}
                  placeholder="CNPJ"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="razao_social"
              render={({ field }) => (
                <Input
                  style={{
                    width: "160px",
                  }}
                  {...field}
                  placeholder="Razão Social"
                  value={field.value || ""}
                  onChange={field.onChange}
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
            title="Adicionar Representante"
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <Button
              className={outlineButtonClass}
              onClick={() => setShowCreatePartnerModal(true)}
              style={{ width: "24px", height: "28px" }}
            >
              +
            </Button>
          </Tooltip>
        </div>
      </form>
      <CreatePartnerModal
        createPartner={createPartner}
        showCreatePartnerModal={showCreatePartnerModal}
        setShowCreatePartnerModal={setShowCreatePartnerModal}
      />
    </>
  );
}
