import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TableColumnsType } from "antd";
import { useStyle } from "@/style/tableStyle";
import { useAllTableColumns } from "../components/tableColumns";
import { C6BankFilters, OrderC6Bank } from "@/interfaces/orders";

export function getFiltersFromURL(): C6BankFilters {
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get("page") || "1", 10);
  const per_page = parseInt(params.get("per_page") || "20", 10);
  const data_to =
    params.get("data_to") || params.get("data_ate") || undefined;
  const data_from =
    params.get("data_from") || params.get("data_de") || undefined;
  const status = params.get("status") || undefined;
  const phone = params.get("phone") || undefined;
  const cpf = params.get("cpf") || undefined;
  const cnpj = params.get("cnpj") || undefined;
  const order_number = params.get("order_number") || undefined;
  const order = params.get("order") as "asc" | "desc" | undefined;
  const sort = params.get("sort") || undefined;
  const after_sales_status = params.get("after_sales_status") || null;

  return {
    page, per_page, data_to, data_from, status, phone, cpf, cnpj, after_sales_status, order, sort, order_number,
  };
}

export function useAllOrdersFilterController() {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedOrder, setSelectedOrder] = useState<OrderC6Bank | null>(null);
  const [isModalAvatarOpen, setIsModalAvatarOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const currentPage = filters.page;
  const pageSize = filters.per_page;

  const { handleSubmit, reset, control } = useForm<C6BankFilters>({
    defaultValues: {
      page: currentPage,
      per_page: filters.per_page,
      data_to: filters.data_to,
      data_from: filters.data_from,
      status: filters.status,
      phone: filters.phone,
      cpf: filters.cpf,
      cnpj: filters.cnpj,
      order_number: filters.order_number,
      order: filters.order,
      sort: filters.sort,
      after_sales_status: filters.after_sales_status,
    },
  });

  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const onSubmit = (data: C6BankFilters) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (data.per_page) params.set("per_page", String(data.per_page));
    if (data.data_to) params.set("data_to", data.data_to);
    if (data.data_from) params.set("data_from", data.data_from);
    if (data.status) params.set("status", data.status);
    if (data.phone) {
      const phoneSemMascara = data.phone.replace(/\D/g, "");
      params.set("phone", phoneSemMascara);
    }
    if (data.after_sales_status)
      params.set("after_sales_status", data.after_sales_status);
    if (data.cpf) {
      const cpfSemMascara = data.cpf.replace(/\D/g, "");
      params.set("cpf", cpfSemMascara);
    }
    if (data.cnpj) {
      const cnpjSemMascara = data.cnpj.replace(/\D/g, "");
      params.set("cnpj", cnpjSemMascara);
    }

    if (data.order_number) params.set("order_number", String(data.order_number));
    if (data.order) params.set("order", data.order);
    if (data.sort) params.set("sort", data.sort);
    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    reset();
    navigate("");
    setIsFiltered(false);
  };

  const { styles } = useStyle();

  const allTableColumns: TableColumnsType<OrderC6Bank> = useAllTableColumns({
    setSelectedAvatar,
    setIsModalAvatarOpen,
  });

  const alwaysVisibleKeys = ["consultant_observation", "whatsapp,avatar"];

  const allColumnOptions = allTableColumns
    .filter(
      (col) =>
        "dataIndex" in col &&
        !alwaysVisibleKeys.includes(String(col.dataIndex)),
    )
    .map((col) => ({
      label:
        typeof col.title === "function"
          ? String(col.key || ("dataIndex" in col ? col.dataIndex : ""))
          : String(col.title),
      value: String(col.key || ("dataIndex" in col ? col.dataIndex : "")),
    }));

  const selectableKeys = allTableColumns
    .filter(
      (col) =>
        "dataIndex" in col &&
        !alwaysVisibleKeys.includes(String(col.dataIndex)),
    )
    .map((col) => String(col.key || ("dataIndex" in col ? col.dataIndex : "")));

  const [visibleColumns, setVisibleColumns] =
    useState<string[]>(selectableKeys);
  const handleColumnsChange = (checkedValues: string[]) => {
    setVisibleColumns(checkedValues);
  };

  const columns = [
    ...allTableColumns.filter(
      (col) =>
        "dataIndex" in col && alwaysVisibleKeys.includes(String(col.dataIndex)),
    ),
    ...allTableColumns.filter(
      (col) =>
        "dataIndex" in col &&
        !alwaysVisibleKeys.includes(String(col.dataIndex)) &&
        visibleColumns.includes(
          String(col.key || ("dataIndex" in col ? col.dataIndex : "")),
        ),
    ),
  ];

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedOrder,
    setSelectedOrder,
    currentPage,
    pageSize,
    columns,
    styles: { customTable: styles.customTable },
    allColumnOptions,
    visibleColumns,
    handleColumnsChange,
    isModalAvatarOpen,
    setIsModalAvatarOpen,
    selectedAvatar,
  };
}
