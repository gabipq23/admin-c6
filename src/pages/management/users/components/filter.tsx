import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import { Input, Button, Tooltip, ConfigProvider, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import { outlineButtonClass } from "@/utils/buttonStyles";
import CreateUserModal from "../modals/createUser";

interface FiltroUsersFormProps {
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
  onClear: () => void;
  isFiltered: boolean;
  createUser: any;
}

export function FiltroUsersForm({
  createUser,
  control,
  handleSubmit,
  onSubmit,
  onClear,
}: FiltroUsersFormProps) {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

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
              name="nome"
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

            <Controller
              control={control}
              name="nivel_acesso"
              render={({ field }) => (
                <Select
                  style={{
                    width: "140px",
                  }}
                  placeholder="Nível de Acesso"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={[
                    { value: "Gold", label: "Gold" },
                    { value: "Master", label: "Master" },
                    { value: "Gerente", label: "Gerente" },
                    { value: "Líder", label: "Líder" },
                    { value: "Consultor", label: "Consultor" },
                    { value: "Parceiro", label: "Parceiro" },
                  ]}
                  allowClear
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
            title="Adicionar Usuário"
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <Button
              className={outlineButtonClass}
              onClick={() => setShowCreateUserModal(true)}
              style={{ width: "24px", height: "28px" }}
            >
              +
            </Button>
          </Tooltip>
        </div>
      </form>
      <CreateUserModal
        createUser={createUser}
        showCreateUserModal={showCreateUserModal}
        setShowCreateUserModal={setShowCreateUserModal}
      />
    </>
  );
}
