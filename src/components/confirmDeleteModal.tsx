import { outlineButtonClass, redOutlineButtonClass } from "@/utils/buttonStyles";
import { Button, Modal } from "antd";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message: string;
  itemToDelete?: string | number;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDanger?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Confirmar exclusão",
  message,
  itemToDelete,
  confirmButtonText = "Confirmar exclusão",
  cancelButtonText = "Cancelar",
  isDanger = true,
}: ConfirmDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      centered
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} className={outlineButtonClass}>
          {cancelButtonText}
        </Button>,
        <Button
          key="confirm"

          danger={isDanger}
          loading={isLoading}
          onClick={handleConfirm}
          className={redOutlineButtonClass}
        >
          {confirmButtonText}
        </Button>,
      ]}
      title={title}
    >
      {message}
      {itemToDelete && <b> {itemToDelete}</b>}?
    </Modal>
  );
}
