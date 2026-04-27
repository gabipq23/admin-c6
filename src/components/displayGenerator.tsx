import { CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
type DisplayGeneratorProps = {
  title: string;
  value: string | undefined | null;
  maxLength?: number;
};
export default function DisplayGenerator({
  title,
  value,
  maxLength,
}: DisplayGeneratorProps) {
  const [tooltipTitle, setTooltipTitle] = useState("Copiar");
  const handleCopy = (
    code: string,
    setTooltip: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    navigator.clipboard.writeText(code || "-");
    setTooltip("Copiado!");
    setTimeout(() => setTooltip("Copiar"), 2000);
  };

  const copyComponent = (text: string) => {
    return (
      <Tooltip
        styles={{ body: { fontSize: "11px" } }}
        title={tooltipTitle}
        trigger="hover"
        placement="top"
      >
        <div
          onClick={() => handleCopy(text, setTooltipTitle)}
          className="text-[#666666] cursor-pointer"
        >
          <CopyOutlined style={{ fontSize: 12, color: "#8b8e8f" }} />
        </div>
      </Tooltip>
    );
  };
  return (
    <div className="flex py-1 text-[14px] gap-2 text-neutral-700">
      {maxLength && value && value.length > maxLength ? (
        <Tooltip
          styles={{ body: { fontSize: "12px" } }}
          title={value}
          trigger="hover"
          placement="top"
        >
          <p className="cursor-pointer">
            <strong>{title}</strong> {`${value.substring(0, maxLength)}...`}
          </p>
        </Tooltip>
      ) : (
        <p>
          <strong>{title}</strong> {value || "-"}
        </p>
      )}

      {copyComponent(value || "-")}
    </div>
  );
}
