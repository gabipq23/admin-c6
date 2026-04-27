import { ConfigProvider, Input, Select } from "antd";

export default function HeaderInputs({
  localData,
  setLocalData,
  selectedId,
  updateDataIdCRMAndConsultorResponsavel,
  changeBandaLargaOrderStatus,
  consultor,
  setConsultor,
  idCRM,
  setIdCRM,
  statusOptions,
  updateOrderData,
  setCredito,
  credito,
  idCORP,
  setIdCORP
}: any) {
  return (
    <>
      <div className="flex  flex-col md:flex-row lg:flex-row gap-4 mg:items-start lg:items-start justify-between">
        <span style={{ color: "#252525" }}>
          Pedido Nº {localData.order_number || localData.id}
        </span>
        <div className="flex flex-col  flex-wrap items-center gap-4 ">
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  hoverBorderColor: "#242424",
                  activeBorderColor: "#242424",
                  activeOutlineColor: "none",
                },
                Input: {
                  hoverBorderColor: "#242424",
                  activeBorderColor: "#242424",
                },
              },
            }}
          >
            <div className="flex items-start justify-start self-start gap-4 mr-8">
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Consultor:</span>
                <Input
                  size="small"
                  placeholder="Consultor"
                  style={{
                    width: "240px",
                    fontWeight: "400",
                  }}
                  maxLength={13}
                  value={consultor}
                  onChange={(e) => setConsultor(e.target.value)}
                  onPressEnter={() => {
                    updateDataIdCRMAndConsultorResponsavel(selectedId?.id, {
                      responsible_consultant: consultor,
                    });
                  }}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">ID CORP: </span>
                <Input
                  size="small"
                  value={idCORP}
                  placeholder="ID CORP"
                  style={{
                    width: "120px",
                    fontWeight: "400",
                  }}
                  maxLength={8}
                  onChange={(e) => setIdCORP(e.target.value)}
                  onPressEnter={() => {
                    updateDataIdCRMAndConsultorResponsavel(selectedId?.id, {
                      corporate_id: String(idCORP || ""),
                    });
                  }}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold"> ID CRM: </span>
                <Input
                  size="small"
                  value={idCRM}
                  placeholder="ID CRM"
                  style={{
                    width: "120px",
                    fontWeight: "400",
                  }}
                  maxLength={8}
                  onChange={(e) => setIdCRM(e.target.value)}
                  onPressEnter={() => {
                    updateDataIdCRMAndConsultorResponsavel(selectedId?.id, {
                      crm_id: String(idCRM || ""),
                    });
                  }}
                />
              </div>
            </div>

            <div className="flex items-start justify-start gap-4 self-start mr-8">
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Pedido:</span>
                <Select
                  size="small"
                  style={{ width: 110 }}
                  value={localData?.status}
                  onChange={(value) => {
                    setLocalData((prev: any) =>
                      prev ? { ...prev, status: value } : null,
                    );
                    changeBandaLargaOrderStatus({
                      id: selectedId?.id,
                      data: { status: value },
                    });
                  }}
                  options={[
                    { value: "ABERTO", label: "Aberto" },
                    { value: "FECHADO", label: "Fechado" },
                    { value: "CANCELADO", label: "Cancelado" },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Tramitação: </span>
                <Select
                  placeholder="Selecione o status"
                  size="small"
                  value={localData?.after_sales_status}
                  style={{
                    width: "340px",
                    fontWeight: "400",
                  }}
                  onChange={(value) => {
                    setLocalData((prev: any) =>
                      prev ? { ...prev, after_sales_status: value } : null,
                    );
                    updateOrderData({
                      id: selectedId?.id,
                      data: { pedido: { after_sales_status: value } },
                    });
                  }}
                  options={statusOptions?.map((status: string) => ({
                    value: status,
                    label: status,
                  }))}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Equipe:</span>
                <span className="font-normal">{selectedId?.team || "-"}</span>
              </div>
            </div>

            <div className="flex items-start justify-start gap-4 self-start mr-8">
              {/* <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Crédito:</span>
                <Input
                  size="small"
                  value={credito}
                  placeholder="Crédito"
                  style={{
                    width: "110px",
                    fontWeight: "400",
                  }}
                  maxLength={13}
                  onChange={(e) => setCredito(e.target.value)}
                  onPressEnter={() => {
                    const normalizedCredit = Number(
                      String(credito ?? "")
                        .replace(/\s+/g, "")
                        .replace(",", "."),
                    );

                    updateDataIdCRMAndConsultorResponsavel(selectedId?.id, {
                      credit: Number.isNaN(normalizedCredit)
                        ? 0
                        : normalizedCredit,
                    });
                  }}
                />
              </div> */}
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Atendimento: </span>
                <Select
                  placeholder=""
                  size="small"
                  value={localData?.service}
                  style={{
                    width: "200px",
                    fontWeight: "400",
                  }}
                  onChange={(value) => {
                    setLocalData((prev: any) =>
                      prev ? { ...prev, service: value } : null,
                    );
                    updateOrderData({
                      id: selectedId?.id,
                      data: { pedido: { service: value } },
                    });
                  }}
                  options={[
                    { value: "em_andamento", label: "Em Andamento" },
                    { value: "concluido", label: "Concluído" },
                  ]}
                />
              </div>
              {/* <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Instalação:</span>
                <span className="font-normal">
                  {selectedId?.installation || "-"}
                </span>
              </div> */}
            </div>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}
