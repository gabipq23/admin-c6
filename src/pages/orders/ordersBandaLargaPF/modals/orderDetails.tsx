import { ConfigProvider, Modal, Form } from "antd";
import { useState, useEffect } from "react";

import HeaderInputs from "../../../../components/orders/headerInputs";
import dayjs from "dayjs";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import FooterButtons from "@/components/orders/footerButtons";
import { generatePDF } from "../controllers/exportPDF";
import { OrderDisplay } from "./BLPFDisplay";
import { OrderEdit } from "./BLPFEdit";
import { OrderC6Bank } from "@/interfaces/orders";

export function OrderDetailsModal({
  isModalOpen,
  closeModal,
  selectedId,
  updateOrderData,
  removeOrderData,
  isRemoveOrderFetching,
  changeOrderStatus,
  statusOptions,
  updateDataIdCRMAndConsultorResponsavel
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedId: OrderC6Bank | null;
  updateOrderData?: (params: { id: number; data: any }) => void;
  removeOrderData: any;
  isRemoveOrderFetching: boolean;
  changeOrderStatus: any;
  statusOptions: string[] | undefined;
  updateDataIdCRMAndConsultorResponsavel: any
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState<OrderC6Bank | null>(null);
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultor, setConsultor] = useState<string>("");
  const [idVivo, setIdVivo] = useState<string>("");
  const [idCRM, setIdCRM] = useState<string>("");
  const [idCORP, setIdCORP] = useState<string>("");
  const [credito, setCredito] = useState<number | string>(0);

  useEffect(() => {
    if (selectedId) {
      setLocalData(selectedId);
    }
  }, [selectedId]);




  useEffect(() => {
    setConsultor(localData?.responsible_consultant
      || "");

    setIdCORP(localData?.corporate_id ? String(localData.corporate_id) : "");
    setIdCRM(localData?.crm_id ? String(localData.crm_id) : "");

  }, [selectedId, localData]);

  useEffect(() => {
    if (localData && isEditing) {
      const addressComplement = localData.address_complement || null;
      form.setFieldsValue({
        full_name: localData.full_name,
        cpf: localData.cpf,
        phone: localData.phone,
        email: localData.email,
        address: localData.address,
        address_number: localData.address_number,
        address_complement: {
          lot: addressComplement?.lot || "",
          block: addressComplement?.block || "",
          floor: addressComplement?.floor || "",
          square: addressComplement?.square || "",
          unit_type: addressComplement?.unit_type || "",
          unit_number: addressComplement?.unit_number || "",
          building_or_house: addressComplement?.building_or_house || "house",
          home_complement: addressComplement?.home_complement || "",
          reference_point: addressComplement?.reference_point || "",
        },

        district: localData.district,
        city: localData.city,
        state: localData.state,
        zip_code: localData.zip_code,
        single_zip_code: localData.single_zip_code,



        url: localData.url,
        status: localData.status,
      });
    }
  }, [localData, isEditing, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const addressComplement = {
        lot: values.address_complement?.lot ?? null,
        block:
          values.address_complement?.block ??
          values.address_complement?.square ??
          null,
        floor: values.address_complement?.floor ?? null,
        square: values.address_complement?.square ?? null,
        unit_type: values.address_complement?.unit_type ?? null,
        unit_number: values.address_complement?.unit_number ?? null,
        building_or_house:
          values.address_complement?.building_or_house ||
          localData?.address_complement?.building_or_house ||

          "house",
        home_complement: values.address_complement?.home_complement ?? null,
        reference_point: values.address_complement?.reference_point ?? null,
      };

      const normalizedValues = {
        ...values,
        full_name: values.full_name,
        birth_date: values.birth_date,
        mother_full_name: values.mother_full_name,
        additional_phone: values.additional_phone,
        address_number: values.address_number,
        address_complement: addressComplement,
        address_lot: addressComplement.lot,
        address_reference_point: addressComplement.reference_point,
        wants_esim: values.wants_esim,
        line_number_informed: values.line_number_informed,
        line_action: values.line_action,
        address_floor: addressComplement.floor,
        address_block: addressComplement.square,
        building_or_house: addressComplement.building_or_house,
        zip_code: values.zip_code,
        single_zip_code: values.single_zip_code,
        due_day: typeof values.due_day === "number" ? String(values.due_day) : values.due_day,
      };


      if (normalizedValues.installation_preferred_date_one) {
        normalizedValues.installation_preferred_date_one = dayjs(
          normalizedValues.installation_preferred_date_one,
        ).format("DD/MM/YYYY");
      }
      if (normalizedValues.installation_preferred_date_two) {
        normalizedValues.installation_preferred_date_two = dayjs(
          normalizedValues.installation_preferred_date_two,
        ).format("DD/MM/YYYY");
      }
      const formattedData: any = {
        ...normalizedValues,

      };

      if (updateOrderData && localData && localData.id) {
        await updateOrderData({
          id: localData.id,
          data: formattedData,
        });

        setLocalData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            ...normalizedValues,

            price_summary: formattedData.price_summary,

          };
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao validar campos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedId) {
      setLocalData(selectedId);
    }
    form.resetFields();
  };

  if (!localData) return null;

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBorderColor: "#242424",
            activeBorderColor: "#242424",
            activeShadow: "none",
            colorBorder: "#bfbfbf",
            colorTextPlaceholder: "#666666",
          },
          Select: {
            hoverBorderColor: "#242424",
            activeBorderColor: "#242424",
            activeOutlineColor: "none",
            colorBorder: "#bfbfbf",
            colorTextPlaceholder: "#666666",
          },
          Button: {
            colorBorder: "#242424",
            colorText: "#242424",
            colorPrimary: "#242424",
            colorPrimaryHover: "#242424",
          },
        },
      }}
    >
      <Modal
        centered
        title={
          <HeaderInputs
            updateOrderData={updateOrderData}
            localData={localData}
            setLocalData={setLocalData}
            selectedId={selectedId}
            statusOptions={statusOptions}
            changeOrderStatus={changeOrderStatus}
            consultor={consultor}
            setConsultor={setConsultor}
            idVivo={idVivo}
            setIdVivo={setIdVivo}
            idCRM={idCRM}
            setIdCRM={setIdCRM}
            credito={credito}
            setCredito={setCredito}
            idCORP={idCORP}
            setIdCORP={setIdCORP}
            updateDataIdCRMAndConsultorResponsavel={updateDataIdCRMAndConsultorResponsavel}
          />
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={1200}
      >
        <div className="text-[#666666] mt-4 h-[460px] overflow-y-auto scrollbar-thin">
          {isEditing ? (
            <OrderEdit
              localData={localData}
              form={form}
              handleSave={handleSave}
              handleCancel={handleCancel}
              loading={loading}
            />
          ) : (
            <OrderDisplay
              localData={localData}
              updateOrderData={updateOrderData}
            />
          )}
        </div>
        <div className="mt-4 flex gap-4 justify-end">
          {!isEditing && (
            <FooterButtons
              onGeneratePDF={() => generatePDF(localData)}
              onEdit={() => setIsEditing(true)}
              onDelete={() => setShowDeleteModal(true)}
            />
          )}
        </div>
      </Modal>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          removeOrderData({ id: selectedId?.id });
          closeModal();
        }}
        isLoading={isRemoveOrderFetching}
        message="Tem certeza que deseja excluir o pedido"
        itemToDelete={selectedId?.order_number || selectedId?.id}
      />
    </ConfigProvider>
  );
}
