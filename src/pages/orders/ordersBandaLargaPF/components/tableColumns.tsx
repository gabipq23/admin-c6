import { Thermometer } from "@/components/chat/common/thermometer";
import { formatCPF } from "@/utils/formatCPF";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, TableColumnsType, Tooltip } from "antd";
import { Dispatch, SetStateAction } from "react";
import {
    AlertCircle,
    CheckCircle2,
    MapIcon,
    MapPinned,
    Mars,
    Monitor,
    Smartphone,
    Tablet,
    Venus,
    XCircle,
} from "lucide-react";
import { formatBrowserDisplay, formatOSDisplay } from "@/utils/formatClientEnvironment";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { OrderC6Bank } from "@/interfaces/orders";
import { useNavigate } from "react-router-dom";
import { getFiltersFromURL } from "../controllers/filterController";
import { formatCNPJ } from "@/utils/formatCNPJ";
export const useAllTableColumns = ({
    setSelectedAvatar,
    setIsModalAvatarOpen,
}: {
    setSelectedAvatar: Dispatch<SetStateAction<string | null>>;
    setIsModalAvatarOpen: Dispatch<SetStateAction<boolean>>;
}): TableColumnsType<OrderC6Bank> => {
    const navigate = useNavigate();
    const filters = getFiltersFromURL();

    return [
        {
            title: "",
            dataIndex: "consultant_observation",
            width: 30,
            render: (consultant_observation) => (
                <Tooltip
                    placement="top"
                    title={consultant_observation || "Sem observações"}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {consultant_observation && <ExclamationCircleOutlined />}
                </Tooltip>
            ),
        },
        {
            title: "",
            dataIndex: ["whatsapp", "avatar"],
            width: 80,
            render: (avatar, record) => {
                const avatarSrc = avatar || "/assets/anonymous_avatar.png";
                const handleAvatarClick = (event: React.MouseEvent) => {
                    event.stopPropagation();
                    setSelectedAvatar(avatarSrc);
                    setIsModalAvatarOpen(true);
                };

                if (record.temperatura_pf === 10) {
                    return (
                        <div className="flex bg-[#d63535] rounded-full w-9 h-9 items-center justify-center relative">

                            <button
                                type="button"
                                className="appearance-none bg-transparent border-0 rounded-full w-9 h-9 p-0 m-0 min-w-0 flex items-center justify-center overflow-hidden cursor-pointer"
                                onClick={handleAvatarClick}
                            >
                                <img
                                    src={avatarSrc}
                                    className="rounded-full w-9 h-9 object-cover"
                                />
                                <div className="text-sm absolute -top-1 -right-1 flex items-center justify-center">
                                    🔥
                                </div>
                            </button>
                        </div>
                    );
                }
                return (
                    <button
                        type="button"
                        className="appearance-none bg-transparent border-0 rounded-full w-9 h-9 p-0 m-0 min-w-0 flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={handleAvatarClick}
                    >
                        <img
                            src={avatarSrc}
                            className="h-9 w-9 rounded-full"
                            onClick={handleAvatarClick}
                        /></button>
                );
            },
        },
        {
            title: "Temperatura",
            dataIndex: "pf_temperature",
            width: 140,
            render: (pf_temperature) => (
                <div className="flex w-[120px] h-2 items-center gap-1 mr-4">
                    {" "}
                    <Thermometer min={0} max={10} value={pf_temperature || 0} />
                </div>
            ),
        },
        {
            title: "ID do Lead",
            dataIndex: "order_number",
            width: 130,
            render: (order_number, record) =>
                order_number ? order_number : record.id || "-",
        },
        {
            title: "Abertura",
            dataIndex: "created_at",
            width: 110,
            sorter: true,
            sortOrder:
                filters.sort === "created_at"
                    ? filters.order === "asc"
                        ? "ascend"
                        : filters.order === "desc"
                            ? "descend"
                            : undefined
                    : undefined,
            onHeaderCell: () => ({
                onClick: () => {
                    const newOrder =
                        filters.sort === "created_at" && filters.order === "asc"
                            ? "desc"
                            : "asc";
                    const params = new URLSearchParams(window.location.search);
                    params.set("sort", "created_at");
                    params.set("order", newOrder);
                    params.set("page", "1");
                    navigate(`?${params.toString()}`);
                },
                style: { cursor: "pointer" },
            }),
        },
        {
            title: "Pedido",
            dataIndex: "status",
            render: (status: string) =>
                status === "ABERTO"
                    ? "Aberto"
                    : status === "FECHADO"
                        ? "Fechado"
                        : status === "CANCELADO"
                            ? "Cancelado"
                            : "-",
            width: 80,
        },
        {
            title: "Tramitação",
            ellipsis: {
                showTitle: false,
            },
            dataIndex: "after_sales_status",
            width: 155,
            sorter: true,
            sortOrder:
                filters.sort === "status_pos_venda"
                    ? filters.order === "asc"
                        ? "ascend"
                        : filters.order === "desc"
                            ? "descend"
                            : undefined
                    : undefined,
            onHeaderCell: () => ({
                onClick: () => {
                    const newOrder =
                        filters.sort === "status_pos_venda" && filters.order === "asc"
                            ? "desc"
                            : "asc";
                    const params = new URLSearchParams(window.location.search);
                    params.set("sort", "status_pos_venda");
                    params.set("order", newOrder);
                    params.set("page", "1");
                    navigate(`?${params.toString()}`);
                },
                style: { cursor: "pointer" },
            }),
            render: (after_sales_status) => (
                <Tooltip
                    placement="topLeft"
                    title={after_sales_status}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {after_sales_status || "-"}
                </Tooltip>
            ),
        },

        {
            title: "Recadastro",
            dataIndex: "number_attempts_second_call",
            width: 110,
            render: (number_attempts_second_call) => number_attempts_second_call || "-",
        },
        {
            title: "CNPJ",
            dataIndex: "cnpj",
            width: 150,
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
                        record.cnpj !== null && record.cnpj !== undefined && record.cnpj !== ""
                    );
                }
                if (value === "vazio") {
                    return (
                        record.cnpj === null || record.cnpj === undefined || record.cnpj === ""
                    );
                }
                return true;
            },
        },
        {
            title: "Razão Social",
            dataIndex: "company_legal_name",
            width: 120,
            render: (company_legal_name) => company_legal_name || "-",
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
            title: "Nome",
            dataIndex: "full_name",
            ellipsis: {
                showTitle: false,
            },
            render: (full_name, record) => {
                const compareNames = (
                    name1?: string | null,
                    name2?: string | null,
                ) => {
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

                const isNamesMatch = compareNames(full_name, record.rfb_name
                );

                return (
                    <>
                        {full_name ? (
                            <span className="flex items-center gap-1">
                                {full_name}
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
                const compareDates = (
                    date1?: string | null,
                    date2?: string | null,
                ) => {
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
                const compareNames = (
                    name1?: string | null,
                    name2?: string | null,
                ) => {
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
            title: "Abertura de Conta",
            dataIndex: "product_account_opening",
            width: 140,
            render: (value) =>
                value ? "Sim" : value === undefined || value === null ? "-" : "Não",
        },
        {
            title: "Maquininha",
            dataIndex: "product_card_machine",
            width: 120,
            render: (value) =>
                value ? "Sim" : value === undefined || value === null ? "-" : "Não",
        },
        {
            title: "Cartão de Crédito",
            dataIndex: "product_credit_card",
            width: 140,
            render: (value) =>
                value ? "Sim" : value === undefined || value === null ? "-" : "Não",
        },
        {
            title: "Empréstimo",
            dataIndex: "product_loan",
            width: 120,
            render: (value) =>
                value ? "Sim" : value === undefined || value === null ? "-" : "Não",
        },
        {
            title: "R$ Empréstimo",
            dataIndex: "loan_amount",
            width: 120,
            render: (value) =>
                value == null
                    ? "-"
                    : value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        },
        {
            title: "Click App",
            dataIndex: "app_click",
            width: 120,
            render: (value) =>
                value ? "Sim" : value === undefined || value === null ? "-" : "Não",
        },
        {
            title: "Data/Hora Click",
            dataIndex: "app_click_at",
            width: 130,
            render: (value) =>
                value
                    ? new Date(value).toLocaleString("pt-BR")
                    : "-",
        },
        {
            title: "Cadastro App",
            dataIndex: "app_register",
            width: 120,
            render: (value) =>
                value ? "Sim" : value === undefined || value === null ? "-" : "Não",
        },
        {
            title: "Data/Hora Cadastro",
            dataIndex: "app_register_at",
            width: 150,
            render: (value) =>
                value
                    ? new Date(value).toLocaleString("pt-BR")
                    : "-",
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
            width: 180,
            render: (_, record) => {
                if (!record.phone) return "-";

                const isValid = Number(record.phone_valid);

                return (
                    <span className="flex items-center gap-1">
                        {formatPhoneNumber(record.phone)}
                        {isValid === 1 ? (
                            <Tooltip
                                title="Válido na ANATEL"
                                placement="top"
                                styles={{ body: { fontSize: "12px" } }}
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : isValid === 0 ? (
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
            title: "URL",
            dataIndex: "url",
            width: 140,
            ellipsis: {
                showTitle: false,
            },
            render: (url) => (
                <Tooltip
                    placement="topLeft"
                    title={url}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {url || "-"}
                </Tooltip>
            ),
        },
        {
            title: "IP do Cliente",
            dataIndex: "client_ip",
            width: 120,
            render: (client_ip) => (client_ip ? client_ip : "-"),
        },
        {
            title: "Provedor",
            dataIndex: "ip_isp",
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (ip_isp) => (
                <Tooltip
                    placement="topLeft"
                    title={ip_isp}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {ip_isp}
                </Tooltip>
            ),
        },
        {
            title: "Tipo de acesso",
            dataIndex: "ip_access_type",
            width: 120,
            render: (ip_access_type) =>
                ip_access_type === "movel"
                    ? "Móvel"
                    : ip_access_type === "fixo"
                        ? "Fixo"
                        : ip_access_type === "hosting"
                            ? "Hosting"
                            : ip_access_type === "proxy"
                                ? "Proxy"
                                : ip_access_type === "local"
                                    ? "Local"
                                    : ip_access_type === "desconhecido"
                                        ? "Desconhecido"
                                        : "-",
        },
        {
            title: "Dispositivo",
            dataIndex: ["fingerprint", "device"],
            width: 100,
            render: (device) => (
                <div className="flex items-center justify-center">
                    {device === "mobile" ? (
                        <Tooltip
                            title="Mobile"
                            placement="top"
                            styles={{ body: { fontSize: "12px" } }}
                        >
                            <Smartphone className="h-4 w-4 text-gray-600" />
                        </Tooltip>
                    ) : device === "desktop" ? (
                        <Tooltip
                            title="Desktop"
                            placement="top"
                            styles={{ body: { fontSize: "12px" } }}
                        >
                            <Monitor className="h-4 w-4 text-gray-600" />
                        </Tooltip>
                    ) : device === "tablet" ? (
                        <Tooltip
                            title="Tablet"
                            placement="top"
                            styles={{ body: { fontSize: "12px" } }}
                        >
                            <Tablet className="h-4 w-4 text-gray-600" />
                        </Tooltip>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
        {
            title: "Plataforma",
            dataIndex: ["fingerprint", "os"],
            width: 140,
            render: (os) => formatOSDisplay(os),
        },
        {
            title: "Browser",
            dataIndex: ["fingerprint", "browser"],
            width: 120,
            render: (browser) => formatBrowserDisplay(browser),
        },
        {
            title: "TimeZone",
            dataIndex: ["fingerprint", "timezone"],
            width: 210,
            ellipsis: {
                showTitle: false,
            },
            render: (timezone, record) => {
                const timezoneName = record?.fingerprint?.timezone_name;
                const value = [timezone, timezoneName].filter(Boolean).join(" - ");

                return (
                    <Tooltip
                        placement="topLeft"
                        title={value || "-"}
                        styles={{ body: { fontSize: "12px" } }}
                    >
                        {value || "-"}
                    </Tooltip>
                );
            },
        },
        {
            title: "Resolução",
            dataIndex: ["fingerprint", "resolution"],
            width: 120,
            render: (resolution) => {
                if (resolution && resolution.width && resolution.height) {
                    return `${resolution.width} x ${resolution.height}`;
                }
                return "-";
            },
        },
        {
            title: "ID Fingerprint",
            dataIndex: "fingerprint_id",
            width: 120,
            render: (fingerprintId) => fingerprintId || "-",
        },


        {
            title: "Consultor",
            dataIndex: "responsible_consultant",
            width: 120,
            render: (responsible_consultant) =>
                responsible_consultant ? responsible_consultant : "-",
        },
        {
            title: "ID CRM",
            dataIndex: "crm_id",
            width: 120,
            render: (crm_id) => (crm_id ? crm_id : "-"),
        },
        {
            title: "Atendimento",
            dataIndex: "service",
            width: 110,
            render: (service) => service || "-",
        },

    ];


}