import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Modal, Table } from "antd";
import { customLocale } from "@/utils/customLocale";
import { useAllOrdersController } from "./controllers/dataController";
import { useAllOrdersFilterController } from "./controllers/filterController";
import { useNavigate } from "react-router-dom";
import { TableProps } from "antd/lib";
import { useState } from "react";
import { FiltroOrdersPFForm } from "./components/filter";
import { OrderDetailsModal } from "./modals/orderDetails";
export default function Orders() {
  const queryClient = new QueryClient();
  const {
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedOrder,
    setSelectedOrder,
    currentPage,
    pageSize,
    columns,
    styles,
    allColumnOptions,
    visibleColumns,
    handleColumnsChange,
    isModalAvatarOpen,
    setIsModalAvatarOpen,
    selectedAvatar,
  } = useAllOrdersFilterController();
  const {
    orders,
    showModal,
    closeModal,
    isModalOpen,
    isLoading,
    updateOrder,
    removeOrder,
    isRemoveOrderFetching,
    changeOrderStatus,
    updateDataIdCRMAndConsultorResponsavel
  } = useAllOrdersController(setSelectedOrder);
  const navigate = useNavigate();

  const totalItems =
    orders?.total ?? 0;

  // const rowClassName = (record: OrderC6Bank) => {

  //   const isCoveredByRange = record?.found_via_range;
  //   const hasUnicCep = record?.single_zip_code;
  //   if (record?.status === "FECHADO" || record?.status === "fechado") {
  //     if (isCoveredByRange || hasUnicCep) {
  //       return "ant-table-row-yellow";
  //     }

  //     return "ant-table-row-green";
  //   }
  //   return "";
  // };
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableProps<any>["rowSelection"] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="px-6 md:px-10 lg:px-14">
          <div className="flex justify-between mt-6 mb-4 items-center">
            <div>
              <div className="flex gap-8 justify-between pb-2">
                <h1 className="text-[22px] pl-16 ">Leads</h1>
              </div>
              {/* Filtro */}
              <FiltroOrdersPFForm
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                selectedRowKeys={selectedRowKeys}
                onClear={clearFilters}
                statusOptions={orders?.status_pos_venda_enum ?? []}
                orderPF={orders}
                allColumnOptions={allColumnOptions}
                visibleColumns={visibleColumns}
                handleColumnsChange={handleColumnsChange}
                tableColumns={columns}
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
            {/* Tabela */}
            <div className="overflow-y-auto ">
              <Table<any>
                rowKey="id"
                loading={isLoading}
                scroll={{ y: 800 }}
                rowSelection={rowSelection}
                className={styles.customTable}
                dataSource={orders?.orders ?? []}
                // rowClassName={(record) => rowClassName(record) ?? ""}
                columns={columns}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedOrder(record);
                    showModal();
                  },
                  style: { cursor: "pointer" },
                })}
                pagination={{
                  current: currentPage ? Number(currentPage) : 1,
                  pageSize: pageSize ? Number(pageSize) : 20,
                  total: totalItems,
                  showSizeChanger: true,
                  pageSizeOptions: ["20", "50", "100", "200", "500"],
                  showLessItems: true,
                  onChange: (page, pageSize) => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", page.toString());
                    params.set("per_page", pageSize.toString());
                    navigate(`?${params.toString()}`);
                  },
                  showTotal: (total) => `Total de ${total} leads`,
                }}
              />
            </div>
          </ConfigProvider>

          {/* Modal */}
          <OrderDetailsModal
            statusOptions={orders?.status_pos_venda_enum}
            updateOrderData={updateOrder}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedId={selectedOrder}
            removeOrderData={removeOrder}
            isRemoveOrderFetching={isRemoveOrderFetching}
            updateDataIdCRMAndConsultorResponsavel={updateDataIdCRMAndConsultorResponsavel}
            changeOrderStatus={changeOrderStatus}
          />
        </div>
        {isModalAvatarOpen && (
          <Modal
            open={isModalAvatarOpen}
            onCancel={() => setIsModalAvatarOpen(false)}
            title="Foto de perfil"
            footer={null}
          >
            <div className="w-full flex items-center justify-center py-2">
              <img
                className="w-60 h-60 max-w-full rounded-md object-cover object-center"
                src={selectedAvatar ?? "/assets/anonymous_avatar.png"}
                alt="Avatar"
              />
            </div>
          </Modal>

        )}

      </QueryClientProvider>
    </>
  );
}

