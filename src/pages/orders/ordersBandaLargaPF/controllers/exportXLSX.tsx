import { OrderC6Bank } from "@/interfaces/orders";
import * as XLSX from "xlsx";

const getNestedValue = (obj: unknown, path: string): unknown => {
  return path.split(".").reduce((acc: unknown, prop: string) => {
    if (acc && typeof acc === "object" && prop in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[prop];
    }
    return undefined;
  }, obj);
};

const getFlatValue = (obj: unknown, key: string): unknown => {
  return (obj as unknown as Record<string, unknown>)[key];
};

const toYesNo = (value: unknown): string => {
  if (value === null || value === undefined) return "-";
  return value === true || value === 1 ? "Sim" : "Nao";
};
export const handleExportXLSX = (
  data: OrderC6Bank[] | undefined | any,
  selectedRowKeys: Array<string | number> | undefined,
) => {
  const list: OrderC6Bank[] = Array.isArray(data) ? data : data?.orders ?? [];

  if (!list.length || !selectedRowKeys || selectedRowKeys.length === 0) return;

  const pedidosSelecionados = list.filter((item) =>
    selectedRowKeys.map(String).includes(String(item.id)),
  );
  if (!pedidosSelecionados || pedidosSelecionados.length === 0) return;

  const camposDataHora = [
    "created_at",
    "updated_at",
    "app_click_at",
    "app_register_at",
    "portability_date",
    "rfb_birth_date",
  ];

  const ordemColunas = [
    "order_number",
    "created_at",
    "updated_at",
    "status",
    "after_sales_status",

    // Pessoal
    "full_name",
    "cpf",
    "email",
    "phone",
    "rfb_name",
    "rfb_birth_date",
    "rfb_gender",
    "rfb_mother_name",
    "phone_valid",
    "operator",
    "portability",
    "portability_date",
    "is_email_valid",

    // Empresarial
    "cnpj",
    "company_legal_name",
    "is_socio",
    "is_mei",
    "company_partners",

    // Produtos
    "product_account_opening",
    "product_card_machine",
    "product_credit_card",
    "product_loan",
    "loan_amount",

    // App C6
    "app_click",
    "app_click_at",
    "app_register",
    "app_register_at",

    // Consultor
    "responsible_consultant",
    "team",
    "consultant_notes",
    "consultant_observation",

    // Técnico
    "url",
    "client_ip",
    "ip_isp",
    "ip_access_type",
    "fingerprint_id",
    "corporate_id",
    "crm_id",
    "pf_temperature",

    // Geolocation
    "geolocation.latitude",
    "geolocation.longitude",
    "geolocation.maps_link",
    "geolocation.street_view_link",

    // WhatsApp
    "whatsapp.avatar",
    "existe_no_whatsapp",
  ];

  const colNames: Record<string, string> = {
    order_number: "Numero do Pedido",
    created_at: "Data de Criação",
    updated_at: "Data de Atualização",
    status: "Status",
    after_sales_status: "Status Pos-Venda",

    full_name: "Nome Completo",
    cpf: "CPF",
    email: "E-mail",
    phone: "Telefone",
    rfb_name: "Nome na Receita",
    rfb_birth_date: "Nascimento na Receita",
    rfb_gender: "Genero na Receita",
    rfb_mother_name: "Nome da Mae na Receita",
    phone_valid: "Telefone Valido",
    operator: "Operadora",
    portability: "Portabilidade",
    portability_date: "Data Portabilidade",
    is_email_valid: "Email Valido",

    cnpj: "CNPJ",
    company_legal_name: "Razao Social",
    is_socio: "E Socio",
    is_mei: "E MEI",
    company_partners: "Empresas",

    product_account_opening: "Abertura de Conta",
    product_card_machine: "Maquininha",
    product_credit_card: "Cartao de Credito",
    product_loan: "Emprestimo",
    loan_amount: "Valor do Emprestimo",

    app_click: "Click App",
    app_click_at: "Data/Hora Click App",
    app_register: "Cadastro App",
    app_register_at: "Data/Hora Cadastro App",

    responsible_consultant: "Consultor Responsavel",
    team: "Equipe",
    consultant_notes: "Notas do Consultor",
    consultant_observation: "Observacao do Consultor",

    url: "URL",
    client_ip: "IP do Cliente",
    ip_isp: "IP ISP",
    ip_access_type: "Tipo de Acesso IP",
    fingerprint_id: "Fingerprint ID",
    corporate_id: "ID Corporativo",
    crm_id: "ID CRM",
    pf_temperature: "Temperatura PF",

    "geolocation.latitude": "Geolocalizacao Latitude",
    "geolocation.longitude": "Geolocalizacao Longitude",
    "geolocation.maps_link": "Link Google Maps",
    "geolocation.street_view_link": "Link Street View",

    "whatsapp.avatar": "WhatsApp Avatar",
    existe_no_whatsapp: "Existe no WhatsApp",
  };

  const pedidosFormatados = pedidosSelecionados.map((pedido) => {
    const linha: Record<string, unknown> = {};

    ordemColunas.forEach((key) => {
      const columnName = colNames[key] || key;

      if (key.includes(".")) {
        const valor = getNestedValue(pedido, key);
        if (valor !== undefined) {
          linha[columnName] = camposDataHora.includes(key) ? valor : valor || "";
        } else {
          linha[columnName] = "";
        }
      } else {
        const valor = getFlatValue(pedido, key);
        if (valor !== undefined) {
          linha[columnName] = camposDataHora.includes(key) ? valor : valor ?? "";
        } else {
          linha[columnName] = "";
        }
      }
    });

    // Booleanos formatados
    linha[colNames["phone_valid"]] = toYesNo(pedido.phone_valid);
    linha[colNames["is_email_valid"]] = toYesNo(pedido.is_email_valid);
    linha[colNames["is_socio"]] = toYesNo(pedido.is_socio);
    linha[colNames["is_mei"]] = toYesNo(pedido.is_mei);
    linha[colNames["existe_no_whatsapp"]] = toYesNo(pedido.existe_no_whatsapp);
    linha[colNames["product_account_opening"]] = toYesNo(pedido.product_account_opening);
    linha[colNames["product_card_machine"]] = toYesNo(pedido.product_card_machine);
    linha[colNames["product_credit_card"]] = toYesNo(pedido.product_credit_card);
    linha[colNames["product_loan"]] = toYesNo(pedido.product_loan);
    linha[colNames["app_click"]] = toYesNo(pedido.app_click);
    linha[colNames["app_register"]] = toYesNo(pedido.app_register);

    // Valor do empréstimo formatado como moeda
    linha[colNames["loan_amount"]] =
      pedido.loan_amount == null
        ? "-"
        : pedido.loan_amount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

    // Empresas formatadas
    linha[colNames["company_partners"]] = pedido.company_partners
      ? pedido.company_partners
        .map((e) => `${e.nome} (${e.cnpj}) - ${e.porte}`)
        .join(" | ")
      : "-";

    return linha;
  });

  const pedidoSheet = XLSX.utils.json_to_sheet(pedidosFormatados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, pedidoSheet, "Pedidos");
  XLSX.writeFile(workbook, `pedidos-c6bank.xlsx`);
};