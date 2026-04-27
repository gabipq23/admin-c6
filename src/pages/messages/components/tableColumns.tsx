import { IContact } from "@/interfaces/contacts";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { TableColumnsType, Tooltip } from "antd";

const getStatus = (status: string) => {
    if (status === "Nova Mensagem") {
        return (
            <span className="flex items-center gap-2">
                Nova Mensagem{" "}
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </span>
        );
    } else {
        return <span className="flex items-center gap-2">{status}</span>;
    }
};


export const tableColumns: TableColumnsType<IContact> = [
    {
        title: "ID",
        dataIndex: "id",
        width: 60,
    },
    {
        title: "Nome",
        dataIndex: "name",
        width: 130,
        ellipsis: {
            showTitle: false,
        },
        render: (name) => (
            <Tooltip
                placement="topLeft"
                title={name}
                styles={{ body: { fontSize: "12px" } }}
            >
                {name}
            </Tooltip>
        ),
    },
    {
        title: "Email",
        dataIndex: "email",
        width: 140,
    },
    {
        title: "Telefone",
        dataIndex: "phone",
        width: 100,
        render: (value) => formatPhoneNumber(value),
    },
    // {
    //     title: "CPF",
    //     dataIndex: "cpf",
    //     width: 120,
    //     render: (value) => formatCPF(value),
    // },
    // {
    //     title: "CNPJ",
    //     dataIndex: "cnpj",
    //     width: 120,
    //     render: (value) => formatCNPJ(value),
    // },
    // {
    //     title: "Assunto",
    //     dataIndex: "subject",
    //     width: 160,
    //     ellipsis: {
    //         showTitle: false,
    //     },
    //     render: (subject) => (
    //         <Tooltip
    //             placement="topLeft"
    //             title={subject}
    //             styles={{ body: { fontSize: "12px" } }}
    //         >
    //             {subject}
    //         </Tooltip>
    //     ),
    // },
    {
        title: "Data de Envio",
        dataIndex: "created_at",
        width: 120,
        // sorter: true,
        // sortOrder:
        //   filters.sort === "created_at"
        //     ? filters.order === "asc"
        //       ? "ascend"
        //       : filters.order === "desc"
        //         ? "descend"
        //         : undefined
        //     : undefined,
        // onHeaderCell: () => ({
        //   onClick: () => {
        //     const newOrder =
        //       filters.sort === "created_at" && filters.order === "asc"
        //         ? "desc"
        //         : "asc";
        //     const params = new URLSearchParams(window.location.search);
        //     params.set("sort", "created_at");
        //     params.set("order", newOrder);
        //     params.set("page", "1");
        //     navigate(`?${params.toString()}`);
        //   },
        //   style: { cursor: "pointer" },
        // }),
    },
    {
        title: "Status",
        dataIndex: "status_message",
        width: 110,
        render: (_value, record) => getStatus(record.status_message),
    },
];