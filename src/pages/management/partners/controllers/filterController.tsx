import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TableColumnsType, Tooltip } from "antd";
import { createStyles } from "antd-style";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCNPJ } from "@/utils/formatCNPJ";
function getFiltersFromURL(): {
  cnpj?: string | null;
  razao_social?: string | null;
  page: number;
  limit: number;
  sort?: string | null;
  order?: "asc" | "desc" | null;
} {
  const params = new URLSearchParams(window.location.search);
  const cnpj = params.get("cnpj") || null;
  const razao_social = params.get("razao_social") || null;

  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "100", 10);
  const sort = params.get("sort") || null;
  const order = params.get("order") as "asc" | "desc" | null;
  return {
    cnpj,
    razao_social,

    page,
    limit,
    sort,
    order,
  };
}

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table-container .ant-table-body,
      .ant-table-container .ant-table-content {
        scrollbar-width: thin;
        scrollbar-color: #eaeaea transparent;
        scrollbar-gutter: stable;
      }
      /* Diminui fonte do header */
      .ant-table-thead > tr > th {
        font-size: 12px !important;
      }
      /* Diminui fonte do body */
      .ant-table-tbody > tr > td {
        font-size: 12px !important;
      }
      /* Cor de fundo do header */
      .ant-table-thead > tr > th {
        background: #e9e9e9 !important;
      }
      /* Cor de fundo do body */
      .ant-table-tbody > tr > td {
        background: #fff !important;
      }
      /* Destaca a linha ao passar o mouse (mantém o efeito padrão do Ant Design) */
      .ant-table-tbody > tr.ant-table-row:hover > td {
        background: #e9e9e9 !important;
      }
      .ant-table-pagination {
        display: flex;
        justify-content: center;
        margin-top: 16px; /* opcional: dá um espaçamento
        colorText: "#242424",
        colorTextActive: "#550088", */
      }
    `,
  };
});

export function usePartnersFilterController() {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const currentPage = filters.page;
  const pageSize = filters.limit;

  const { handleSubmit, reset, control } = useForm<any>({
    defaultValues: {
      cnpj: "",
      razao_social: "",

      sort: "",
      order: undefined,
    },
    values: filters,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: any) => {
    const params = new URLSearchParams();
    if (data.cnpj) params.set("cnpj", data.cnpj);
    if (data.razao_social) params.set("razao_social", data.razao_social);

    params.set("page", "1");
    params.set("limit", "100");
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

  const tableColumns: TableColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "CNPJ",
      dataIndex: "cnpj",
      width: 120,
      render: (value) => (value ? formatCNPJ(value) : "-"),
    },
    {
      title: "Razão Social",
      dataIndex: "razao_social",
      width: 110,
      ellipsis: {
        showTitle: false,
      },
      render: (razao_social) => (
        <Tooltip
          placement="topLeft"
          title={razao_social}
          styles={{ body: { fontSize: "12px" } }}
        >
          {razao_social}
        </Tooltip>
      ),
    },
    {
      title: "Nome",
      dataIndex: "nome",
      width: 110,
      ellipsis: {
        showTitle: false,
      },
      render: (nome) => (
        <Tooltip
          placement="topLeft"
          title={nome}
          styles={{ body: { fontSize: "12px" } }}
        >
          {nome}
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (email) => (
        <Tooltip
          placement="topLeft"
          title={email}
          styles={{ body: { fontSize: "12px" } }}
        >
          {email}
        </Tooltip>
      ),
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
      width: 100,
      render: (value) => (value ? formatPhoneNumber(value) : "-"),
    },
  ];

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedPartner,
    setSelectedPartner,
    currentPage,
    pageSize,
    tableColumns,
    styles: { customTable: styles.customTable },
  };
}
