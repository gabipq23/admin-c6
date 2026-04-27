import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Table } from "antd";
import { usePartnersFilterController } from "./controllers/filterController";
import { usePartnersController } from "./controllers/dataController";
import { FiltroPartnersForm } from "./components/filter";
import { useNavigate } from "react-router-dom";
import { customLocale } from "@/utils/customLocale";

import { useState } from "react";
import EditPartnerModal from "./modals/editPartner";
export default function Partners() {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const { tableColumns, styles } = usePartnersFilterController();
  const {
    isModalOpen,
    showModal,
    closeModal,
    createPartner,
    removePartner,
    partnersQuery,
    isLoading,
    updatePartner,
  } = usePartnersController();
  const { isFiltered, control, onSubmit, handleSubmit, clearFilters } =
    usePartnersFilterController();
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 min-h-[833px] ">
          <div className="flex w-full justify-between mt-3 pb-4">
            <h1 className="text-[22px]">Representantes</h1>
          </div>
          <FiltroPartnersForm
            createPartner={createPartner}
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
                dataSource={partnersQuery?.dados}
                onRow={(selectedPartner) => ({
                  onClick: () => {
                    setSelectedPartner(selectedPartner);
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
                  total: partnersQuery?.dados?.length || 0,
                  showSizeChanger: true,
                  pageSizeOptions: ["50", "100", "200", "500"],
                  showLessItems: true,
                  onChange: (page, pageSize) => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", page.toString());
                    params.set("limit", pageSize.toString());
                    navigate(`?${params.toString()}`);
                  },
                  showTotal: (total) => `Total de ${total} representantes`,
                }}
              />
            </div>
          </ConfigProvider>

          <EditPartnerModal
            updatePartner={updatePartner}
            removePartner={removePartner}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedPartner={selectedPartner}
          />
        </div>
      </QueryClientProvider>
    </>
  );
}
