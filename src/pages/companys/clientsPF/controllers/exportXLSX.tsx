import { formatBRL } from "@/utils/formatBRL";
import * as XLSX from "xlsx";

export const handleExportXLSX = ({
  companies,
  selectedRowKeys,
  visibleColumns,
  tableColumns,
}: any) => {
  const selectedRows = companies.filter((row: any) =>
    selectedRowKeys.includes(row.id)
  );

  const exportColumns = tableColumns.filter((col: any) =>
    visibleColumns.includes(col.key as string)
  );

  const exportData = selectedRows.map((row: any) => {
    const obj: Record<string, any> = {};

    exportColumns.forEach((col: any) => {
      if (col.key === "credit") {
        obj[col.title as string] = formatBRL(row.credit);


      } else if (col.key === "is_mei") {
        obj[col.title as string] =
          row.is_mei === true || row.is_mei === "1"
            ? "Sim"
            : "Não";
      } else {
        obj[col.title as string] =
          row[col.dataIndex as keyof typeof row] ??
          row[col.key as keyof typeof row] ??
          "-";
      }
    });

    return obj;
  });

  const sheet = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Clientes");
  XLSX.writeFile(wb, "clientes.xlsx");
};
