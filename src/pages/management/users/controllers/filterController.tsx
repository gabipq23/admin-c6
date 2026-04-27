import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TableColumnsType, Tooltip } from "antd";
import { createStyles } from "antd-style";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCPF } from "@/utils/formatCPF";

function getFiltersFromURL(): {
  nome: string | null;
  email: string | null;
  nivel_acesso?: string | null;
  page: number;
  limit: number;
  sort?: string | null;
  order?: "asc" | "desc" | null;
} {
  const params = new URLSearchParams(window.location.search);

  const nome = params.get("nome") || null;
  const email = params.get("email") || null;
  const nivel_acesso = params.get("nivel_acesso") || null;
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "100", 10);
  const sort = params.get("sort") || null;
  const order = params.get("order") as "asc" | "desc" | null;
  return {
    nome,
    email,
    nivel_acesso,
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

export function useUsersFilterController() {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const currentPage = filters.page;
  const pageSize = filters.limit;

  const { handleSubmit, reset, control } = useForm<any>({
    defaultValues: {
      nome: "",
      email: "",
      nivel_acesso: "",
      sort: "",
      order: undefined,
    },
    values: filters,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: any) => {
    const params = new URLSearchParams();
    if (data.nome) params.set("nome", data.nome);
    if (data.email) params.set("email", data.email);
    if (data.nivel_acesso) params.set("nivel_acesso", data.nivel_acesso);
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
      dataIndex: "whatsapp",
      width: 100,
      render: (value) => (value ? formatPhoneNumber(value) : "-"),
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      width: 120,
      render: (value) => (value ? formatCPF(value) : "-"),
    },
    {
      title: "Nível de Acesso",
      dataIndex: "nivel_acesso",
      width: 140,
    },
  ];

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedUser,
    setSelectedUser,
    currentPage,
    pageSize,
    tableColumns,
    styles: { customTable: styles.customTable },
  };
}
