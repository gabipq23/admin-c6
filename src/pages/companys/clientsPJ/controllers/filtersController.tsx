import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ICompany, ICompanyFilter } from "@/interfaces/consult";

function getFiltersFromURL(): {
  is_mei?: boolean;
  credit_min?: number;
  credit_max?: number;
  cnpj?: string;
  company_legal_name?: string;
  rfb_status?: string;
  page: number;
  per_page: number;
  sort?: string;
  order?: "asc" | "desc";
} {
  const params = new URLSearchParams(window.location.search);
  const cnpj = params.get("npj") || undefined;
  const company_legal_name = params.get("company_legal_name") || undefined;
  const rfb_status = params.get("rfb_status") || undefined;
  const is_mei_param = params.get("is_mei");
  const is_mei = is_mei_param ? is_mei_param === "true" : undefined;
  const credit_min_param = params.get("credito_min");
  const credit_min = credit_min_param
    ? parseInt(credit_min_param, 10)
    : undefined;
  const credit_max_param = params.get("credito_max");
  const credit_max = credit_max_param
    ? parseInt(credit_max_param, 10)
    : undefined;
  const sort = params.get("sort") || undefined;
  const order = (params.get("order") as "asc" | "desc" | null) || undefined;
  const page = parseInt(params.get("page") || "1", 10);
  const per_page = parseInt(params.get("per_page") || "100", 10);

  return {
    cnpj,
    company_legal_name,
    rfb_status,
    is_mei,
    credit_min,
    credit_max,
    page,
    per_page,
    sort,
    order,
  };
}

export function useClientsFilterController() {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedClient, setSelectedClient] = useState<ICompany | null>(null);

  const currentPage = filters.page;
  const pageSize = filters.per_page;

  const { handleSubmit, reset, control } = useForm<ICompanyFilter>({
    defaultValues: filters,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: ICompanyFilter) => {
    const params = new URLSearchParams();
    if (data.cnpj) {
      const cnpjSemMascara = data.cnpj.replace(/\D/g, "");
      params.set("cnpj", cnpjSemMascara);
    }

    params.set("page", "1");
    params.set("per_page", "100");
    if (data.company_legal_name) params.set("company_legal_name", data.company_legal_name);
    if (data.rfb_status)
      params.set("rfb_status", data.rfb_status);
    if (data.is_mei) params.set("is_mei", data.is_mei.toString());

    if (data.credit_min)
      params.set("credit_min", data.credit_min.toString());
    if (data.credit_max)
      params.set("credit_max", data.credit_max.toString());
    ;
    if (data.sort) params.set("sort", data.sort);

    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    reset({
      cnpj: undefined,
      company_legal_name: undefined,
      rfb_status: undefined,
      is_mei: undefined,
      credit_min: undefined,
      credit_max: undefined,
      sort: undefined,
      order: undefined,

    });
    navigate("");
    setIsFiltered(false);
  };

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedClient,
    setSelectedClient,
    currentPage,
    pageSize,
  };
}
