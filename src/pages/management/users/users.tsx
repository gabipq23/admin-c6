import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Table } from "antd";

import { useNavigate } from "react-router-dom";
import { customLocale } from "@/utils/customLocale";
import { FiltroUsersForm } from "./components/filter";
import { useUsersFilterController } from "./controllers/filterController";
import { useUsersController } from "./controllers/dataController";
import { useState } from "react";
import EditUserModal from "./modals/editUser";

function Users() {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const { tableColumns, styles } = useUsersFilterController();
  const {
    createUser,
    isModalOpen,
    showModal,
    closeModal,
    usersQuery,
    isLoading,
    removeUser,
    updateUser,
  } = useUsersController();
  const { isFiltered, control, onSubmit, handleSubmit, clearFilters } =
    useUsersFilterController();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 min-h-[833px] ">
          <div className="flex w-full justify-between mt-3 pb-4">
            <h1 className="text-[22px]">Usuários</h1>
          </div>
          <FiltroUsersForm
            createUser={createUser}
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onClear={clearFilters}
            isFiltered={isFiltered}
          />
          <ConfigProvider
            locale={customLocale}
            theme={{
              token: {
                colorPrimary: "#242424",
                colorPrimaryHover: "#242424",
                colorLink: "#242424",
                colorPrimaryBg: "transparent",
              },
              components: {
                Checkbox: {
                  colorPrimary: "#242424",
                  colorPrimaryHover: "#242424",
                  borderRadius: 4,
                  controlInteractiveSize: 18,
                  lineWidth: 2,
                },
              },
            }}
          >
            {/* Tabela para web */}
            <div className="hidden md:block overflow-y-auto ">
              <Table<any>
                rowKey="id"
                dataSource={usersQuery?.dados}
                onRow={(selectedUser) => ({
                  onClick: () => {
                    setSelectedUser(selectedUser);
                    showModal();
                  },
                  style: { cursor: "pointer" },
                })}
                loading={isLoading}
                className={styles.customTable}
                columns={tableColumns}
                pagination={{
                  current: 1,
                  pageSize: 50,
                  total: usersQuery?.dados?.length || 0,
                  showSizeChanger: true,
                  pageSizeOptions: ["50", "100", "200", "500"],
                  showLessItems: true,
                  onChange: (page, pageSize) => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", page.toString());
                    params.set("limit", pageSize.toString());
                    navigate(`?${params.toString()}`);
                  },
                  showTotal: (total) => `Total de ${total} usuários`,
                }}
              />
            </div>
          </ConfigProvider>

          <EditUserModal
            updateUser={updateUser}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedUser={selectedUser}
            removeUser={removeUser}
          />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default Users;
