import { CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";

export const EmpresasDisplay = ({ empresas }: { empresas: any }) => {
  const [tooltipTitle, setTooltipTitle] = useState("Copiar");

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code || "-");
    setTooltipTitle("Copiado!");
    setTimeout(() => setTooltipTitle("Copiar"), 2000);
  };

  if (!empresas || !Array.isArray(empresas) || empresas.length === 0) {
    const copyComponent = (
      <Tooltip
        styles={{ body: { fontSize: "11px" } }}
        title={tooltipTitle}
        trigger="hover"
        placement="top"
      >
        <div
          onClick={() => handleCopy("-")}
          className="text-[#666666] cursor-pointer"
        >
          <CopyOutlined style={{ fontSize: 12, color: "#8b8e8f" }} />
        </div>
      </Tooltip>
    );

    return (
      <div className="flex py-1 text-[14px] gap-2 text-neutral-700">
        <p>
          <strong>Empresas:</strong> -
        </p>
        {copyComponent}
      </div>
    );
  }

  const empresasFormatadas = empresas
    .map(
      (empresa: { cnpj: string; nome: string; porte: string }) =>
        `${empresa.cnpj}, ${empresa.nome}, ${empresa.porte}`,
    )
    .join("; \n");

  const copyComponent = (
    <Tooltip
      styles={{ body: { fontSize: "11px" } }}
      title={tooltipTitle}
      trigger="hover"
      placement="top"
    >
      <div
        onClick={() => handleCopy(empresasFormatadas)}
        className="text-[#666666] cursor-pointer"
      >
        <CopyOutlined style={{ fontSize: 12, color: "#8b8e8f" }} />
      </div>
    </Tooltip>
  );

  const maxLength = 50;

  return (
    <div className="flex py-1 text-[14px] gap-2 text-neutral-700">
      {empresasFormatadas.length > maxLength ? (
        <Tooltip
          styles={{ body: { fontSize: "12px" } }}
          title={
            <div style={{ whiteSpace: "pre-line" }}>{empresasFormatadas}</div>
          }
          trigger="hover"
          placement="top"
        >
          <p className="cursor-pointer">
            <strong>Empresas:</strong>{" "}
            {`${empresasFormatadas.substring(0, maxLength)}...`}
          </p>
        </Tooltip>
      ) : (
        <p>
          <strong>Empresas:</strong> {empresasFormatadas}
        </p>
      )}
      {copyComponent}
    </div>
  );
};
