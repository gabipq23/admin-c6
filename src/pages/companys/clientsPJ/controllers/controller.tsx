import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ClientsService } from "@/services/clients";
import { Button, TableColumnsType, Tooltip } from "antd";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useNavigate } from "react-router-dom";
import { capitalizeWords } from "@/utils/capitaliWords";
import { ICompany, ICompanyResponse } from "@/interfaces/consult";
import { useStyle } from "@/style/tableStyle";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  MapIcon,
  MapPinned,
  Mars,
  Venus,
  XCircle,
} from "lucide-react";
import { formatCPF } from "@/utils/formatCPF";

const clietsService = new ClientsService();

export function useClientsController() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const { styles } = useStyle();
  const parsedIsMei =
    filters.is_mei === "true" ? true : filters.is_mei === "false" ? false : undefined;
  const parsedCreditMin =
    filters.credit_min !== undefined && filters.credit_min !== ""
      ? Number(filters.credit_min)
      : undefined;
  const parsedCreditMax =
    filters.credit_max !== undefined && filters.credit_max !== ""
      ? Number(filters.credit_max)
      : undefined;

  function formatBRL(value: number | string | null | undefined) {
    if (value === null || value === undefined || value === "") return "";
    return `R$ ${Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`;
  }
  const { data: clientsQuery, isFetching: isClientsFetching } =
    useQuery<ICompanyResponse>({
      refetchOnWindowFocus: false,
      queryKey: [
        "clients",
        filters.page || 1,
        filters.per_page || 100,
        filters.sort || "cnpj",
        filters.order || "desc",
        filters.cnpj || "",
        filters.rfb_status || "",
        filters.company_legal_name || "",
        parsedIsMei,
        filters.client_type || "",
        parsedCreditMin,
        parsedCreditMax,

      ],

      queryFn: async (): Promise<ICompanyResponse> => {
        const response = await clietsService.allCompanyList({
          page: filters.page || 1,
          per_page: filters.per_page || 100,
          cnpj: filters.cnpj || "",
          rfb_status: filters.rfb_status || "",
          company_legal_name: filters.company_legal_name || "",
          is_mei: parsedIsMei,
          client_type: filters.client_type || "",
          credit_min: parsedCreditMin,
          credit_max: parsedCreditMax,
          sort: filters.sort || "cnpj",
          order:
            filters.order === "asc" || filters.order === "desc"
              ? filters.order
              : "desc",
        });
        return response;
      },
    });


  const { mutate: removeClients } = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      clietsService.removeClient(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["clients"] }),
    onError: (error) => {
      toast.error("Houve um erro ao remover o cliente. Tente novamente");
      console.error(error.message);
    },
    onSuccess: () => {
      toast.success("Cliente removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const tableColumns: TableColumnsType<ICompany> = [
    {
      title: "CNPJ",
      dataIndex: "cnpj",
      width: 140,
      render: (cnpj) => (cnpj ? formatCNPJ(cnpj) : "-"),
      filters: [
        {
          text: "Preenchido",
          value: "preenchido",
        },
        {
          text: "Vazio",
          value: "vazio",
        },
      ],

      onFilter: (value, record) => {
        if (value === "preenchido") {
          return (
            record.cnpj !== null &&
            record.cnpj !== undefined &&
            record.cnpj !== ""
          );
        }
        if (value === "vazio") {
          return (
            record.cnpj === null ||
            record.cnpj === undefined ||
            record.cnpj === ""
          );
        }
        return true;
      },
    },
    {
      title: "Razão Social ",
      dataIndex: "company_legal_name",
      ellipsis: {
        showTitle: false,
      },
      render: (company_legal_name) => (
        <Tooltip
          placement="topLeft"
          title={capitalizeWords(company_legal_name)}
          styles={{ body: { fontSize: "12px" } }}
        >
          {capitalizeWords(company_legal_name) || "-"}
        </Tooltip>
      ),
      width: 150,
    },
    {
      title: "Nome",
      dataIndex: "manager_name",
      ellipsis: {
        showTitle: false,
      },
      render: (manager_name, record) => {
        const compareNames = (name1: string | null | undefined, name2: string | null | undefined) => {
          if (!name1 || !name2) return null;

          const normalizeText = (text: string) => {
            return text
              .toLowerCase()
              .trim()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
          };

          return normalizeText(name1) === normalizeText(name2);
        };

        const isNamesMatch = compareNames(manager_name, record.rfb_name
        );

        return (
          <>
            {manager_name ? (
              <span className="flex items-center gap-1">
                {manager_name}
                {isNamesMatch === true ? (
                  <Tooltip
                    title="Nome confere com RFB"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </Tooltip>
                ) : isNamesMatch === false ? (
                  <Tooltip
                    title="Nome diferente da RFB"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                  </Tooltip>
                ) : null}
              </span>
            ) : (
              "-"
            )}
          </>
        );
      },
      width: 240,
    },

    {
      title: "CPF",
      dataIndex: "cpf",
      width: 120,
      render: (cpf) => (cpf ? formatCPF(cpf) : "-"),
      filters: [
        {
          text: "Preenchido",
          value: "preenchido",
        },
        {
          text: "Vazio",
          value: "vazio",
        },
      ],

      onFilter: (value, record) => {
        if (value === "preenchido") {
          return (
            record.cpf !== null && record.cpf !== undefined && record.cpf !== ""
          );
        }
        if (value === "vazio") {
          return (
            record.cpf === null || record.cpf === undefined || record.cpf === ""
          );
        }
        return true;
      },
    },

    {
      title: "Gênero",
      dataIndex: "rfb_gender",
      width: 80,
      render: (rfb_gender) =>
        rfb_gender === "M" ? (
          <div className="flex items-center justify-center">
            <Mars color="blue" size={17} />
          </div>
        ) : rfb_gender === "F" ? (
          <div className="flex items-center justify-center">
            <Venus color="magenta" size={18} />
          </div>
        ) : (
          <div className="flex items-center justify-center">-</div>
        ),
    },
    {
      title: "Data de Nascimento",
      dataIndex: "birth_date",
      width: 150,
      render: (birth_date, record) => {
        const compareDates = (date1: string | null | undefined, date2: string | null | undefined) => {
          if (!date1 || !date2) return null;
          return date1.trim() === date2.trim();
        };

        const isDatesMatch =
          birth_date && birth_date !== "00/00/0000"
            ? compareDates(birth_date, record.rfb_birth_date
            )
            : null;

        return (
          <span className="flex items-center gap-1">
            {birth_date && birth_date !== "00/00/0000" ? birth_date : "-"}
            {isDatesMatch === true ? (
              <Tooltip
                title="Data de nascimento confere com RFB"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </Tooltip>
            ) : isDatesMatch === false ? (
              <Tooltip
                title="Data de nascimento diferente da RFB"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Tooltip>
            ) : null}
          </span>
        );
      },
    },

    {
      title: "Nome da Mãe",
      dataIndex: "mother_full_name",
      ellipsis: {
        showTitle: false,
      },
      render: (mother_full_name, record) => {
        const compareNames = (name1: string | null | undefined, name2: string | null | undefined) => {
          if (!name1 || !name2) return null;

          const normalizeText = (text: string) => {
            return text
              .toLowerCase()
              .trim()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
          };

          return normalizeText(name1) === normalizeText(name2);
        };

        const isNamesMatch = compareNames(
          mother_full_name,
          record.rfb_mother_name,
        );

        return (
          <>
            {mother_full_name ? (
              <span className="flex items-center gap-1">
                {mother_full_name}
                {isNamesMatch === true ? (
                  <Tooltip
                    title="Nome da mãe confere com RFB"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </Tooltip>
                ) : isNamesMatch === false ? (
                  <Tooltip
                    title="Nome da mãe diferente da RFB"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                  </Tooltip>
                ) : null}
              </span>
            ) : (
              "-"
            )}
          </>
        );
      },
      width: 220,
    },


    {
      title: "MEI",
      dataIndex: "is_mei",
      width: 70,
      render: (is_mei) =>
        is_mei ? "Sim" : is_mei === undefined || is_mei === null ? "-" : "Não",
    },
    {
      title: "Sócio",
      dataIndex: "is_socio",
      width: 70,
      render: (is_socio) =>
        is_socio
          ? "Sim"
          : is_socio === undefined || is_socio === null
            ? "-"
            : "Não",
    },
    {
      title: "Empresas",
      dataIndex: "company_partners",
      width: 210,
      ellipsis: {
        showTitle: false,
      },
      render: (company_partners) => {
        if (!company_partners || company_partners.length === 0) {
          return "-";
        }

        const empresasFormatadas = company_partners
          .map(
            (empresa: { cnpj: string; nome: string; porte: string }) =>
              `${empresa.cnpj}, ${empresa.nome}, ${empresa.porte}`,
          )
          .join("; \n");

        return (
          <Tooltip
            placement="topLeft"
            title={
              <div style={{ whiteSpace: "pre-line" }}>{empresasFormatadas}</div>
            }
            styles={{ body: { fontSize: "12px" } }}
          >
            {empresasFormatadas}
          </Tooltip>
        );
      },
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      width: 150,
      render: (_, record) => {
        if (!record.phone) return "-";

        const isValid = record.phone_valid;

        return (
          <span className="flex items-center gap-1">
            {formatPhoneNumber(record.phone)}
            {isValid === true ? (
              <Tooltip
                title="Válido na ANATEL"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </Tooltip>
            ) : isValid === false ? (
              <Tooltip
                title="Inválido na ANATEL"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Tooltip>
            ) : null}
          </span>
        );
      },
      filters: [
        {
          text: "Preenchido",
          value: "preenchido",
        },
        {
          text: "Vazio",
          value: "vazio",
        },
      ],

      onFilter: (value, record) => {
        if (value === "preenchido") {
          return (
            record.phone !== null &&
            record.phone !== undefined &&
            record.phone !== ""
          );
        }
        if (value === "vazio") {
          return (
            record.phone === null ||
            record.phone === undefined ||
            record.phone === ""
          );
        }
        return true;
      },
    },

    {
      title: "Portado",
      dataIndex: "portability",
      width: 90,
      render: (
        portability) =>
        portability || "-",
    },



    {
      title: "Whatsapp",
      dataIndex: ["whatsapp", "is_comercial"],
      width: 90,
      render: (is_comercial, record) => {
        const whatsappData = record?.whatsapp;

        // Cenário 1: Telefone invalido
        const hasInvalidPhoneError =
          (whatsappData as { erro?: string } | null)?.erro === "Telefone inválido";

        if (hasInvalidPhoneError || whatsappData?.sucesso === false) {
          return <div className="flex items-center justify-center">Não</div>;
        }

        // Cenário 2: existe_no_whatsapp é false
        if (whatsappData?.existe_no_whatsapp === false) {
          return <div className="flex items-center justify-center">Não</div>;
        }

        // Casos com wpp valido
        return (
          <div className="flex items-center justify-center">
            {is_comercial === true ? (
              <Tooltip
                title="Business"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <img
                  src="/assets/whatsapp-business.png"
                  alt="Business"
                  className="h-6 w-6"
                />
              </Tooltip>
            ) : is_comercial === false ? (
              <Tooltip
                title="Messenger"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <img
                  src="/assets/whatsapp-messenger.png"
                  alt="Messenger"
                  className="h-6 w-6"
                />
              </Tooltip>
            ) : (
              "-"
            )}
          </div>
        );
      },
    },
    {
      title: "Telefone Adicional",
      dataIndex: "additional_phone",
      width: 180,
      render: (_, record) => {
        if (!record.additional_phone) return "-";

        const isValid = record.
          additional_phone_valid
          ;

        return (
          <span className="flex items-center gap-1">
            {formatPhoneNumber(record.additional_phone)}
            {isValid === true ? (
              <Tooltip
                title="Válido na ANATEL"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </Tooltip>
            ) : isValid === false ? (
              <Tooltip
                title="Inválido na ANATEL"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Tooltip>
            ) : null}
          </span>
        );
      },
      filters: [
        {
          text: "Preenchido",
          value: "preenchido",
        },
        {
          text: "Vazio",
          value: "vazio",
        },
      ],

      onFilter: (value, record) => {
        if (value === "preenchido") {
          return (
            record.phone !== null &&
            record.phone !== undefined &&
            record.phone !== ""
          );
        }
        if (value === "vazio") {
          return (
            record.phone === null ||
            record.phone === undefined ||
            record.phone === ""
          );
        }
        return true;
      }
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <span className="flex items-center gap-1">
          <Tooltip
            placement="topLeft"
            title={record.email || "-"}
            styles={{ body: { fontSize: "12px" } }}
          >
            <span
              style={{
                maxWidth: 180,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {record.email || "-"}
            </span>
          </Tooltip>
          {record.is_email_valid === true ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : record.is_email_valid === false ? (
            <XCircle className="h-4 w-4 text-red-500" />
          ) : null}
        </span>
      ),
      width: 240,
    },

    {
      title: "Status RFB",
      dataIndex: "rfb_status",
      key: "rfb_status",
      width: 90,
      render: (value) =>
        value === "ATIVA"
          ? "Ativa"
          : value === "INAPTA"
            ? "Inapta"
            : value === "SUSPENSA"
              ? "Suspensa"
              : value === "BAIXADA"
                ? "Baixada"
                : "-",
    },


    {
      title: "CEP",
      dataIndex: "zip_code",
      width: 130,
      render: (_, record) => {
        if (!record.zip_code) return "-";

        const isValidCep =
          record.address && record.district && record.city && record.state;
        const isCepUnico = record.single_zip_code;

        return (
          <span className="flex items-center gap-1">
            {record.zip_code}
            {isCepUnico ? (
              <Tooltip
                title="CEP único para localidade. Dados inseridos manualmente pelo usuário. Sujeito a erro de digitação."
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </Tooltip>
            ) : isValidCep ? (
              <Tooltip
                title="CEP válido com endereço completo"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </Tooltip>
            ) : (
              <Tooltip
                title="CEP inválido ou incompleto"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Tooltip>
            )}
          </span>
        );
      },
    },
    {
      title: "Endereço",
      dataIndex: "address",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip
          placement="topLeft"
          title={address}
          styles={{ body: { fontSize: "12px" } }}
        >
          {address || "-"}
        </Tooltip>
      ),
      width: 140,
    },
    {
      title: "Número",
      dataIndex: "address_number",
      width: 80,
      render: (addressnumber) => (addressnumber ? addressnumber : "-"),
    },
    {
      title: "Complemento",
      dataIndex: "address_complement",
      width: 120,
      render: (address_complement) =>
        address_complement ? address_complement : "-",
    },

    {
      title: "Bairro",
      dataIndex: "district",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (district) => (
        <Tooltip
          placement="topLeft"
          title={district}
          styles={{ body: { fontSize: "12px" } }}
        >
          {district || "-"}
        </Tooltip>
      ),
    },

    {
      title: "Cidade",
      dataIndex: "city",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (city) => (
        <Tooltip
          placement="topLeft"
          title={city}
          styles={{ body: { fontSize: "12px" } }}
        >
          {city || "-"}
        </Tooltip>
      ),
    },
    {
      title: "UF",
      dataIndex: "state",
      width: 60,
    },
    {
      title: "Coordenadas",
      dataIndex: "geolocation",
      width: 180,
      render: (geolocation) => {
        if (
          !geolocation ||
          !geolocation.latitude ||
          !geolocation.longitude
        ) {
          return "-";
        }
        const coordenadas = `Lat: ${geolocation.latitude}\nLong: ${geolocation.longitude}`;
        return (
          <Tooltip
            placement="topLeft"
            title={coordenadas}
            styles={{ body: { fontSize: "12px" } }}
          >
            <div style={{ whiteSpace: "nowrap" }}>
              <div>Lat: {geolocation.latitude}</div>
              <div>Long: {geolocation.longitude}</div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Maps",
      dataIndex: ["geolocation", "maps_link"],
      width: 80,
      ellipsis: {
        showTitle: false,
      },
      render: (maps_link) =>
        maps_link ? (
          <div className="flex items-center justify-center">
            <Tooltip
              placement="topLeft"
              title={maps_link}
              styles={{ body: { fontSize: "12px" } }}
            >
              <Button
                style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                }}
                type="default"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(maps_link, "_blank");
                }}
                tabIndex={0}
              >
                <MapIcon size={17} />
              </Button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span>-</span>
          </div>
        ),
    },
    {
      title: "Street View",
      dataIndex: ["geolocation", "street_view_link"],
      width: 110,
      ellipsis: {
        showTitle: false,
      },
      render: (street_view_link) =>
        street_view_link ? (
          <div className="flex items-center justify-center">
            <Tooltip
              placement="topLeft"
              title={street_view_link}
              styles={{ body: { fontSize: "12px" } }}
            >
              <Button
                style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                }}
                type="default"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(street_view_link, "_blank");
                }}
                tabIndex={0}
              >
                <MapPinned size={17} />
              </Button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span>-</span>
          </div>
        ),
    },
    {
      title: "Crédito",
      key: "credit",
      width: 100,
      render: (_, record) => formatBRL(record.credit) ?? "-",
      sorter: true,
      sortOrder:
        filters.sort === "credit"
          ? filters.order === "asc"
            ? "ascend"
            : filters.order === "desc"
              ? "descend"
              : undefined
          : undefined,
      onHeaderCell: () => ({
        onClick: () => {
          const newOrder =
            filters.sort === "credit" && filters.order === "asc"
              ? "desc"
              : "asc";
          const params = new URLSearchParams(window.location.search);
          params.set("sort", "credit");
          params.set("order", newOrder);
          params.set("page", "1");
          navigate(`?${params.toString()}`);
        },
        style: { cursor: "pointer" },
      }),
    },

  ];

  const companies =
    clientsQuery?.clients?.filter((client) => client.client_type === "PJ") || [];


  return {
    removeClients,
    tableColumns,
    clientsQuery,
    isModalOpen,
    showModal,
    styles: { customTable: styles.customTable },
    companies,
    totalCompanies: clientsQuery?.total || 0,
    closeModal,
    isClientsFetching,
  };
}
