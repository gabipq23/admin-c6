import { outlineButtonClass, redOutlineButtonClass } from "@/utils/buttonStyles";
import { Button } from "antd";

interface FooterButtonsProps {
  onGeneratePDF: () => void;
  onEdit: () => void;
  onDelete: () => void;
  generatePDFText?: string;
  editText?: string;
  deleteText?: string;
}

export default function FooterButtons({
  onGeneratePDF,
  onEdit,
  onDelete,
  generatePDFText = "Gerar PDF",
  editText = "Editar",
  deleteText = "Deletar pedido",
}: FooterButtonsProps) {
  return (
    <>
      <div className="mt-4 flex gap-4 justify-end">
        <Button onClick={onGeneratePDF} className={outlineButtonClass}>
          {generatePDFText}
        </Button>
        <Button
          onClick={onEdit}
          className={outlineButtonClass}

          style={{
            color: "#242424",
            fontSize: "14px",
          }}
        >
          {editText}
        </Button>
        <Button
          onClick={onDelete}

          className={redOutlineButtonClass}
          style={{
            fontSize: "14px",
          }}
        >
          {deleteText}
        </Button>
      </div>
    </>
  );
}
