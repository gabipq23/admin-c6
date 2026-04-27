import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContactsController } from "./controllers/dataController";
import { useContactFilterController } from "./controllers/filterController";
import { ConfigProvider, Table } from "antd";
import { IContact } from "src/interfaces/contacts";
import { ContactInfoModal } from "./modals/contactInfo";
import type { TableProps } from "antd";
import { FiltroContactForm } from "./components/filter";
import { useNavigate } from "react-router-dom";
import { customLocale } from "@/utils/customLocale";

function Contacts() {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const {
    contacts,
    totalContacts,
    isModalOpen,
    showModal,
    closeModal,
    isLoading,
    contactsQuery,
    changeContactStatus,
    setRemoveContactIds,
    removeContacts,
  } = useContactsController();

  const {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedContact,
    setSelectedContact,
    currentPage,
    pageSize,
    totalItems,
    tableColumns,
    styles,
  } = useContactFilterController({ totalContacts });

  const rowSelection: TableProps<IContact>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IContact[]) => {
      console.log(selectedRowKeys);
      setRemoveContactIds(selectedRows.map((row) => row.id));
    },
    getCheckboxProps: (record: IContact) => ({
      name: String(record.id),
    }),
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 min-h-[833px] ">
          <div className="flex w-full justify-between mt-3 pb-4">
            <h1 className="text-[22px]">Mensagens</h1>
          </div>

          {/* Filtro */}
          <FiltroContactForm
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onClear={clearFilters}
            isFiltered={isFiltered}
            contactsQuery={contactsQuery}
            removeContacts={removeContacts}
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
            <div className="overflow-y-auto ">
              <Table<IContact>
                rowKey="id"
                rowSelection={rowSelection}
                className={styles.customTable}
                loading={isLoading}
                columns={tableColumns}
                dataSource={contacts}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedContact(record);
                    showModal();
                  },
                  style: { cursor: "pointer" },
                })}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                  showSizeChanger: true,
                  pageSizeOptions: ["50", "100", "200", "500"],
                  showLessItems: true,
                  onChange: (page, pageSize) => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", page.toString());
                    params.set("limit", pageSize.toString());
                    navigate(`?${params.toString()}`);
                  },
                  showTotal: (total) => `Total de ${total} contatos`,
                }}
              />
            </div>
          </ConfigProvider>


          <ContactInfoModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedId={selectedContact}
            changeContactStatus={changeContactStatus}
          />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default Contacts;
