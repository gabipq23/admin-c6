import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConfigProvider, Table } from "antd";


import { useClientsFilterController } from "./controllers/filtersController";
import { useClientsController } from "./controllers/controller";
import { FilterClients } from "./components/filter";
import { ClientPFInfoModal } from "./modals/clientePFInfo";
import { useState } from "react";
import { TableProps } from "antd/lib";
import { customLocale } from "@/utils/customLocale";
import { ICompany } from "@/interfaces/consult";
import { useNavigate } from "react-router-dom";

export default function ClientsPF() {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedClient,
    setSelectedClient,
    currentPage,
    pageSize,
  } = useClientsFilterController();
  const {
    companies,
    tableColumns,
    styles,
    clientsQuery,
    isClientsFetching,
    isModalOpen,
    showModal,
    closeModal,
  } = useClientsController();

  const defaultVisible = tableColumns
    .filter(
      (col) =>
        col.key !== "email" &&
        col.key !== "phone" &&
        col.key !== "address_complement" &&
        col.key !== "address_number"
    )
    .map((col) => col.key as string);

  const [visibleColumns, setVisibleColumns] =
    useState<string[]>(defaultVisible);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableProps<ICompany>["rowSelection"] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const allColumnOptions = tableColumns.map((col) => ({
    label:
      typeof col.title === "function" ? String(col.key) : String(col.title),
    value: String(col.key),
  }));
  const handleColumnsChange = (checkedValues: string[]) => {
    setVisibleColumns(checkedValues);
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 py-4 min-h-[833px] ">
          <div className="flex justify-between  mt-6  mb-4">
            <div>
              <div className="flex  gap-8 justify-between mb-2">
                <h1 className="text-[22px]">Carteira de Clientes PF</h1>
              </div>
              <FilterClients
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                onClear={clearFilters}
                isFiltered={isFiltered}
                selectedRowKeys={selectedRowKeys}

                tableColumns={tableColumns}
                visibleColumns={visibleColumns}
                handleColumnsChange={handleColumnsChange}
                allColumnOptions={allColumnOptions}
              />
            </div>

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

            <div className=" overflow-y-auto ">
              <Table<ICompany>
                rowKey="id"
                rowSelection={rowSelection}
                className={styles.customTable}
                loading={isClientsFetching}
                columns={tableColumns.filter((col) =>
                  visibleColumns.includes(col.key as string)
                )}
                dataSource={companies}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedClient(record);
                    showModal();
                  },
                  style: { cursor: "pointer" },
                })}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: clientsQuery?.total,
                  showSizeChanger: true,
                  pageSizeOptions: ["50", "100", "200", "500"],
                  showLessItems: true,
                  onChange: (page, pageSize) => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", page.toString());
                    params.set("limit", pageSize.toString());
                    navigate(`?${params.toString()}`);
                  },
                  showTotal: (total) => `Total de ${total} clientes`,
                }}
              />
            </div>
          </ConfigProvider>
          <ClientPFInfoModal
            selectedClient={selectedClient}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
          />
        </div>
      </QueryClientProvider>
    </>
  );
}
